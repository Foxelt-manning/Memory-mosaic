import crypto from "crypto";
import Mosaic from "../models/Mosaic.js";

export const createMosaic = async (req, res) => {
    try{
        const { title, creatorName, recipientName, occasion } = req.body;

        if(!title || !creatorName || !recipientName || !occasion){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const sharedCode = crypto.randomBytes(4).toString('hex');

        const mosaic = await Mosaic.create({
            title,
            creatorName,
            recipientName,
            occasion,
            sharedCode,
        });

        return res.status(201).json({
            success: true,
            message: "Mosaic created successfully",
            mosaic
        });
          
    }
    
    catch (error) {

        console.log("Error occurred while creating mosaic:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating mosaic",
            error: error.message
        });
    }
}

export const getMosaic = async (req, res) =>{
    try{
        const mosaic = await Mosaic.findOne({sharedCode: req.params.sharedCode});

        if(!mosaic){
            return res.status(404).json({
            success: false,
            message: "Mosaic not found"
        });
        }

        return res.status(200).json({
            success:true,
            message: "Mosaic retrieved successfully",
            mosaic
        })
    }
    catch (error) {
        console.log("Error occurred while retrieving mosaic:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving mosaic",
            error: error.message
        });
    }
}

export const addContribution = async (req, res) => {
    try{
        const {contributorName, message, mediaUrl, type} = req.body;
        
        if(!contributorName || (!message && !mediaUrl)){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const mosaic =await Mosaic.findOne({sharedCode: req.params.sharedCode});

        if(!mosaic){
            return res.status(404).json({
                success: false,
                message: "Mosaic not found"
            });
        }

        mosaic.contributions.push({
            contributorName,
            message,
            mediaUrl,
            type,
        })

        await mosaic.save();

        const contribution = mosaic.contributions[mosaic.contributions.length - 1];

        return res.status(201).json({
            success: true,
            message: "Contribution added successfully",
            contribution
        });
    }
    catch (error) {
        console.log("Error occurred while adding contribution:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding contribution",
            error: error.message
        });
    }
}