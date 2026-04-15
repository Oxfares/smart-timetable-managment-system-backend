import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) return res.status(403).json({ error: "No token provided" });

	try {
		const decoded = jwt.verify(token, "your_secret_key_123");
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ error: "Unauthorized" });
	}
};
