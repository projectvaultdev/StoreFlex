import jwt from "jsonwebtoken";

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export default generateAccessToken;