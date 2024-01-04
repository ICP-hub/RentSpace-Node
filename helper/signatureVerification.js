const { fromHex } = require("@dfinity/agent");
const crypto = require("crypto");

module.exports = signatureVerification = async (publicKey, signature, data) => {
  try {
    const params = {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    };

    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      "raw",
      Buffer.from(fromHex(publicKey)),
      { name: "ECDSA", namedCurve: "P-256" }, // Adjust the algorithm and curve as needed
      true, // Whether the key is extractable
      ["verify"] // The key usages
    );

    const result = await crypto.webcrypto.subtle.verify(
      params,
      cryptoKey,
      fromHex(signature),
      data
    );
    return result;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
