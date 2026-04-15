import mysql, { PoolConnection } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
	.createPool({
		host: process.env.mysql_host,
		user: process.env.mysql_user,
		password: process.env.mysql_password,
		database: process.env.mysql_database,
	})
	.promise();

// const [users] = await pool.query("SELECT * FROM users");
// console.log(users);
export default pool;
