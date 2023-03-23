import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

//configure env
dotenv.config()

//rest object
const app = express();

//database config
connectDB();

//middle wares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth',authRoutes);

//rest api
app.get("/",(req,res)=>{
    res.send({
        message: "Welcome to ecommerce app",
    });
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen 
app.listen(PORT,()=>{
    console.log(`Server running on the ${PORT}`.bgCyan.white);
});
