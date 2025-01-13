import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());


// Routes Import
import userRoutes from "./routes/user.routes";


// Routes
app.use("/api/v1/user", userRoutes);


app.get("/", (_, res) => {
    res.send({
        success: true,
        status: 200,
        message: "Welcome to Cab Booking API"
    })
});

export default app;