import jwt from "jsonwebtoken";
import User from "../models/User.js";

const genToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.JWT_COOKIE_SECURE === "true",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already registered" });

        const user = await User.create({ name, email, password });
        const token = genToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: "Invalid credentials" });

        const token = genToken(user._id);
        setTokenCookie(res, token);

        res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { next(e); }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
    res.json({ user: req.user });
};

export const updateMe = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();
        res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { next(e); }
};
