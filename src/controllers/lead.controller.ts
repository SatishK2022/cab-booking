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

export const getAllLeads = async (req: Request, res: Response): Promise<void> => {
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

export const getLead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const existingLead = await Lead.findById(id);

        if (!existingLead) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Lead not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Lead fetched successfully",
            data: existingLead
        })
    } catch (error: any) {
        console.error("Error while getting lead", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const updateLead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, phone, pickupAddress, dropAddress, pickupDate, dropDate } = req.body;

    try {
        const existingLead = await Lead.findById(id);

        if (!existingLead) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Lead not found"
            });
            return;
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    email,
                    phone,
                    pickupAddress,
                    dropAddress,
                    pickupDate,
                    dropDate
                }
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Lead updated successfully",
            data: updatedLead
        })
    } catch (error: any) {
        console.error("Error while updating lead", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const existingLead = await Lead.findById(id);

        if (!existingLead) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Lead not found"
            });
            return;
        }

        await existingLead.deleteOne();

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Lead deleted successfully"
        })
    } catch (error: any) {
        console.error("Error while deleting lead", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}

export const searchLead = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;

    try {
        const leads = await Lead.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
                { phone: { $regex: query, $options: "i" } },
            ]
        });

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
        console.error("Error while searching lead", error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: error?.message || "Internal Server Error",
            error
        })
    }
}