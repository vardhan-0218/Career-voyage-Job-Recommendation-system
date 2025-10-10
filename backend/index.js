import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

// ✅ Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize Express
const app = express();

// -------------------------
// Middlewares
// -------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173", // dev frontend
    "https://career-voyage.onrender.com", // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

// -------------------------
// API Routes
// -------------------------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// -------------------------
// Serve frontend in production
// -------------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // Catch-all route: serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).send("API route not found");
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Dev mode
  app.get("/", (req, res) => {
    res.send("<h1>Server Working ✅ (Development Mode)</h1>");
  });
}

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running on port ${PORT}`);
});
