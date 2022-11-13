import mongoose from 'mongoose'
import express from 'express'
import { signup, signin, googleAuth } from '../controller/Auth.js'
const router = express.Router()
// SIGN IN
router.post('/signin', signin)
// SIGN UP
router.post('/signup', signup)
// SIGN IN GOOGLE
router.post('/google', googleAuth)

export default router
