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

app.get('/', (req, res) => {
    // Access cookies sent in the request
    console.log(req.cookies); // Logs an object containing cookie names and values
    res.send('Cookies retrieved!');
});

export {app};

