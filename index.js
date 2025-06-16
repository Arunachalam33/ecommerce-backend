import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/productauth.js";
import orderRoutes from "./routes/order.js";
import adminRoutes from "./routes/adminRoutes.js";
import pool from "./db/db.js";


dotenv.config();

const app=express();
const port=process.env.PORT;
app.use(cors());
app.use(express.json());

app.use("/api",authRoute);
app.use("/api/product",productRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.get("/",(req,res)=>{
    res.send("Backend is Working");
})


app.listen(port,()=>{
    console.log(`Server Running on Port ${port}`);
});

