import express from "express"

const router = express.Router()

import { deleteProfile, updateProfile, authorizeUpdate, fetchAllUsers, getUserProfile } from "../controllers/users.js";
import { verifyAndAuthorization, verifyToken, verifyAdmin} from "../authorizations.js";


// Get User Profile

router.get("/users/:id",verifyAndAuthorization, getUserProfile);

// Fetch all users details

router.get("/users",verifyToken,fetchAllUsers);

//Delete profile route

router.delete("/remove/:id",verifyAndAuthorization,deleteProfile);

//Authorize edit process
router.get("/edit/:id",verifyAndAuthorization,authorizeUpdate);

//Update Profile route

router.put("/profile/update/:id",verifyAndAuthorization,updateProfile);

export default router;
