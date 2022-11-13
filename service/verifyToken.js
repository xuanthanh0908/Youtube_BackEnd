import jwt from 'jsonwebtoken'
import { handleError } from './handleError.js'
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) return next(handleError(401, 'You are not authenticated !!'))
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return next(handleError(403, 'You are not authorzition !!'))
    req.user = user
    next()
  })
}
