import bcrypt from "bcryptjs"
import User from "../models/userModel.js";


// Get user details with id

async function getUserProfile(req, res) {
    
  const id = req.params.id;

  try {
    const account = await User.findById(id);

    if (account) {
      const { password, ...others } = account._doc;

      res.status(200).json({ ...others });
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    res.status(500).json(err)
  }

}

//Delete User details with id

async function deleteProfile(req, res) {

   const data = req.params.id

    try {
      const deletedUser = await User.findByIdAndDelete(data);

      if (deletedUser) {
        res.status(200).json("User Profile deleted");
      } else {
        res.status(203).json("User not found");
      }
    } catch (error) {
      res.status(500).json("Internal Server Error");
    }

}

//Grant access to update profile

function authorizeUpdate(req, res){
    res.status(200).json("Access Granted");
}

async function updateProfile(req, res){
     const salt = await bcrypt.genSalt(10);

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json("User Profile Updated");
    }
  } catch (err) {
    res.json(err);
  }
}

//fetch All profile

async function fetchAllUsers(req, res){
      try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
}


export {
    getUserProfile,
    deleteProfile,
    authorizeUpdate,
    fetchAllUsers,
    updateProfile
}