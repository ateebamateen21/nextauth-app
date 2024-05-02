// Path: src/app/api/users/signup/route.ts

import { connect } from "@/config/dbConnection";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();
//TODO: RESEARCH MORE ABOUT THE FOLLOWING STATEMENT
//this connection for every every route is important because NEXTJS runs on edge computing and each function is deployed separately means that routes don't know if they're connected to the DB or not.

// separate function for every http request

export async function POST(request: NextRequest) {
  try {
    //getting the data from the request
    const { username, email, password } = await request.json();
    console.log("received data>>>", username, email, password);
    // if(!username || !email || !password){
    //     return NextResponse.json({
    //         status:400,
    //         message: "Please fill all the fields"
    //     })
    // } //do your validation here

    //checking if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        status: 403,
        message: "User already exists",
      });
    }

    //hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //creating a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //saving the user
    const newlySavedUser = await newUser.save();
    console.log(newlySavedUser)

    // sending verification email
    await sendEmail({
      mail: email,
      mailType: "VERIFY",
      userId: newlySavedUser._id,
      //._id is what we get from mongoDB as an identifier for documents
    });

    //returning the response
    return NextResponse.json({
      status: 200,
      message: `User ${newlySavedUser.username} has been created successfully`,
      data: newlySavedUser,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
