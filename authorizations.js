import jwt from "jsonwebtoken";

// Auth Middleware
export function verifyToken(req, res, next) {

  const token = req.cookies.token;

  if (token) {

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {

      if (err) {
        return res.status(403).json("Invalid Token");
      }

      req.user = user;

      next();
    });
    
  } else {
  
    res.status(401).json("You are not authenticated")
  
  }

}

//Checks if user id matches or user is admin

export function verifyAndAuthorization(req, res, next){

    verifyToken(req, res, () => {

      if(req.user.id === req.params.id || req.user.isAdmin) {

        next()

      } else {

        res.status(203).json("You are not allowed to do that");
      }

    })
}

//Checks if user is admin 

export function verifyAdmin(req, res, next) {

  verifyToken(req, res, () => {

    if(req.user.isAdmin){

      next()

    } else {

      res.status(203).json("Only Admins are allowed to this!")
    }
  })
} 




