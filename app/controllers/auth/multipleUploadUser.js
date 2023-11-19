const {
  presence_employee,
  presence_list_day,
  Sequelize,
  presence_schedule_employee,
  presence_location_work,
  user,
  sequelize,
} = require("../../../models");
const { Op } = require("sequelize");
const excelJS = require("exceljs");
const dayjs = require("dayjs");
const fs = require("fs");
const bcrypt = require("bcrypt");

const authExportFormatDataExcel = async (req, res) => {
  let filename =
    "format-data-karyawan-" + dayjs().format("DD/MM/YYYY-HH:mm:ss") + ".xlsx";

  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("format-data-user");

  worksheet.columns = [
    { header: "Email", key: "email", style: { numFmt: "" } },
    { header: "Name", key: "name" },
    { header: "Username", key: "username" },
  ];

  try {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Filename", filename);

    return workbook.xlsx
      .write(res)
      .then(function () {
        res.status(200).end();
      })
      .catch((error) => {
        res.status(500).json({
          message: error?.errors || "Server Internal Error",
          meta: {
            status: 500,
          },
        });
      });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const authUploadMultipleUser = async (req, res) => {
  const workbook = new excelJS.Workbook();
  await workbook.xlsx.load(req?.file?.buffer);
  const worksheet = workbook.getWorksheet("format-data-user");

  const emailCol = worksheet.getColumn("A");
  const nameCol = worksheet.getColumn("B");
  const usernameCol = worksheet.getColumn("C");
  let tempData = [];

  worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    if (rowNumber > 1) {
      tempData = [
        ...tempData,
        {
          email: emailCol.values[rowNumber]?.text ?? "",
          name: nameCol.values[rowNumber] ?? "",
          username: usernameCol.values[rowNumber] ?? "",
        },
      ];
    }
  });

  const t = await sequelize.transaction();

  try {
    let findEmptyField = false;
    tempData?.forEach((temp) => {
      if (temp?.email === "" || temp?.name === "" || temp?.username === "") {
        findEmptyField = true;
      }
    });

    if (findEmptyField) {
      return res.status(400).json({
        message: "Semua field wajib diisi",
        meta: {
          status: 400,
        },
      });
    }
    await Promise.all(
      tempData?.map(async (temp) => {
        const find = await user.findOne({
          where: {
            email: temp?.email?.toLowerCase(),
          },
        });
        if (find) {
          const data = {
            username: temp?.username,
            name: temp?.name,
          };
          return await user.update(
            data,
            {
              where: {
                id: find?.id,
              },
            },
            {
              transaction: t,
            }
          );
        } else {
          const passwordCrypt = await bcrypt.hash("123123", 13);
          const data = {
            email: temp?.email,
            username: temp?.username,
            name: temp?.name,
            password: passwordCrypt,
          };
          return await user.create(data, { transaction: t });
        }
      })
    );

    await t.commit();

    return res.json({
      message: "Success",
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    await t.rollback();
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

module.exports = {
  authExportFormatDataExcel,
  authUploadMultipleUser,
};
