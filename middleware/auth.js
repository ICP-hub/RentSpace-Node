const { User } = require("../models/User");

async function validateUser(req, res, next) {
  try {
    const principal = req.headers["x-principal"];
    const privateToken = req.headers["x-private-token"];

    if (!principal || !privateToken) {
      return res.status(401).json({ error: "Unauthorized: Missing credentials" });
    }

    // Check if the user with the provided principal and privateToken exists
    const user = await User.findOne({
      where: { principal, privateToken },
    });

    if (user) {
      // Attach the user object to the request for later use
      req.user = user;
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(401).json({ error: "Unauthorized: Invalid credentials" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = validateUser;
