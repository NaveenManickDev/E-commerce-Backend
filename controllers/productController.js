import Product from "../models/Product.js";

// GET /api/products?search=phone&category=electronics&min=100&max=500
export const getProducts = async (req, res, next) => {
    try {
        const { search, category, min, max } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (min || max)
            filter.price = {
                ...(min && { $gte: Number(min) }),
                ...(max && { $lte: Number(max) }),
            };
        if (search) filter.name = { $regex: search, $options: "i" };

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (e) {
        next(e);
    }
};

// GET /api/products/:id
export const getProduct = async (req, res, next) => {
    try {
        const p = await Product.findById(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });
        res.json(p);
    } catch (e) {
        next(e);
    }
};

// POST /api/products
export const createProduct = async (req, res, next) => {
    try {
        const p = await Product.create(req.body);
        res.status(201).json(p);
    } catch (e) {
        next(e);
    }
};

// PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
    try {
        const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!p) return res.status(404).json({ message: "Product not found" });
        res.json(p);
    } catch (e) {
        next(e);
    }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
    try {
        const p = await Product.findByIdAndDelete(req.params.id);
        if (!p) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (e) {
        next(e);
    }
};


