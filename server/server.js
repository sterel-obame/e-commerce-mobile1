import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/db.js";
// dot env config
dotenv.config();

//database connection
connectDB();

//stripe configuration pour le payement
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

//cloudinary Config c'est pour utiliser les images qui sont dans notre cloude cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

//rest object
const app = express();

//middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Toutes les routes de l'api sont importées là et commencent par "/api/v1/nomRoute"
//routes imports
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
app.use("/api/v1", testRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cat", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

// c'est la route par défaut
app.get("/", (req, res) => {
    return res.status(200).send("<h1>Bienvenu sur mon E-commerce </h1>");
});

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
    console.log(
        `Server Running On PORT ${process.env.PORT} on ${process.env.NODE_ENV} Mode`
        .bgMagenta.white
    );
});
