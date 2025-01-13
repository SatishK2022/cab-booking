import { Request, Response } from "express";
import User from "../models/user.model";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshToken = async (userId: Types.ObjectId): Promise<TokenResponse> => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken: string = user.generateAccessToken();
        const refreshToken: string = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens", error);
        throw new Error("Failed to generate tokens");
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Email and password are required"
            });
            return;
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
            return;
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Invalid password"
            });
            return;
        }

        const tokenResponse = await generateAccessAndRefreshToken(user._id);

        if (!tokenResponse) {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Error generating tokens"
            });
            return;
        }

        const { accessToken, refreshToken } = tokenResponse;

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -createdAt -updatedAt");

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }

        res.status(200)
            .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 }) // 1 day
            .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 20 * 24 * 60 * 60 * 1000 }) // 20 days
            .json({
                success: true,
                statusCode: 200,
                message: "User logged in successfully",
                data: {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }
            });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error instanceof Error ? error.message : "Internal Server Error",
            error
        });
    }
}

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        await User.findByIdAndUpdate(
            userId,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            { new: true }
        )

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }

        res.status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json({
                success: true,
                statusCode: 200,
                message: "User logged out successfully"
            })
    } catch (error: any) {
        console.error("Error logging out user", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error.message || "Internal Server Error",
            error
        })
    }
}