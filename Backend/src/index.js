import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import connectDB from "./db/config.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on ${process.env.PORT}`.white.bgCyan);
    });
  })
  .catch((error) => {
    console.log("Mongodb Connection Failed ", error);
  });
