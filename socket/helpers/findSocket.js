module.exports = {
  findSocketByPrincipal(principal) {
    return principalSocketMap[principal];
  },
};
