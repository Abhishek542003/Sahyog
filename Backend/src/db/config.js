import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose";
import colors from "colors";
import {DB_NAME} from "../constants.js"

// console.log(`${process.env.MONGODB_URI}`);
const connectDB = async ()=>
    {   
        
        try {
        
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(` \n connected to DB successfully!!! ${connectionInstance.connection.host}`.white.bgMagenta);
            
        } catch (error) 
        {
            console.log("MONGODB CONNECTION FAILED: ",error);
            process.exit(1);
        }
    }

    export default connectDB;