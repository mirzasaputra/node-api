import { body, check } from 'express-validator'

export const loginValidation = [
    body('username').notEmpty().withMessage('Bidang username harus diisi'),
    body('password').notEmpty().withMessage('Bidan password harus diisi'),
]