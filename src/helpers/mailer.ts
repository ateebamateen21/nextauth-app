// Path: src/helpers/mailer.ts
//node mailers to be used here.
import nodemailer from "nodemailer";
import generateVerificationToken from "./tokenGenerator";
import User from "@/models/userModel";
import dotenv from "dotenv";
import { Transporter, TransportOptions } from "nodemailer";
import VerifyEmail from "@/components/VerifyEmail";
import { ReactElement } from "react";

dotenv.config();

const mailHost = process.env.NODEMAILER_HOST;
const mailUser = process.env.NODEMAILER_USER;
const mailPass = process.env.NODEMAILER_PASS;
const mailPort = process.env.NODEMAILER_PORT;

console.log("mailHost", mailHost);
console.log("mailUser", mailUser);
console.log("mailPass", mailPass);
console.log("mailPort", mailPort);

// Make sure the variables are defined and not empty before using them
if (!mailHost || !mailUser || !mailPass) {
  throw new Error("Missing environment variables for mail configuration");
}

// #FIXME : Add interfaces to the function
export async function sendEmail({ mail, mailType, userId }: any) {
  console.log("mail", mail);
  console.log("mailType", mailType);
  console.log("userId", userId);

  try {
    const token = generateVerificationToken(userId);

    if (mailType === "VERIFY") {
      await User.findByIdAndUpdate(userId,
       {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (mailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
    //EMAIL CONFIGURATION
    // with ethereal
    //   var transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'norval.littel@ethereal.email',
    //         pass: 'ndkjeVFz5VKUQRB1HY'
    //     }
    // });
    //with mailtrap
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2ab2cd0e2eaa2c",
        pass: "4dd99810ff6d1a",
      },
    } as TransportOptions);
    //with google
    // var transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   auth: {
    //     user: "ateeba.mateen.21@gmail.com",
    //     pass: process.env.GOOGLE_NODEMAILER_PASS,
    //   },
    // } as TransportOptions);
    //MAILOPTIONS

    const mailOptions = {
      from: "mailtrap@ateebaNext.email",
      to: mail,
      subject:
        mailType === "VERIFY" ? "Verify your email" : "Reset your password",
      text: "anything",
      html: `<div> <p>
          Click on the link below to  
          ${mailType === "VERIFY" ? "verify your email" : "reset your password"}
              </p>
              <a href="${process.env.DOMAIN}/${
        mailType === "VERIFY" ? "verify" : "reset"
      }/${token}">Bro, I am testing, don't click.</a>
                </div>
                `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log("Error in sending email: ", error);
    throw new Error("Error in sending email", error);
  }
}
