const { Actor, HttpAgent } = require("@dfinity/agent");

// Imports and re-exports candid interface
const { idlFactory } = require("./hotel.did.js");
const { Principal } = require("@dfinity/principal");

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
const canisterId = Principal.fromText("bw4dl-smaaa-aaaaa-qaacq-cai");

const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

const hotel = createActor(canisterId, {
  agentOptions: {
    fetchOptions: {
      reactNative: {
        __nativeResponseType: "base64",
      },
    },
    callOptions: {
      reactNative: {
        textStreaming: true,
      },
    },
    blsVerify: () => true,
    host: "http://127.0.0.1:4943",
  },
});
module.exports = { hotel, canisterId, idlFactory, createActor };
