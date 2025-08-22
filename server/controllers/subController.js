import { Subject } from "../models/subjectModel.js";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createSub = asyncHandler(async(req , res)=>{
    const { subject, code, credits, department, LTPsplit, contactHrs, syllabus, pool, sem } = req.body;


    if (!subject || !code || !credits || !department || LTPsplit === undefined || !contactHrs || !syllabus || !sem ) {
        return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    if (pool && !["A", "B"].includes(pool)) {
        return res.status(400).json({ success: false, message: "Pool must be 'A' or 'B'." });
    }


    try {
        const sub = await Subject.create({
            subject,
            code,
            credits,
            department,
            LTPsplit,
            contactHrs,
            syllabus,
            pool,
            sem
        });

    return res.status(201).json({ success: true, message: "Subject created successfully", sub });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating subject", error: error.message });
    }
});

const getMySubjects = asyncHandler(async(req, res)=>{

    const userId = req.user.id;
    
    const user = await userModel.findById(userId);

    if(!user){
        return res.status(404).json({ success: false, message: "No such user found" });
    }

    const query = {};

    if (user.pool) {
        if (["A", "B"].includes(user.pool)) {
            query.pool = user.pool;
        } else {
            return res.status(400).json({ success: false, message: "Invalid pool value in user profile." });
        }
    }
    
    if (user.currentsem) {
        const semValue = Number(user.currentsem);
            query.sem = semValue;
    }

    try {
        const mySubs = await Subject.find(query);
        if (!mySubs || mySubs.length === 0) {
            return res.status(404).json({ success: false, message: `No subjects found for pool ${user.pool} and semester ${user.currentsem}!` });
        }
        return res.status(200).json({ success: true, message: "Subjects fetched successfully", mySubs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching subjects", error: error.message });
    }
});

const getAllsubject = asyncHandler( async(req, res)=>{

    const userId = req.user?.id;

    const user = await userModel.findById(userId);

    if(!user){
        return res
        .status(404)
        .json({success : false, message : "No such user exists"})
    }

    const currentsem = user?.currentsem;

    if(!currentsem){
        return res
        .status(400)
        .json({success : false, message : "The user sem is undefined"})
    }

    const subs = await Subject.find({
        sem : currentsem
    });


    return res
    .status(200)
    .json({success : true, message : "All subjects fetched successfully", subs});
});

// const addSubs = asyncHandler(async(req, res)=>{

//     const userId = req.user?.id;
//     const {subIds} = req.body;

//     const user = userModel.findById(userId);
//     if(!user){
//         return res
//         .status(404)
//         .json({success : false, message : "No such user found"})
//     };

//     await Promise.all(
//         subIds.map(async(subId)=>{
//             const sub = await Subject.findById(subId);
//             if(!sub){
//                 return res
//                 .status(404)
//                 .json({success : false, message : `No such subject found : ${sub}`})
//             }


//         })
//     )   

    


// })


export {
    createSub,
    getMySubjects,
    getAllsubject
}
