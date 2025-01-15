import mongoose from "mongoose";
import { Course } from "../Models/Course.model.js";
import { v2 as cloudinary } from "cloudinary";

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses) {
      return res.status(404).json({ errors: "Courses not Found" });
    }
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: "Error in Getting Courses" });
  }
};



export const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length == 0) {
      return res.status(400).json({ errors: "Please Upload the file" });
    }
    const imageFormat = ["image/png", "image/jpeg"];
    if (!imageFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Only png and jpg Format is alllowed" });
    }
    //Cloudinary code
    const cloudinaryResult = await cloudinary.uploader.upload(
      image.tempFilePath
    );
    if (!cloudinaryResult || cloudinaryResult.error) {
      return res
        .status(400)
        .json({ errors: "File is not uploaded in cloudinary" });
    }
    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.url,
      },
    };
    const course = await Course.create(courseData);
    res.status(200).json({
      message: "Course is Created Successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Failed to Create Course" });
  }
};

export const updateCourse = async (req, res) => {
  console.log(req.body);
  const { courseId } = req.params;
  console.log(courseId);
  const { title, description, price, image } = req.body;
  if (!image) {
    try {
      const { image } = req.files;
      console.log(image);
      if (!req.files || !Object.keys(req.files).length > 0) {
        return res.status(400).json({ errors: "Please Upload the file" });
      }
      const formatImage = ["image/png", "image/jpeg"];
      if (!formatImage.includes(image.mimetype)) {
        return res
          .status(400)
          .json({ errors: "Image can only be in png or jpg format" });
      }
      //Cloudniary code
      const cloudinaryResult = await cloudinary.uploader.upload(
        image.tempFilePath
      );
      if (!cloudinaryResult || cloudinaryResult.error) {
        return res.status(400).json({ errors: "file is not uploaded" });
      }
      const coureseData = {
        title,
        description,
        price,
        image: {
          public_id: cloudinaryResult.public_id,
          url: cloudinaryResult.url,
        },
      };
      const course = await Course.updateOne({ _id: courseId }, coureseData);
      return res.status(200).json({
        message: "Course Updated Successfully",
        course,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: "Failed to Update Course" });
    }
  }
  try {
    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: image?.public_id,
        url: image?.url,
      },
    };
    console.log(courseData);
    const course = await Course.updateOne({ _id: courseId }, courseData);
    res.status(200).json({
      message: "Course Updated Successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ errors: "Failed To Update Course" });
  }
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findByIdAndDelete({
      _id: courseId,
    });
    if (!course) {
      return res.status(404).json({ errors: "Course is Not found" });
    }
    res.status(200).json({ message: "Course is Deleted Sucessfully" });
  } catch (error) {
    console.log("Some error is occured", error);
    res.status(500).json({ errors: "Some Error Occured in Deleting Course" });
  }
};
