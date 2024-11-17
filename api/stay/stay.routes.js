import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { stayController } from './stay.controller.js'

export const stayRoutes = express.Router()

stayRoutes.get('/', log, stayController.getStays)
stayRoutes.get('/:id', log, stayController.getStayById)
stayRoutes.post('/', log, requireAdmin, stayController.addStay)
stayRoutes.put('/', requireAdmin, stayController.updateStay)
stayRoutes.delete('/:id', requireAdmin, stayController.removeStay)
