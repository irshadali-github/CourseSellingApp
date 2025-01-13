import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import courseRouter from "./Routes/course.routes.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
const app = express();
env.config();
// console.log(process.env.PORT)
//middleware
app.use(express.json());
const port = process.env.PORT || 3000;

//Mongoose Database connection
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("mongodb is connected...");
} catch (error) {
  console.log(error);
}
//FileUpload Code
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//Cloudinary Configuration code

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret, 
});
//Routes
app.use("/api/v1/course", courseRouter);
// app.get('/',(req,res)=>{
//     res.send("Hello World");
// })

app.listen(port, () => console.log(`Server is running on port ${port}`));
