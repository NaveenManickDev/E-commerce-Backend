import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        image: String,
        price: Number,
        qty: Number
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderItems: [orderItemSchema],
        shippingAddress: {
            fullName: String,
            address: String,
            city: String,
            postalCode: String,
            country: String
        },
        paymentMethod: { type: String, default: "COD" },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String
        },
        itemsPrice: Number,
        shippingPrice: Number,
        taxPrice: Number,
        totalPrice: Number,
        status: { type: String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
