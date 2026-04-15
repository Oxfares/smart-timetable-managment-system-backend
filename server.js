import express from "express";
import cors from "cors";
import "dotenv/config";
import sessionRoutes from "./routes/sessionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import logger from "./middleware/logger.js";

const app = express();

// Enable CORS for ALL origins and methods
// This ensures your React (Web) and Flutter (Mobile) apps won't be blocked
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"ngrok-skip-browser-warning",
		],
	}),
);

app.use(express.json());

// Auth routes usually don't need the custom logger if it's for timetable tracking
app.use("/api/auth", authRoutes);

// Custom Middleware
app.use(logger);

// Main Routes
app.use("/api/sessions", sessionRoutes);

const port = process.env.PORT || 8000;

// "0.0.0.0" is perfect here; it allows access from your local network (for Flutter)
app.listen(port, "0.0.0.0", () => {
	console.log(`🚀 Server active on port ${port}`);
	console.log(`🔗 Local API: http://localhost:${port}/api`);
});
