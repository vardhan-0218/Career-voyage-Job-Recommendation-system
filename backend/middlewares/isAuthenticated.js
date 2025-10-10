// File: isAuthenticated.js (APPLY THIS CHANGE)

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// dotenv.config(); // Ensure this is run globally if not in your main file

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // 🚨 FINAL FIX 🚨: Use the SECRET_KEY from the environment
    // Note: If you have a JWT_SECRET defined in your environment, 
    // you must ensure SECRET_KEY and JWT_SECRET have the SAME value.
    const secret = process.env.SECRET_KEY || process.env.JWT_SECRET;
    
    if (!secret) {
        // If the secret is missing entirely, this is a fatal deployment error.
        console.error("JWT Secret is not defined in environment variables.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    const decoded = jwt.verify(token, secret); 
    req.user = decoded;
    
    // 🔑 Critical: Set req.id for all controllers (job, company, application)
    req.id = decoded.userId; 
    
    next();
  } catch (err) {
    // Catches expired tokens or invalid signatures
    console.error("JWT Verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default isAuthenticated;