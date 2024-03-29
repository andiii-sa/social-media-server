const {
  blogAdd,
  blogDelete,
  blogDetail,
  blogEdit,
  blogPaginationAdmin,
  blogPaginationUser,
  blogRestore,
} = require("./blog");
const {
  blogCategoryAdd,
  blogCategoryDelete,
  blogCategoryDetail,
  blogCategoryEdit,
  blogCategoryAll,
  blogCategoryPagination,
  blogCategoryRestore,
} = require("./blogCategory");

module.exports = {
  blogAdd,
  blogDelete,
  blogRestore,
  blogDetail,
  blogEdit,
  blogPaginationAdmin,
  blogPaginationUser,
  blogCategoryAdd,
  blogCategoryDelete,
  blogCategoryDetail,
  blogCategoryEdit,
  blogCategoryAll,
  blogCategoryPagination,
  blogCategoryRestore,
};
