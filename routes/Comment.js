import express from 'express'
import { addComment, deleteComment, getComment } from '../controller/Comment.js'
import { verifyToken } from '../service/verifyToken.js'
const router = express.Router()

router.post('/', verifyToken, addComment)
router.delete('/:id', verifyToken, deleteComment)
router.get('/:videoId', verifyToken, getComment)
export default router
