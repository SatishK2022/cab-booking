import dotenv from "dotenv";
import connectToDB from "./config/db";
import app from "./app";

dotenv.config();

connectToDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running on http://localhost:${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.error("Error connecting to database", error);
        process.exit(1);
    })