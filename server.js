//server.js
import express from "express";
import "dotenv/config";
import logger from "./middleware/logger.js";



const app = express();
const port = process.env.PORT || 8000;

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware
app.use(logger);

// //routes
// app.use("/login", loginRouter);
// app.use("/signUp", signUp);

// app.use("/api/users", users);

app.listen(port, "0.0.0.0", () =>
	console.log(`server is listining from port ${port}`),
);
