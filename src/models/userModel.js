//Path: src/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String || Number,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

//when a user signs up, the verifyToken alond with the verifyExpiryDate will be sent to the database and the to the user by mail. When the user clicks the verify link in the mail and a url opens, the token comes back to the app, the app then queries the database if the etoken exists and if it has not expired. If it exists and has not expired, the user is verified and the isVerified field is set to true.

//when a user clicks forgot password, a token is generated and sent to the database and to the user by mail. When the user clicks the link in the mail, the token is sent back to the app, the app then queries the database if the token exists and if it has not expired. If it exists and has not expired, the user is allowed to change the password through a form that then, updates the user data in database with the new password.

//the "nextauthusers" is the collection in /test database in cluster0 in mongodb atlas. The collection is created when the user signs up
const User = mongoose.models.nextauthusers || mongoose.model("nextauthusers", userSchema);

export default User;
