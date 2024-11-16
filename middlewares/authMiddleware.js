const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Check if the token is in the format "Bearer <token>"
    const tokenStripped = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify the token
    const decoded = jwt.verify(tokenStripped, process.env.JWT_SECRET);

    // Attach user ID to the request object
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
