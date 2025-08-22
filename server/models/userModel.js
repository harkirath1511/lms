import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type: String},
    email:{type:String, required:true, unique:true},
    password:{type:String},
    verifyOtp:{type:String, default:''},
    verifyOtpExpireAt:{type:Number, default:0},
    isAccountVerified:{type:Boolean, default:false},
    resetOtp:{type:String, default:''},
    resetOtpExpireAt:{type:Number, default:0},
    pool : {type : String, default : 'A', enum: ['A', 'B', 'R']},
    branch : {type : String},
    currentsem: { type: Number }
})


const userModel=mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
