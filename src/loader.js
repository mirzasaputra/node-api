import path from "path"
import dotenv from "dotenv"
import { connect as dbConnection } from './database'

export const executeLoader = () => {
    const dotenvConfig = dotenv.config({
        path: path.join(__dirname, '..', '.env')
    })
    dbConnection()
    return { dotenvConfig }
}