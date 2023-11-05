const convertToBoolean = (val) => {
  switch (val) {
    case "true":
    case "1":
    case true:
    case 1:
      return true;

    default:
      return false;
  }
};

module.exports = convertToBoolean;
