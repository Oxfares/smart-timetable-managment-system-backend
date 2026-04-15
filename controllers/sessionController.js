// sessionController.js
import db from "../database/database.js";

// 1. GET ALL SESSIONS (For Flutter/React)
// 1. GET ALL SESSIONS (Updated for Flutter compatibility)
export const getSessions = async (req, res) => {
    try {
        const [sessions] = await db.query(`
            SELECT
                s.session_id AS id,
                c.title AS course_name,
                t.last_name AS teacher_name,
                r.room_id AS roomId,
                r.name AS name,
                r.name AS room_name,
                r.room_type AS type,
                r.room_type AS room_type,
                r.capacity,
                'Main Block' AS building,      -- ADDED: placeholder for Flutter
                '1st Floor' AS floor,          -- ADDED: placeholder for Flutter
                1 AS isAvailable,
                ts.day_of_week,
                ts.start_time
            FROM sessions s
            JOIN courses c ON s.course_id = c.course_id
            JOIN teachers t ON s.teacher_id = t.teacher_id
            JOIN rooms r ON s.room_id = r.room_id
            JOIN time_slots ts ON s.slot_id = ts.slot_id
        `);
        res.status(200).json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// 2. EXPORT CSV (The one causing the current crash)
export const exportCSV = async (req, res) => {
	try {
		const [data] = await db.query(`
            SELECT
                c.title,
                r.name,                   -- FIXED: changed from room_name
                t.last_name,
                ts.day_of_week,
                ts.start_time
            FROM sessions s
            JOIN courses c ON s.course_id = c.course_id
            JOIN rooms r ON s.room_id = r.room_id
            JOIN teachers t ON s.teacher_id = t.teacher_id
            JOIN time_slots ts ON s.slot_id = ts.slot_id
        `);

		let csv = "Course,Teacher,Room,Day,Start\n";
		data.forEach((s) => {
			csv += `"${s.title}","${s.last_name}","${s.name}","${s.day_of_week}","${s.start_time}"\n`;
		});

		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=timetable.csv",
		);

		const BOM = "\uFEFF";
		res.send(BOM + csv);
	} catch (err) {
		res.status(500).send(err.message);
	}
};

export const createDemand = async (req, res) => {
	const { session_id, requested_slot_id, reason } = req.body;
	const teacher_id = req.user.id; // Taken from your JWT verifyToken middleware

	try {
		await db.query(
			"INSERT INTO teacher_demands (teacher_id, session_id, requested_slot_id, reason) VALUES (?, ?, ?, ?)",
			[teacher_id, session_id, requested_slot_id, reason],
		);
		res.status(201).json({ message: "Change request sent to admin!" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};