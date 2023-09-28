/** Database setup for BizTime. */

const { Client } = require('pg')

let DATABASE_URI

const USERNAME = 'YOUR_USERNAME'
const PASSWORD = 'YOUR_PASSWORD'

if (process.env.NODE_ENV === 'test'){ DATABASE_URI = `postgresql://${USERNAME}:${PASSWORD}@localhost:5432/biztime` }
else { DATABASE_URI = `postgresql://${USERNAME}:${PASSWORD}@localhost:5432/biztime` }

let database = new Client({connectionString: DATABASE_URI})

database.connect()

module.exports = database