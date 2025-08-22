import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler.js'

const verifyAdmin = asyncHandler( async(req , res, next)=>{
    
    const adminToken = req.cookies.adminToken;

    if(!adminToken){
        return res
        .status(404)
        .json({success : false, message : "No admin token found"});
    } 

    const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);

    req.admin = decodedToken;

    next();
})


export {
    verifyAdmin
}
