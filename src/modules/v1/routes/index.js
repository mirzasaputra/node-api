import { Router } from "express"

// validations
import { loginValidation } from "../validations/auth.validation"
import { createRoleValidation, updateRoleValidation } from "../validations/role.validation"
import { createUserValidation, updateUserValidation } from "../validations/user.validation"

// controllers
import { login, refreshToken, verifyToken } from "../controllers/auth/auth.controller"
import { changePermissions, createRoles, deleteRoles, getPermissions, getRoles, showRoles, updateRoles } from "../controllers/role/role.controller"
import { createUsers, deleteUsers, getUsers, setIsActiveUsers, showUsers, updateUsers } from "../controllers/user/user.controller"

// middlewares
import authenticatedMiddleware from "../middlewares/authenticated"

export const loadAuthRouter = app => {
    const router = Router()
    router.route('/login').post(...loginValidation, login)

    router.use(authenticatedMiddleware)
    router.route('/verify').get(verifyToken)
    router.route('/refresh').post(refreshToken)

    app.use('/auth', router)
}

export const loadRolesRouter = app => {
    const router = Router()
    router.use(authenticatedMiddleware)
    router.route('/').get(getRoles).post(...createRoleValidation, createRoles)
    router.route('/:id').get(showRoles).post(...updateRoleValidation, updateRoles).delete(deleteRoles)
    router.route('/:id/get-permissions').get(getPermissions)
    router.route('/:id/change-permissions').post(changePermissions)

    app.use('/roles', router)
}

export const loadUserRoute = app => {
    const router = Router()
    router.use(authenticatedMiddleware)
    router.route('/').get(getUsers).post(...createUserValidation, createUsers)
    router.route('/:id').get(showUsers).post(...updateUserValidation, updateUsers).delete(deleteUsers)
    router.route('/:id/set-is-active').get(setIsActiveUsers)

    app.use('/users', router)
}