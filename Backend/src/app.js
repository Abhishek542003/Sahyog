import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import color from "colors";

const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes Import 

import userRouter from "./routes/user.routes.js"

// Routes Declaration 
app.use("/api/v1/users",userRouter)

export {app};

