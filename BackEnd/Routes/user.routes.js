import express from 'express'
import { signUp } from '../Contoller/user.controller.js'
const router=express.Router()

router.post('/signup',signUp);

export default router;