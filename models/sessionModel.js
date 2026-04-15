// sessionModel.js
import db from "../database/database.js";

export const getContractSessions = async () => {
	const query = `
        SELECT
            s.session_id AS id,
            c.title AS course_name,
            c.course_type AS type,
            CONCAT(t.first_name, ' ', t.last_name) AS teacher,
            r.name AS room,
            ts.day_of_week AS day,
            ts.start_time AS start,
            ts.end_time AS end
        FROM sessions s
        JOIN courses c ON s.course_id = c.course_id
        JOIN teachers t ON s.teacher_id = t.teacher_id
        JOIN rooms r ON s.room_id = r.room_id
        JOIN time_slots ts ON s.slot_id = ts.slot_id
    `;
	const [rows] = await db.query(query);
	return rows;
};
