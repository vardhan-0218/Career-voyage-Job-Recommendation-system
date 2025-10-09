import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // must match cookie name
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default isAuthenticated;