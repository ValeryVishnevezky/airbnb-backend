import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { userController } from "./user.controller.js";

export const userRoutes = express.Router()

userRoutes.get('/', userController.getUsers)
userRoutes.get('/:id', userController.getUser)
userRoutes.put('/:id', requireAuth, userController.updateUser)
userRoutes.delete('/:id', requireAuth, requireAdmin, userController.deleteUser)
