import { Schema, Types, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser {
    name: string;
    email: string;
    password: string;
    refreshToken: string
}

export interface IUserDocument extends IUser, Document {
    id: Types.ObjectId;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        select: false,
    },
    refreshToken: String
}, { timestamps: true, versionKey: false });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '20d' });
}

const User = model<IUserDocument>("User", userSchema);
export default User;
