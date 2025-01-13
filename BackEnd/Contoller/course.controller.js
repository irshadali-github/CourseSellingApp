import {Course } from "../Models/Course.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const createCourse=async(req,res)=>{
   const {title,description,price}=req.body;
   try {
        if(!title || !description || !price){
            return res.status(400).json({errors:"All fields are required"})
        }
        const {image}=req.files;
        if(!req.files || Object.keys(req.files).length==0){
            return res.status(400).json({errors:"Please Upload the file"});
        }
        const imageFormat=["image/png","image/jpeg"];
        if(!imageFormat.includes(image.mimetype)){
            return res.status(400).json({errors:"Only png and jpg Format is alllowed"});
        }
        //Cloudinary code
        const cloudinaryResult = await cloudinary.uploader
        .upload(image.tempFilePath);
        if(!cloudinaryResult || cloudinaryResult.error){
            return res.status(400).json({errors:"File is not uploaded in cloudinary"});
        }
        const courseData={
            title,
            description,
            price,
            image:{
                public_id:cloudinaryResult.public_id,
                url:cloudinaryResult.url
            }
        };
        const course=await Course.create(courseData);
        res.status(200).json({
            message:"Course is Created Successfully",
            course
        });
   } catch (error) {
    console.log(error)
    res.status(500).json({errors:"Failed to Create Course"});
   }

};