const { fromHex } = require('@dfinity/agent');
const crypto = require('crypto');

module.exports = signatureVerification = async (publicKey, signature, data) => {
    try {
        const params = {
            name: 'ECDSA',
            hash: {name: 'SHA-256'},
          };

          const cryptoKey = await crypto.webcrypto.subtle.importKey(
            'raw',
            Buffer.from(fromHex(publicKey)),
            { name: 'ECDSA', namedCurve: 'P-256' }, // Adjust the algorithm and curve as needed
            true, // Whether the key is extractable
            ['verify'] // The key usages
          );
          console.log("cryptoKey",cryptoKey)
          console.log("fromHex(data)",fromHex(data))

          const result = await crypto.webcrypto.subtle.verify(
            params,
            cryptoKey,
            fromHex(signature),
            fromHex(data),
          );
          console.log("result",result)
          return result;
    } catch (error) {
        console.log("error", error)
        return false;
    }
};

signatureVerification("04169f69974aca601730008d9c10309aedeb26834777f0720cbfb8a1fec82a34c44ab5467a82b7964cac7996d87edb9133f826d3bd583156b63124bfe4270dd333","3045022029e3b6c152fe13451046cd8cec74ba390efc56fc1242538c2f37596759dac135022100ad1a0168e140616531fc0d3bb42c4afae81c9a2d44d514303f21d29ab6893c9c","b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9")
