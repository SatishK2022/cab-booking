import { Schema, model } from "mongoose";

const leadSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
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
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    pickupAddress: {
        type: String,
        required: [true, "Pickup address is required"],
        trim: true,
    },
    dropAddress: {
        type: String,
        required: [true, "Drop address is required"],
        trim: true,
    },
    pickupDate: {
        type: Date,
        required: [true, "Pickup date is required"],
    },
    dropDate: {
        type: Date,
        required: [true, "Drop date is required"],
    },
}, { timestamps: true, versionKey: false });

const Lead = model("Lead", leadSchema);
export default Lead;