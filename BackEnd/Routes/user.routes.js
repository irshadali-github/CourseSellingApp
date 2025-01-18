import express from 'express'
import { login, logout, signUp } from '../Contoller/user.controller.js'
const router=express.Router()

router.post('/signup',signUp);
router.post('/login',login);
router.get('/logout',logout);

export default router;