// File: isAuthenticated.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// dotenv.config(); // Assuming dotenv is configured elsewhere, but good practice to ensure it's loaded if needed.

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // FIX 1: Ensure JWT_SECRET matches the signing secret (process.env.SECRET_KEY from user.controller.js)
    const decoded = jwt.verify(token, process.env.SECRET_KEY); 
    req.user = decoded;
    // FIX 2: Manually set req.id, which is expected by all controllers (job.controller, company.controller, etc.)
    // The JWT payload from user.controller.js:login is { userId: user._id }
    req.id = decoded.userId; 
    next();
  } catch (err) {
    // This catches expired tokens or invalid signatures
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default isAuthenticated;