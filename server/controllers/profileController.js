// import profileUserModel from "../models/profileUserModel.js";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProfile = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    console.log(userId);
    const { firstname, lastname, currentsem, branch, pool } = req.body;

    const user = await userModel.findById(userId);

    if(!user){
      return res
      .status(404)
      .json({success : false, message : "No such user found"})
    };

    if(user.pool && user.branch && user.currentsem){
      return res
      .status(400)
      .json({success : false, message : "User profile already created"})
    }

    user.pool = pool;
    user.branch = branch;
    user.currentsem = currentsem;
    await user.save({validateBeforeSave : false});

    res.status(201).json({success : true, message : "User profile updated suucessfully", user});
});

export const getProfile = async (req, res) => {

  try {
    const  userId  = req.user.id;
    console.log(userId)
    const profile = await userModel.findById(userId );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res
    .status(200)
    .json({success : true, message : "Profile fetched successfully", profile});

  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

export const updateProfile = async (req, res) => {
  try {
    const  userId  = req.user.id;
    const {currentsem, branch, pool} = req.body;

    const updatedProfile = await userModel.findByIdAndUpdate(
       userId,
      { $set: {
        currentsem: currentsem,
        branch: branch,
        pool: pool
       }},
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const  userId  = req.user.id;
    const deleted = await profileUserModel.findOneAndDelete({ userId });
    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
