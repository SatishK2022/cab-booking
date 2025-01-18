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
import blogRoutes from "./routes/blog.routes";
import leadRoutes from "./routes/lead.routes";
import cabRoutes from "./routes/cab.routes";
import packageRoutes from "./routes/package.routes";


// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/lead", leadRoutes);
app.use("/api/v1/cab", cabRoutes);
app.use("/api/v1/package", packageRoutes);


app.get("/", (_, res) => {
    res.send({
        success: true,
        status: 200,
        message: "Welcome to Cab Booking API"
    })
});

export default app;