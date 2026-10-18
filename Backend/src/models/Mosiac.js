import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
    contributorName:{
        type: String,
        required:false,
        trim:true,
    },
    
    type:{
        type: String,
        enum:["image","video","text"],
        default:"text"
    },

    message:{
        type: String,
        trim:true,
        default:"",
    },

    mediaUrl:{
        type: String,
        default:"",
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
})


const mosaicSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    creatorName:{
        type: String,
        required: [true, "Creator name is required"],
        trim: true,
    },
    recipientName:{
        type: String,
        required:true,
        trim:true
    },

    occasion:{
        type: String,
        required:true,  
        default:"Congrats",
    },

    sharedCode:{
        type: String,
        required:true,
        unique:true,
    },

    contributions:{
        type: [contributorSchema],
        default: [],
    },
},
{
    timestamps: true
});

const Mosaic = mongoose.model("Mosaic", mosaicSchema);

export default Mosaic;