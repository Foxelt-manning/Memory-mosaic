import Users from '../models/userModel.js';

export const registerUser = async (req,res) =>{
    try{
        const {name,email,password,avatarUrl} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const existingUser = await Users.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists with this email, please login instead"
            });
        }

        const user = await Users.create({
            name,
            email,
            password,
            avatarUrl
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.message
            });
        }
        console.error("Error occurred while creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while creating user",
            error: error.message
        });
    }

}