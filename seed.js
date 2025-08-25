import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const sampleProducts = [
    {
        name: "Wireless Headphones",
        description: "High-quality sound with noise cancellation.",
        price: 99.99,
        category: "electronics",
        rating: 4,
        image: "https://via.placeholder.com/300x200",
    },
    {
        name: "Smartwatch",
        description: "Track your health and fitness on the go.",
        price: 149.99,
        category: "electronics",
        rating: 5,
        image: "https://via.placeholder.com/300x200",
    },
    {
        name: "Gaming Keyboard",
        description: "Mechanical RGB keyboard for gamers.",
        price: 59.99,
        category: "accessories",
        rating: 3,
        image: "https://via.placeholder.com/300x200",
    },
];

const importData = async () => {
    try {
        await Product.deleteMany(); // clear old products
        await Product.insertMany(sampleProducts);
        console.log("✅ Sample products inserted!");
        process.exit();
    } catch (error) {
        console.error("❌ Error inserting data:", error);
        process.exit(1);
    }
};

importData();


// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Product from "./models/productModel.js";

// dotenv.config();

// const products = [
//     { name: "iPhone 15", price: 1200, description: "Latest iPhone model", brand: "Apple", category: "Phones" },
//     { name: "Samsung Galaxy S24", price: 1000, description: "Flagship Samsung phone", brand: "Samsung", category: "Phones" },
// ];

// mongoose.connect(process.env.MONGO_URI)
//     .then(async () => {
//         await Product.deleteMany();
//         await Product.insertMany(products);
//         console.log("✅ Data seeded successfully");
//         process.exit();
//     })
//     .catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });
