import { Sequelize } from "sequelize";
import dbOptions from './../config/database'

const {
     database: dbName,
     username,
     password,
     host,
     port,
     dialect
} = dbOptions[process.env.NODE_ENV || 'development']

let sequelize

export let isConnected = false

export async function connect() {
    try {
        sequelize = new Sequelize({
            host: host,
            port: port,
            username: username,
            password: password,
            database: dbName,
            dialect: dialect
        })
        await sequelize.authenticate()
        isConnected = false
        console.log('[SEQUELIZE][OK] Database Connection Ok')
    } catch(err) {
        console.log('[SEQUELIZE][ERROR] failed to connect to database', err.message)
        process.exit(1)
    }
}

export async function close() {
    sequelize.close()
    isConnected = false
    console.log('[SEQUELIZE][OK] Databasee Closed')
}