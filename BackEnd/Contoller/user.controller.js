import {User} from "../Models/users.model.js"
import bcrypt from "bcrypt"
import { z } from 'zod';
import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()

export const signUp= async (req,res)=>{
    try {
        const saltRounds=10;
        console.log(saltRounds)
        const {firstName,lastName,email,password}=req.body;
        const userSchema=z.object({
            firstName:z.string().min(3,{message:"first name atleat 3 cheracter long"}),
            lastName:z.string().min(3,{message:"last name atleat 3 cheracter long"}),
            email:z.string().email(),
            password:z.string().min(6,{message:"password atleast 6 cheracter long"})

        })
        const validateData=userSchema.safeParse(req.body);
        if(!validateData.success){
            return res.status(403).json({errors:validateData.error.issues.map(err=>err.message)});
        }
        bcrypt.hash(password,saltRounds, async(err,password)=>{
            if(err){
                console.error(err)
                return res.status(400).json({errors:"Error in Hashing Password"})
            }
            const existingUser=await User.findOne({email:email});
            if(existingUser){
                return res.status(403).json({error:"User is Already Exist"});
            }
            const newUser=new User({firstName,lastName,email,password});
            await newUser.save();
            return res.status(200).json({message:"User Registered Succesfully",newUser});

        } )
       
    } catch (error) {
        res.status(500).json({errors:"Error in SignUP"});
    }
}

export const login= async(req,res)=>{
    try {
        const {email,password}= req.body;
        const user=await User.findOne({email:email});
        const matchPassword=await bcrypt.compare(password,user.password);
        if(!user || !matchPassword){
            return res.status(403).json({errors:"Invalid User Credential"});
        }

        //jwt tokken code
        const token=jwt.sign({
            id:user._id
        },process.env.JWT_SECRET_KEY);
        res.cookie("jwt",token);
        res.status(200).json({message:"Login Successfull",user,token});
    } catch (error) {
        res.status(500).json({errors:"Error in Login"});
    }

}

export const logout= async(req,res)=>{
    try {
        res.clearCookie("jwt");
        res.status(200).json({message:"Logout is Successfull"});
    } catch (error) {
        res.status(500).json({errors:"Error in Logout"});
    }
}