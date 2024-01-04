const { Principal } = require("@dfinity/principal");

module.exports = {
  isValidPrincipal(principalText) {
    try {
      const principal = Principal.fromText(principalText);
      return true;
    } catch (error) {
      return false;
    }
  },
};
