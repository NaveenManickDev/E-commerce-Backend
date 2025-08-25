import Order from "../models/Order.js";
import User from "../models/User.js";

export const createOrder = async (req, res, next) => {
    try {
        const { shippingAddress, paymentMethod = "COD" } = req.body;
        const user = await User.findById(req.user._id);

        if (!user.cart.length) return res.status(400).json({ message: "Cart is empty" });

        const itemsPrice = user.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
        const shippingPrice = itemsPrice > 200 ? 0 : 10;
        const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
        const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

        const order = await Order.create({
            user: user._id,
            orderItems: user.cart.map((i) => ({
                product: i.product,
                name: i.name,
                image: i.image,
                price: i.price,
                qty: i.qty
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            status: "pending"
        });

        user.cart = [];
        await user.save();

        res.status(201).json(order);
    } catch (e) { next(e); }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (e) { next(e); }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
            return res.status(403).json({ message: "Forbidden" });
        res.json(order);
    } catch (e) { next(e); }
};

// Admin
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
        res.json(orders);
    } catch (e) { next(e); }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (e) { next(e); }
};
