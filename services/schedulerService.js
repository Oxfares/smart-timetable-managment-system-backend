//schedulerService.js
import db from "../database/database.js";

export const runAutoSchedule = async () => {
	const [courses] = await db.query("SELECT * FROM courses");
	const [rooms] = await db.query("SELECT * FROM rooms");
	const [slots] = await db.query("SELECT * FROM time_slots");
	const [teachers] = await db.query("SELECT * FROM teachers");

	let scheduledCount = 0;

	for (let course of courses) {
		let assigned = false;

		for (let slot of slots) {
			// --- NEW: FRIDAY RESTRICTION ---
			// This ensures no one (students or teachers) is scheduled on Friday
			if (slot.day_of_week.toLowerCase() === "friday") {
				continue;
			}
			// -------------------------------

			for (let room of rooms) {
				// 1. Physical Constraint: Room type match
				if (room.room_type !== course.course_type) continue;

				// 2. Resource Constraint: Is the Room busy?
				const [busyRoom] = await db.query(
					"SELECT session_id FROM sessions WHERE room_id = ? AND slot_id = ?",
					[room.room_id, slot.slot_id],
				);
				if (busyRoom.length > 0) continue;

				// 3. User Constraint: Is the Student Group busy?
				const groupId = 1;
				const [busyGroup] = await db.query(
					"SELECT session_id FROM sessions WHERE group_id = ? AND slot_id = ?",
					[groupId, slot.slot_id],
				);
				if (busyGroup.length > 0) continue;

				// 4. Academic Constraint: Teacher Workload (9-hour rule)
				// PRO TIP: Use course.teacher_id if your table has it, otherwise default
				const teacherId =
					course.teacher_id || teachers[0]?.teacher_id || 1;

				const [teacherLoad] = await db.query(
					"SELECT COUNT(*) as count FROM sessions WHERE teacher_id = ?",
					[teacherId],
				);
				if (teacherLoad[0].count >= 6) continue;

				// 5. Academic Constraint: Is the Teacher busy in another room?
				const [busyTeacher] = await db.query(
					"SELECT session_id FROM sessions WHERE teacher_id = ? AND slot_id = ?",
					[teacherId, slot.slot_id],
				);
				if (busyTeacher.length > 0) continue;

				// All checks passed -> INSERT
				await db.query(
					`INSERT INTO sessions (course_id, teacher_id, room_id, slot_id, group_id)
                     VALUES (?, ?, ?, ?, ?)`,
					[
						course.course_id,
						teacherId,
						room.room_id,
						slot.slot_id,
						groupId,
					],
				);

				assigned = true;
				scheduledCount++;
				break;
			}
			if (assigned) break;
		}
	}
	return { message: `Successfully scheduled ${scheduledCount} sessions.` };
};
