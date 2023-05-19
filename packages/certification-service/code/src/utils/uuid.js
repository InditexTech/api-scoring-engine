const { v4: uuidv4 } = require("uuid");

const uuid = () => {
  return uuidv4();
};

module.exports = {
  uuid,
};
