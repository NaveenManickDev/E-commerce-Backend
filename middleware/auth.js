import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) return res.status(401).json({ message: "Not authorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ message: "User not found" });

        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") return next();
    return res.status(403).json({ message: "Admin access required" });
};
