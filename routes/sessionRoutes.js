import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/authMiddleware.js";

// 1. IMPORT the logic (Do NOT redefine it below)
import { runAutoSchedule } from "../services/schedulerService.js";
import * as sessionController from "../controllers/sessionController.js";
import db from "../database/database.js";

// --- ROUTES ---

// Get the full timetable
router.get("/",  sessionController.getSessions);


// Export the timetable as CSV
router.get("/export",verifyToken, async (req, res) => {
	try {
		const [sessions] = await db.query(`
            SELECT c.title, t.last_name, r.name, ts.day_of_week, ts.start_time
            FROM sessions s
            JOIN courses c ON s.course_id = c.course_id
            JOIN teachers t ON s.teacher_id = t.teacher_id
            JOIN rooms r ON s.room_id = r.room_id
            JOIN time_slots ts ON s.slot_id = ts.slot_id
        `);

		let csv = "Course,Teacher,Room,Day,Start\n";
		sessions.forEach((s) => {
			csv += `"${s.title}","${s.last_name}","${s.name}","${s.day_of_week}","${s.start_time}"\n`;
		});

		res.header("Content-Type", "text/csv");
		res.attachment("timetable.csv");
		return res.send(csv);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Trigger the Algorithm
router.post("/generate", verifyToken, async (req, res) => {
	try {
		const result = await runAutoSchedule();
		res.json(result);
	} catch (err) {
		res.status(500).json({ error: "Algorithm failed: " + err.message });
	}
});

// Manual Add
// router.post("/add", sessionController.createSession);

// 2. ADD THIS: Clear the timetable (Very helpful for testing)
router.delete("/clear", verifyToken, async (req, res) => {
	try {
		await db.query("DELETE FROM sessions");
		await db.query("ALTER TABLE sessions AUTO_INCREMENT = 1");
		res.json({ message: "Timetable cleared" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/demand", verifyToken, sessionController.createDemand);

export default router;
