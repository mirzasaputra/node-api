import { body, check } from "express-validator";

export const createRoleValidation = [
    body('name').notEmpty().withMessage('Bidang nama harus diisi'),
    body('guard_name').notEmpty().withMessage('Bidang guard name harus diisi'),
]

export const updateRoleValidation = [
    body('name').notEmpty().withMessage('Bidang nama harus diisi'),
    body('guard_name').notEmpty().withMessage('Bidang guard name harus diisi'),
]