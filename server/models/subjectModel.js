import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({

    subject : {
        type : String,
        required : true
    },
    code : {
        type : String,
        required : true
    },
    credits : {
        type : Number,
        required : true
    },
    department : {
        type : String,
        required : true
    },
    LTPsplit : {
        type : Number,
        required : true
    },
    contactHrs : {
        type : Number,
        required : true
    },
    syllabus : {
        type : String,
        required : true
    },
    pool : {
        type : String,
        enum : ["A","B"]
    },
    sem : {
        type : String,
        default : 1
    },
    branches : [{
        type : String
    }]


}, {timestamps : true});

export const Subject = mongoose.model("Subject", subjectSchema)
