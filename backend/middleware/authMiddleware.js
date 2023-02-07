/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// protecting routes
const protectRoutes = asyncHandler(async (req, res, next) => {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			console.log(decoded)

			req.user = await User.findById(decoded.id).select('-password')
			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			throw new Error('Not authorized, token Failed')
		}
	}

	if (!token) {
		res.status(401)
		throw new Error('Not authorized, no token')
	}
})
// validate as influencer
const influencer = (req, res, next) => {
	if (
		(req.user && req.user.isInfluencer) ||
		req.user.isEditor ||
		req.user.isAdmin
	) {
		next()
	} else {
		res.status(401)
		throw new Error('Not authorized as influencer')
	}
}
// validate as editor
const editor = (req, res, next) => {
	if ((req.user && req.user.isEditor) || req.user.isAdmin) {
		next()
	} else {
		res.status(401)
		throw new Error('Not authorized as editor')
	}
}
// validate as admin
const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next()
	} else {
		res.status(401)
		throw new Error('Not authorized as admin')
	}
}

export { protectRoutes, admin, editor, influencer }
