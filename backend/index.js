import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

// ADDED: Import 'path' to correctly resolve file paths for deployment
import path from "path";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Proper CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://career-voyage.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ API Routes (MUST come first)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
// ----------------------------------------------------------------------
// 🚨 FIX FOR DEPLOYMENT 404 ERRORS 🚨
// ----------------------------------------------------------------------

// Assume your *built* React frontend is located in a folder named 'client/dist' relative to index.js
const FRONTEND_DIST_PATH = path.join(path.resolve(), 'client', 'dist');

// 1. Serve static files from the frontend build directory
app.use(express.static(FRONTEND_DIST_PATH));

// 2. CATCH-ALL/FALLBACK route: For any other GET request (i.e., client-side route),
// serve the index.html file to let React Router handle the path.
app.get("*", (req, res) => {
    // We check if the request looks like an API call. If it does, we return a 404 
    // to avoid serving the index.html for a failed API route.
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).send('API route not found');
    }
    
    // Otherwise, serve index.html for client-side routing.
    res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'));
});

// ----------------------------------------------------------------------

// ✅ Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(` Server running on port ${PORT}`);
});