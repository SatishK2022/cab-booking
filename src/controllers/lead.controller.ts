import { Request, Response } from "express";
import Lead from "../models/lead.model";

export const createLead = async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, pickupAddress, dropAddress, pickupDate, dropDate } = req.body;

    try {
        const lead = await Lead.create({
            name,
            email,
            phone,
            pickupAddress,
            dropAddress,
            pickupDate,
            dropDate
        });

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Lead created successfully",
            data: lead
        })
    } catch (error: any) {
        console.error("Error while creating lead", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const getLeads = async (req: Request, res: Response): Promise<void> => {
    try {
        const leads = await Lead.find({}).sort({ createdAt: -1 });

        if (leads.length === 0) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Leads not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Leads fetched successfully",
            data: leads
        })
    } catch (error: any) {
        console.error("Error while getting leads", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}