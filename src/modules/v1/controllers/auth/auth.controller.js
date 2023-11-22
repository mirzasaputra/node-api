import { Op } from "sequelize";
import { compare, genSalt, hash } from "bcrypt";
import { sign, decode } from "jsonwebtoken";
import { Permission, Role, RoleHasPermission, User, UserHasRole } from './../../../../models'
import { validateForm } from './../../utils/helper'

const generateJwtToken = async (user) => {
    const jwtTokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        roles: user.Roles,
        permissions: user?.Roles[0].Permission
    }

    return sign(jwtTokenPayload, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || '60d'
    })
}

export const verifyToken = async (req, res) => {
    return res.json({
        status: 'success',
        message: 'Token verified successfully'
    })
}

export const login = async (req, res) => {
    try {
        if(!validateForm(req, res)) return
        const { username, password } = req.body
    
        if(!username || !password) {
            return res.status(422).json({
                status: 'fail',
                message: 'Username & Password required',
            })
        }
    
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email: username }
                ]
            },
            include: [{
                model: UserHasRole,
                as: 'UserHasRole',
                include: [{
                    model: Role,
                    as: 'Role',
                    include: [{
                        model: RoleHasPermission,
                        as: 'RoleHasPermission',
                        include: [{
                            model: Permission,
                            as: 'Permission'
                        }]
                    }]
                }]
            }]
        })
    
        if(user != null) {
            if(await compare(password, user.password)) {
                const token = await generateJwtToken(user)
                res.json({
                    status: 'success',
                    message: 'Login success',
                    data: { token }
                })
            } else {
                res.status(422).json({
                    status: 'fail',
                    message: 'Error validation',
                    errors: {
                        password: ['Maaf, password yang anda masukkan tidak sesuai']
                    }
                })
            }
        } else {
            res.status(422).json({
                status: 'fail',
                message: 'Error validation',
                errors: {
                    username: ['Maaf, username atau email anda belum terdaftar.']
                }
            })
        }
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { exp: expiredTime, id: userId} = decode(
            req.headers.authorization.split(' ')[1]
        )

        if(Date.now() >= expiredTime * 1000) {
            return res.status(403).json({
                status: 'fail',
                message: 'Token sudah expired!'
            })
        }

        const user = await User.findByPk(userId)
        const newJwtToken = await generateJwtToken(user)

        res.json({
            status: 'success',
            message: 'Token baru telah diterbitkan',
            data: {
                token: newJwtToken
            }
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}