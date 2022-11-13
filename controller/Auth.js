import User from '../model/user.js'
import bcrypt from 'bcryptjs'
import { handleError } from '../service/handleError.js'
import jwt from 'jsonwebtoken'
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const user = new User({ ...req.body, password: hash })

    await user.save()
    res.status(200).send({ msg: 'User has been created!' })
  } catch (error) {
    next(error)
  }
}
export const signin = async (req, res, next) => {
  try {
    const name = req.body.name
    if (name) {
      const user = await User.findOne({ name: name })
      if (!user) return next(handleError(403, 'User not found'))

      const isCorrect = await bcrypt.compare(req.body.password, user.password)
      if (!isCorrect) return next(handleError(403, 'Wrong credentials'))

      const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN)
      const { password, ...others } = user._doc
      res.cookie('access_token', token, { httpOnly: true }).json(others)
    }
  } catch (error) {
    next(error)
  }
}

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN)
      // console.log('Token login:', token)
      res.cookie('access_token', token, { httpOnly: true }).json(user._doc)
    } else {
      const newUser = new User({ ...req.body, fromGoogle: true })
      const savedUser = await newUser.save()
      const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_TOKEN)
      // console.log('Token register:', token)
      res.cookie('access_token', token, { httpOnly: true }).json(savedUser._doc)
    }
  } catch (error) {
    next(error)
  }
}
