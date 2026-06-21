import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.model.js";
// import generateAccessToken from "./utils/generateAccessToken.js";
// import generateRefreshToken from "./utils/generateRefreshToken.js";

import app from "./app.js";
import connectDB from "./config/db.js";

// Database Connection
connectDB();

// const accessToken = generateAccessToken(
//   "6852e8e7d53c7f5d6f8c1111",
//   "user"
// );

// const refreshToken =
//   generateRefreshToken(
//     "6852e8e7d53c7f5d6f8c1111"
//   );

// console.log(accessToken);

// console.log(refreshToken);

// const createUser = async () => {
//   try {
//     const user = await User.create({
//       name: "Prince",
//       email: "prince1@gmail.com",
//       password: "123456",
//     });

//     console.log(user);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// createUser();

// const user = await User.findOne({
//   email: "prince1@gmail.com"
// });

// const isMatch = await user.comparePassword("123456");

// console.log(isMatch);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});