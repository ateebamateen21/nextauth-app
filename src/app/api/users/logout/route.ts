// Path: src/app/api/users/signup/route.ts

import { connect } from "@/config/dbConnection";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

// separate function for every http request


//used GET request here because only the cookie is being cleaned up and nothing is being stored in the data that needs to be passed to the user

export async function GET() {
  try {
    //logging out
    const logoutResponse = NextResponse.json({
        status : 200,
        message : "User logged out successfully"
    })

    logoutResponse.cookies.set('token', '', {
        httpOnly:true,
        //expires the token set previosly 
        expires: new Date(0)
    })
    

  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
