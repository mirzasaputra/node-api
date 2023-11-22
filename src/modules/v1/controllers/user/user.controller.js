import { Op } from 'sequelize'
import { filterRequest, paginateData, validateForm } from '../../utils/helper'
import { User, UserHasRole, Role } from './../../../../models'
import { genSalt, hash } from 'bcrypt'
import { v4 } from 'uuid'

const REQUEST_BODY = ['name', 'username', 'email', ['is_active', 'isActive']]

export const getUsers = async (req, res) => {
    try {
        const query = {
            where: {
                deletedAt: {
                    [Op.is]: null
                }
            },
            include: [{
                model: UserHasRole,
                as: 'UserHasRole',
                include: [{
                    model: Role,
                    as: 'Role'
                }]
            }]
        }

        res.json(await paginateData(req, User, query))
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const createUsers = async (req, res) => {
    try {
        if(!validateForm(req, res)) return
        const password = await hash(req.body.password, await genSalt())
        const user = await User.create({
            id: v4(),
            ...filterRequest(req.body, true, REQUEST_BODY),
            password: password,
        })
        await user.assignRole(req.body.role)

        res.json({
            status: 'success',
            message: 'Success create user '+ user.name
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const showUsers = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({
            where: { id },
            include: [{
                model: UserHasRole,
                as: 'UserHasRole',
                include: [{
                    model: Role,
                    as: 'Role'
                }]
            }]
        })

        res.json({
            status: 'success',
            message: 'Success getting data',
            data: user
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const updateUsers = async (req, res) => {
    try {
        if(!validateForm(req, res)) return
        const { id } = req.params
        await User.update(filterRequest(req.body, true, REQUEST_BODY), { where: { id }})

        res.json({
            status: 'success',
            message: 'Success update users'
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const deleteUsers = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)
        if(user == null) {
            res.status(500).json({
                status: 'fail',
                message: 'Maaf, ID yang digunakan tidak valid'
            })
            return
        }

        await User.destroy({ where: { id } })
        res.json({
            status: 'success',
            message: 'Success deleting data'
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const setIsActiveUsers = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOne({ where: { id } })
        if(user == null) {
            res.status(500).json({
                status: 'fail',
                message: 'Maaf, ID yang digunakan tidak valid'
            })
            return
        }

        await User.update({ isActive: !user.isActive }, { where: { id }})
        res.json({
            status: 'success',
            message: 'Success update status aktif user '+ user.name
        })
    } catch(err) {
        res.status(500).json({
            status: 'faile',
            message: err.message
        })
    }
}
