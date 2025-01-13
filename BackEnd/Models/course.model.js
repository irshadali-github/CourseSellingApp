import mongoose from 'mongoose'

const CourseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    image:{
       public_id:{
        type:String,
        required:true
       },
       url:{
        type:String,
        required:true
       }
    }
});

export const Course=mongoose.model("Course",CourseSchema);
