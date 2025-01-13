import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUserDocument } from "../models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: InstanceType<typeof User>;
        }
    }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    try {
        if (!token) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Unauthorized access"
            });
            return;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await User.findById((decodedToken as jwt.JwtPayload).id);

        if (!user) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Unauthorized access"
            });
            return;
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error verifying JWT", error);
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: "Token expired"
            });
            return;
        }

        res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Unauthorized access"
        })
    }
}