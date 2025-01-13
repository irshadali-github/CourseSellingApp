import {Course } from "../Models/Course.model.js";

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
        const courseData={
            title,
            description,
            price,
            image
        };
        const course=await Course.create(courseData);
        res.json({
            message:"Course is Created Successfully",
            course
        });
   } catch (error) {
    console.log(error)
    res.status(500).json({errors:"Failed to Create Course"});
   }

};