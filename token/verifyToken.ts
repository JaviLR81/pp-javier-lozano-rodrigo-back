import jwt from "jsonwebtoken";
import { secret } from "../global/enviroment";

export async function verifyToken(req:any, res:any, next:any) {
  // Get the token from the headers
  const token = req.headers["x-access-token"];

  // if does not exists a token
  if (!token) {
    return res
      .status(401)
      .send({ auth: false, message: "No Token Provided" });
  }

  // decode the token
  try {
    const decoded:any = await jwt.verify(token,secret);  
         
    // save the token on request object to using on routes
    req.userId = decoded.id;

    // continue with the next function
    next();
  }
  catch (error) {
    return res
      .status(401)
      .send({ auth: false, message: "JWT malformed token" });
  }
  
}
