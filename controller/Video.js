import User from '../model/user.js'
import Video from '../model/video.js'
import { handleError } from '../service/handleError.js'

export const randomVideo = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }])
    res.status(200).json(videos)
  } catch (error) {
    next(error)
  }
}
export const addVideo = async (req, res, next) => {
  try {
    const video = new Video({ userId: req.user.id, ...req.body })
    const savedVideo = await video.save()
    res.status(200).json(savedVideo)
  } catch (error) {
    next(error)
  }
}
export const updateVideo = async (req, res, next) => {
  try {
    const videoId = await Video.findById(req.params.id)
    if (!videoId) return next(handleError(403, 'Video not found !!'))
    if (req.user.id === videoId.userId) {
      const videoUpdated = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      )

      res.status(200).json(videoUpdated)
    } else {
      return next(handleError(403, "You can't update other people's video"))
    }
  } catch (error) {
    next(error)
  }
}
export const deleteVideo = async (req, res, next) => {
  try {
    const videoId = await Video.findById(req.params.id)
    if (!videoId) return next(handleError(403, 'Video not found !!'))
    if (req.user.id === videoId.userId) {
      await Video.findByIdAndDelete(req.params.id)
      res.status(200).json('Video has been deleted !!')
    } else {
      return next(handleError(403, "You can't delete other people's video"))
    }
  } catch (error) {
    next(error)
  }
}
export const findVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return next(handleError(403, 'Video not found !!'))
    res.status(200).json(video)
  } catch (error) {
    next(error)
  }
}
export const viewVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return next(handleError(403, 'Video not found !!'))
    const updateViews = Video.findByIdAndUpdate(
      video._id,
      {
        $inc: { views: 1 },
      },
      { new: true },
    )
    res.status(200).json("Video's View has been increased !!")
  } catch (error) {
    next(error)
  }
}
export const trendVideo = async (req, res, next) => {
  try {
    const video = await Video.find().sort({ views: 1 })
    res.status(200).json(video)
  } catch (error) {
    next(error)
  }
}
export const subVideo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const subcribedUsers = user.subscribedUsers
    const list = await Promise.all(
      subcribedUsers.map((channelId) => {
        return Video.find({ userId: channelId })
      }),
    )
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt))
  } catch (error) {
    next(error)
  }
}

export const getByTags = async (req, res, next) => {
  try {
    const tags = req.query.tags.split(',')
    const video = await Video.find({ tags: { $in: tags } })
      .limit(20)
      .sort({ views: -1 })
    res.status(200).json(video)
  } catch (error) {
    next(error)
  }
}
export const search = async (req, res, next) => {
  try {
    const query = req.query.q
    const video = await Video.find({ title: { $regex: query, $options: 'i' } })
      .limit(40)
      .sort({ views: -1 })
    res.status(200).json(video)
  } catch (error) {
    next(error)
  }
}
