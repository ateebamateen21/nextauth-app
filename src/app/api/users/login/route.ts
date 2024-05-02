// Path: src/app/api/users/signup/route.ts

import { connect } from "@/config/dbConnection";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

// separate function for every http request

export async function POST(request: NextRequest) {
  try {
    //getting the data from the request
    const { email, password } = await request.json();
    console.log("received login data>>>", email, password);

    //check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }

    //compare the password with hashedpassword

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    //returning the response
    //we'll generate a JWT token here.
    const tokenPayload = {
      user: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const loginResponse = NextResponse.json({
      status: 200,
      message: "User logged in successfully",
      token,
    });

    loginResponse.cookies.set("token", token, {
      httpOnly: true, //cookie can't be manipulated by client side javascript
    });

    return loginResponse;

  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
