import { Role, RoleHasPermission, Permission } from  './../../../../models'
import { paginateData, validateForm, filterRequest } from '../../utils/helper'
import { v4, validate } from 'uuid'

const REQUEST_BODY = ['name', ['guard_name', 'guardName']]

export const getRoles = async (req, res) => {
    try {
        const query = {
            include: [
                {
                    model: RoleHasPermission,
                    as: 'RoleHasPermission',
                    include: [
                        {
                            model: Permission,
                            as: 'Permission'
                        }
                    ]
                }
            ]
        }

        return res.json(await paginateData(req, Role, query))
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const createRoles = async (req, res) => {
    try {
        if(!validateForm(req, res)) return
        const role = await Role.create({
            id: v4(),
            ...filterRequest(req.body, true, REQUEST_BODY)
        })

        res.json({
            status: 'success',
            message: "Success creating role "+ role.name
        })
    } catch(err) {
        return res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const showRoles = async (req, res) => {
    try {
        const { id } = req.params
        const role = await Role.findByPk(id)

        res.json({
            status: 'success',
            message: 'Success getting data',
            data: role
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const updateRoles = async (req, res) => {
    try {
        if(!validateForm(req, res)) return
        const { id } = req.params
        await Role.update(filterRequest(req.body, true, REQUEST_BODY), { where: { id }})
        
        res.json({
            status: 'success',
            message: 'Success update role',
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const deleteRoles = async (req, res) => {
    try {
        const { id } = req.params
        const role = await Role.findByPk(id)
        if(role == null) {
            res.status(500).json({
                status: 'fail',
                message: 'Maaf, ID yang anda gunakan tidak valid.'
            })
            return
        }
        
        await Role.destroy({ where: { id } })
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

export const getPermissions = async (req, res) => {
    try {
        const { id } = req.params
        const permissions = await Permission.findAll({
            include: [{
                model: RoleHasPermission,
                as: 'RoleHasPermission',
                where: {
                    roleId: id
                },
                required: false
            }]
        })

        var remappingPermissions = {},
            currentSuffixPermission = null

        permissions.forEach(val => {
            var suffix = val.name.split('-')
                delete suffix[0]
                suffix = suffix.join(suffix.length > 2 ? '-' : '')
                
            if(currentSuffixPermission == null) {
                currentSuffixPermission = suffix
                remappingPermissions[suffix] = []
            }

            if(currentSuffixPermission == suffix) {
                remappingPermissions[suffix].push(val)
            } else {
                if(typeof remappingPermissions[suffix] !== 'object') remappingPermissions[suffix] = []
                remappingPermissions[suffix].push(val)
                currentSuffixPermission = suffix
            }
        })

        var updatedPermissions = [], temp
        for(const val in remappingPermissions) {
            temp = remappingPermissions[val].map(val => {
                var isChecked = val.RoleHasPermission.length > 0
                delete val.RoleHasPermission
                return {
                    id: val.id,
                    name: val.name,
                    guardName: val.guardName,
                    createdAt: val.createdAt,
                    updatedAt: val.updatedAt,
                    isChecked
                }
            })
            updatedPermissions.push(temp)
        }

        res.json({
            status: 'success',
            message: 'Success getting data',
            data: updatedPermissions
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}

export const changePermissions = async(req, res) => {
    try {
        if(!validateForm(req, res)) return
        const { id } = req.params
        const { permissions } = req.body
        const role = await Role.findByPk(id)
        if(role == null) {
            res.status(500).json({
                status: 'fail',
                message: 'Maaf, ID yang digunakan tidak valid'
            })
            return
        }
        await role.syncPermission(permissions)

        res.json({
            status: 'success',
            message: 'Success update permission for role '+ role.name
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}
