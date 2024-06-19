const jwt = require("jsonwebtoken");
require("dotenv").config();
 
const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if(authHeader !== undefined && authHeader !== null) jwtToken = authHeader.split(" ")[1];
    if(jwtToken === undefined || jwtToken === null || jwtToken === ""){
      // console.log("jwtToken is undefined");
      response.status(401);
      response.send({message : "Invalid JWT Token"});
    }
    else{
       jwt.verify(jwtToken, process.env.SECRET_KEY, async (error, payload) => {
        if (error) {
          // console.log("jwt verification faliure");
          response.status(401);
          response.send({message : `Invalid JWT Token with error ${error}`});
        } 
        else{
          // console.log("jwt verification success");
          // console.log(payload);
          request.email = payload.email;
          request.user_id = payload.id;
          // console.log("User id is ", request.user_id);
          next(); 
        } 
          
      });
    }
}

module.exports = authenticateToken;