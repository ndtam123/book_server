import express from 'express'
import {
    addProductToUser,
    deleteUsers,
    getAUser,
    getAllUsers,
    getProductFromCart,
    removeAllProducts,
    removeMutiplesProductId,
    removeProductIdFromCart,
    removeQuantityProductIdFromCart,
    updatedUser,
    updatedUserByAdmin
} from '../controllers/user.js'
import { verifyAdmin, verifyUser } from '../middleware/verify.js'
import { validateAddProduct } from '../middleware/joiMiddleWare.js'

const router = express.Router()

// Get All Users
router.get('/', verifyAdmin, getAllUsers)
//Get Product from cart
router.get('/cart', verifyUser, getProductFromCart)
// Get A User
router.get('/find/user', verifyUser, getAUser)

// Update user
router.patch('/update-user', verifyUser, updatedUser)

// Update user by admin
router.patch('/update-user/admin', verifyAdmin, updatedUserByAdmin)

// Delete Many Users
router.delete('/', verifyAdmin, deleteUsers)

// Add productId to products field
router.post('/add', verifyUser, validateAddProduct, addProductToUser)

// Remove quantity of productId to products field
router.patch('/remove-quantity', verifyUser, removeQuantityProductIdFromCart)

// Remove productId from products field
router.patch('/remove', verifyUser, removeProductIdFromCart)

// Remove mutiple productId from products
router.patch('/remove-mutiple', verifyUser, removeMutiplesProductId)

// Remove all products from the cart
router.patch('/remove-all', verifyUser, removeAllProducts)

export default router
