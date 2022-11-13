import express from 'express'
import {
  addVideo,
  updateVideo,
  deleteVideo,
  findVideo,
  viewVideo,
  subVideo,
  trendVideo,
  getByTags,
  search,
  randomVideo,
} from '../controller/Video.js'
import { verifyToken } from '../service/verifyToken.js'
const router = express.Router()

router.post('/', verifyToken, addVideo)
router.put('/:id', verifyToken, updateVideo)
router.delete('/:id', verifyToken, deleteVideo)
router.get('/find/:id', verifyToken, findVideo)
router.get('/view/:id', verifyToken, viewVideo)
router.get('/trend', trendVideo)
router.get('/random', randomVideo)
router.get('/sub', verifyToken, subVideo)
router.get('/tags', verifyToken, getByTags)
router.get('/search', verifyToken, search)

export default router
