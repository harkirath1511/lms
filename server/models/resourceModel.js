import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
    
    type : {
        type : String,
        required : true,
        enum : ["Slides", "Tutorials", "Videos", "Playlists"] //Can remove if checks made in frontend
    },
    subject : {
        type : mongoose.Types.ObjectId,
        ref : "Subject"
    },
    resources : [{
        type : String
    }]

}, {timestamps : true});

export const Resource = mongoose.model("Resource", resourceSchema);
