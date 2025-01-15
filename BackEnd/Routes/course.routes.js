import express from 'express'
import { createCourse, deleteCourse, getCourses, updateCourse } from '../Contoller/course.controller.js';
const router=express.Router();

router.get('/courses',getCourses);
router.post('/create',createCourse);
router.put('/update/:courseId',updateCourse);
router.delete('/delete/:courseId',deleteCourse);
export default router;