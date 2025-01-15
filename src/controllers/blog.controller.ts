import { Request, Response } from "express";
import Blog from "../models/blog.model";
import { bucket } from "../config/firebaseInit";
import fs from "fs/promises";

export const createBlog = async (req: Request, res: Response): Promise<void> => {
    const { title, description } = req.body;

    let imageUrl = "";

    if (req.file) {
        await bucket.upload(req.file.path, {
            destination: `cab-booking/blogs/${req.file.originalname}`
        })

        imageUrl = `https://firebasestorage.googleapis.com/v0/b/wingfi-9b5b7.appspot.com/o/${encodeURIComponent(`cab-booking/blogs/${req.file.originalname}`)}?alt=media`

        await fs.rm(req.file.path);
    }

    try {
        const blog = await Blog.create({
            title,
            description,
            image: imageUrl
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Blog created successfully",
            data: blog
        })
    } catch (error: any) {
        console.error("Error while creating blog", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await Blog.find({});

        if (blogs.length === 0) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blogs not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blogs fetched successfully",
            data: blogs
        })
    } catch (error: any) {
        console.error("Error while getting blogs", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const getBlog = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blog not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog fetched successfully",
            data: blog
        })
    } catch (error: any) {
        console.error("Error while getting blog", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const blog = await Blog.findByIdAndUpdate(id, {
            title,
            description
        }, { new: true });

        if (!blog) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blog not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog updated successfully",
            data: blog
        })
    } catch (error: any) {
        console.error("Error while updating blog", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Blog not found"
            });
            return;
        }

        if (blog?.image && blog?.image !== "") {
            let fileName = blog?.image?.split('/').pop()?.split('?')[0].replace(/%2F/g, '/') ?? '';

            await bucket.file(fileName).delete();
        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Blog deleted successfully"
        })
    } catch (error: any) {
        console.error("Error while deleting blog", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}