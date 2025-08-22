import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async(localFilePath) =>{
    try{
        if(!localFilePath) {
            return null;
        }
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto',
        })
        if(uploadResult)  fs.unlinkSync(localFilePath)
        console.log("File uploaded succesfully on cloudinary : ", uploadResult.url);
        return uploadResult
    }catch(err){
        console.log("cloudinary upload failed : ", err)
        fs.unlinkSync(localFilePath)  //this unlink thing removes the locally saved temp file 
        return null
    }
} 


export {uploadOnCloudinary}
