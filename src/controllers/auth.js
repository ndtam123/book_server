import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import responseHandler from '../handler/responseHandler.js'
import jwt from 'jsonwebtoken'

// REGISTER
export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body
        const picture = req.file

        if (!email || !password || !confirmPassword) {
            return responseHandler.badRequest(res, 'Vui lòng điền đầy đủ thông tin!')
        }

        const user = await User.findOne({ email })
        if (user) return responseHandler.badRequest(res, 'Email đã được sử dụng!')

        if (password !== confirmPassword) {
            return responseHandler.badRequest(res, 'Xác nhận mật khẩu không giống mật khẩu!')
        }

        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)

        const newUser = new User({
            ...req.body,
            picture: picture?.path,
            password: hashPassword
        })
        await newUser.save()
        responseHandler.created(res, newUser)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return responseHandler.badRequest(res, 'Vui lòng điền đầy đủ thông tin!')
        }

        const user = await User.findOne({ email })

        if (!user) return responseHandler.badRequest(res, 'Tài khoản hoặc mật khẩu chưa chính xác!')

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return responseHandler.badRequest(res, 'Tài khoản hoặc mật khẩu chưa chính xác!')

        if (!user.isActive) {
            return res.status(400).json('Tài khoản của bạn đã bị khóa!')
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_KEY, { expiresIn: '30d' })

        delete user.password
        res.status(200).json({ user, token })
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const logout = async (req, res) => {
    try {
        if (!req.headers?.authorization) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ!' })
        }

        const authHeaders = req.headers.authorization
        const token = authHeaders.split(' ')[1]
        if (!token) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ!' })
        }

        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(401).json({ success: false, message: 'Người dùng không tồn tại!' })
        }

        const tokens = user.tokens
        const newTokens = tokens.filter(t => t.token !== token)

        await User.findByIdAndUpdate(req.user._id, { tokens: newTokens })
        res.status(200).json({ success: true, message: 'Đăng xuất thành công!' })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}
