import Comment from '../model/comment.js'
import Video from '../model/video.js'
import { handleError } from '../service/handleError.js'

export const addComment = async (req, res, next) => {
  try {
    const newComment = new Comment({ ...req.body, userId: req.user.id })
    const savedcomment = await newComment.save()
    res.status(200).json(savedcomment)
  } catch (error) {
    next(error)
  }
}
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return next(handleError(403, 'Comment not found !!'))
    const video = await Video.findById(req.params.id)
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(comment._id)
      res.status(200).json('Delete successfully !!')
    } else return next(handleError(403, 'You can delete only your comment !!'))
  } catch (error) {
    next(error)
  }
}
export const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
    if (!comments) return next(handleError(403, 'Comment not found !!'))
    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}
