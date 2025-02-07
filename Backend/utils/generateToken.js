import jwt from 'jsonwebtoken';

export const generateToken = (id, res) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "15d"
        });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            httpOnly: true,
            sameSite: "strict"
        });
    } catch (error) {
        console.error("Error generating token:", error.message);
        throw new Error("Failed to generate token.");
    }
};

export default generateToken;