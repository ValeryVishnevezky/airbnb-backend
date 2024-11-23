import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { orderController } from './order.controller.js'

export const orderRoutes = express.Router()

orderRoutes.get('/', log, orderController.getOrders)
orderRoutes.post('/', log, requireAuth, orderController.addOrder)
orderRoutes.put('/:id', log, requireAuth, orderController.updateOrder)
orderRoutes.delete('/:id', requireAuth, orderController.deleteOrder)
orderRoutes.get('/:userId/user-orders', log, requireAuth, orderController.getUserOrders)
orderRoutes.get('/:hostId/host-orders', log, requireAuth, orderController.getHostOrders)
