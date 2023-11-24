import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



//Login controller

async function login(req, res){
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SEC,
            {
              expiresIn: "15m",
            }
          );

          const { password, ...others } = user._doc;

          res.cookie("token", accessToken, {
            maxAge: 20 * 60 * 1000,
            sameSite: "none",
            secure: true,
            httpOnly: true,
          });

          res.status(200).json({ ...others, accessToken });
        } else {
          res.status(203).json("Invalid Credentials");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(203).json("Invalid Credentials");
    }
}

//Register controller

async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.status(200).json("User added to the database");
  } catch (error) {
    // Handle errors, such as duplicate email or database connection issues
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export {login, register};