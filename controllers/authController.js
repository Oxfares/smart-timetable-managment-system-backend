import jwt from "jsonwebtoken";

export const login = async (req, res) => {
	const { username, password } = req.body;

	// FOR THE DEMO: Static check (Username: admin / Pass: admin123)
	if (username === "admin" && password === "admin123") {
		const token = jwt.sign(
			{ id: 1, role: "admin" },
			"your_secret_key_123", // Keep this simple for now
			{ expiresIn: "1h" },
		);
		return res.json({ message: "Login Success", token });
	}

	res.status(401).json({ error: "Invalid credentials" });
};
