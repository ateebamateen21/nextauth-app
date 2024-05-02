// Path: src/app/api/users/profile/route.ts

import { connect } from "@/config/dbConnection";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import getDataFromToken from '@/helpers/getDataFromToken';
connect();

// separate function for every http request




export async function POST(request:NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    //we don't want the password from the data
    const user = User.findOne({_id: userId}).select('-password')

    if (!user){
        return NextResponse.json({
            status: 404,
            message: 'User not found',
        })
    }

    return NextResponse.json({
        status: 200,
        message: 'user found',
        data: user
    })
   
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
    });
  }
}
