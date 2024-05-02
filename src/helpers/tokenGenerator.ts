import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

// Function to generate a verification token based on user ID
export default function generateVerificationToken(userId: ObjectId): string {
  // Generate a random UUID
  const randomUUID =  uuidv4();
  // Concatenate the user's ID with the random UUID
  const uniqueToken = `${userId.toHexString()}_${randomUUID}`;
  console.log("Generated verification token: ", uniqueToken)
  return uniqueToken;
}
