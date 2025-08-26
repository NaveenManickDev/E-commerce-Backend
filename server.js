import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://e-commerce-swart-chi.vercel.app/products"],// Allow all origins for deployment (or replace with your frontend URL)
    credentials: true,
}));
app.use(morgan("dev"));

// Root route (for testing)
app.get("/", (req, res) => {
    res.send("✅ Backend is running!");
});

// API Routes
app.use("/api/products", productRoutes);

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

