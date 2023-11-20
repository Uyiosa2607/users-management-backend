import express from "express"

import bcrypt from "bcryptjs"

import User from "../models/users.js"

import { verifyToken, verifyAndAuthorization } from "../authorizations.js"

import jwt from "jsonwebtoken"

const router = express.Router();

//Register Route

router.post("/register",async (req, res, next) => {

   const {name, email, password} = req.body;

   try {

    await User.create({
      name: name,
      email: email,
      password: password,
    });
    
   } catch (error) {
     next(error)
   }
   
   res.status(200).json({ message: "User added to database" });

});

// Login Route

router.post("/login",async (req, res) => {

  const {email, password } = req.body;

  const user = await User.findOne({ email });

  if(user) {

    try {

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {

        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SEC, {
          expiresIn: "15m",
        });

        const { password, ...others } = user._doc;

        res.cookie("token", accessToken, { maxAge: 20 * 60 * 1000,
          sameSite: "none",
          secure: process.env.NODE_ENV === "production"
         });

        res.status(200).json({ ...others });
    
      } else {

        res.status(203).json("Invalid Credentials")

      }
      
    } catch (error) {

    console.log(error)

    }
  } else {

    res.status(203).json("Invalid Credentials")

  }
});


// Get User Profile

router.get("/users/:userId", verifyToken, async (req, res, next) => {

  const id = req.params.userId;
  
  try {

    const account = await User.findById(id);

     if (account) {

      const { password, ...others} = account._doc;

      res.status(200).json({...others});

     } else {
      throw new Error("user not found");
     }

    
  } catch(err) {
    next(err) 
  
  }

});

// Fetch all users details

router.get("/users", verifyToken, async (req, res) => {
  
    try {

      const users = await User.find().select('-password');

      res.status(200).json(users)

    } catch (error) {
      console.log(error)
    }
    
});

//Delete profile route

router.delete("/users/remove/:id", verifyAndAuthorization, async (req, res) => {

  const { data } = req.body;

    try {
      
      const deletedUser = await User.findByIdAndDelete(data);

      if (deletedUser) {
        res.status(200).json("User Profile deleted");
      } else {
        res.status(404).json("User not found");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json("Internal Server Error");
    }
  }
);


//Authorize edit process
router.get("/edit/:id", verifyAndAuthorization, (req, res) => {

  res.status(200).json("Access Granted")
  
})


//Update Profile route 

router.put("/profile/update/:id", verifyAndAuthorization, async  (req, res) => {

  const salt = await bcrypt.genSalt(10);
 

  if(req.body.password){

    req.body.password = await bcrypt.hash(req.body.password, salt);

  }

  try {

    const updatedUser = await  User.findByIdAndUpdate(req.params.id, {$set: req.body},{new:true});
   
    if(updatedUser) {
      res.status(200).json("User Profile Updated");
    }
    
  } catch(err){
    res.json(err)
  }
  
})



export default router;