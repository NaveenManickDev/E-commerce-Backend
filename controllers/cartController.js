import User from "../models/User.js";
import Product from "../models/Product.js";

export const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.cart || []);
    } catch (e) { next(e); }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, qty = 1 } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const user = await User.findById(req.user._id);
        const existing = user.cart.find((i) => i.product.toString() === productId);

        if (existing) {
            existing.qty += qty;
        } else {
            user.cart.push({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty
            });
        }

        await user.save();
        res.status(201).json(user.cart);
    } catch (e) { next(e); }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const { qty } = req.body;
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        const item = user.cart.find((i) => i.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.qty = qty;
        if (item.qty <= 0) {
            user.cart = user.cart.filter((i) => i.product.toString() !== productId);
        }

        await user.save();
        res.json(user.cart);
    } catch (e) { next(e); }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter((i) => i.product.toString() !== productId);
        await user.save();
        res.json(user.cart);
    } catch (e) { next(e); }
};

export const clearCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();
        res.json([]);
    } catch (e) { next(e); }
};
