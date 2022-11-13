import User from '../model/user.js'
import Video from '../model/video.js'
import { handleError } from '../service/handleError.js'

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      )
      res.status(200).json(updateUser)
    } catch (error) {
      next(error)
    }
  } else {
    return next(handleError(403, 'You are only update your account !!'))
  }
}
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json('User has been deleted !!')
    } catch (error) {
      next(error)
    }
  } else {
    return next(handleError(403, 'You are only delete your account !!'))
  }
}
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...rest } = user._doc
    if (!user) return next(handleError(403, 'User not found !!'))
    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}
export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    })
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        subscribers: 1,
      },
    })
    res.status(200).json('Subscription successfull`!!')
  } catch (error) {
    next(error)
  }
}
export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    })
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        subscribers: -1,
      },
    })
    res.status(200).json('UnSubscription successfull`!!')
  } catch (error) {
    next(error)
  }
}
export const like = async (req, res, next) => {
  try {
    const userId = req.user.id
    const videoId = req.params.videoId
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    })
    res.status(200).json('The video has been liked !!')
  } catch (error) {
    next(error)
  }
}
export const dislike = async (req, res, next) => {
  try {
    const userId = req.user.id
    const videoId = req.params.videoId
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    })
    res.status(200).json('The video has been disliked !!')
  } catch (error) {
    next(error)
  }
}
