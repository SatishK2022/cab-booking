import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        trim: true,
    },
}, { timestamps: true, versionKey: false });

const Blog = model("Blog", blogSchema);
export default Blog;