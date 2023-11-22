import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

export const loadMiddleware = app => {
    app.use(helmet())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.query())
    app.use(cors())
    app.use(morgan('dev'))

    return app
}