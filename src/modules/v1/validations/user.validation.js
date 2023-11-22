import { body, check } from 'express-validator';
import { User } from './../../../models'
import { Op } from 'sequelize';

export const createUserValidation = [
  body('name').notEmpty().withMessage('Bidang nama harus diisi'),
  body('email')
    .notEmpty()
    .withMessage('Bidang email harus diisi')
    .isEmail()
    .withMessage('Email yang anda masukkan tidak valid')
    .custom(async (val) => {
      const user = await User.findOne({
        where: {
          email: val
        }
      })

      if(user) throw new Error('Email yang anda gunakan sudah terdaftar')
    }),
  body('username')
    .notEmpty()
    .withMessage('Bidang username harus diisi')
    .custom(async (val) => {
      const user = await User.findOne({
        where: {
          username: val
        }
      })

      if(user) throw new Error('Username yang anda gunakan sudah terdaftar')
    }),
  body('password').notEmpty().withMessage('Bidang password harus diisi'),
  body('confirm_password')
    .notEmpty()
    .withMessage('Bidang konfirmasi password harus diisi')
    .custom((val, { req }) => val === req.body.password)
    .withMessage('Konfirmasi password harus sama dengan password'),
  body('is_active').notEmpty().withMessage('Bidang is active harus diiisi'),
  body('role').notEmpty().withMessage('Bidang role harus diisi')
];

export const updateUserValidation = [
    body('name').notEmpty().withMessage('Bidang nama harus diisi'),
    body('email')
      .notEmpty()
      .withMessage('Bidang email harus diisi')
      .isEmail()
      .withMessage('Email yang anda masukkan tidak valid')
      .custom(async (val, { req }) => {
        const user = await User.findOne({
          where: {
            id: {
              [Op.not]: req.params.id
            },
            email: val
          }
        })

        if(user) throw new Error('Email yang anda gunakan sudah terdaftar')
      }),
    body('username')
      .notEmpty()
      .withMessage('Bidang username harus diisi')
      .custom(async (val, { req }) => {
        const user = await User.findOne({
          where: {
            id: {
              [Op.not]: req.params.id
            },
            username: val
          }
        })

        if(user) throw new Error('Username yang anda gunakan sudat terdaftar')
      }),
    body('is_active').notEmpty().withMessage('Bidang is active harus diisi'),
    body('role').notEmpty().withMessage('Bidang role harus diisi')
]
