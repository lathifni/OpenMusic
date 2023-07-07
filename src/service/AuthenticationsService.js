const { Pool } = require("pg");
const InvariantError = require("../exeption/InvariantError");

class AuthenticationsService {
    constructor(){
        this._pool = new Pool()
    }

    async addRefreshToken(refreshToken){
        const sql = {
            text: 'INSERT INTO authentications values ($1)',
            values: [refreshToken]
        }
        await this._pool.query(sql)
    }

    async verifyRefreshToken(refreshToken){
        const sql = {
            text: 'SELECT * FROM authentications WHERE token = $1',
            values: [refreshToken]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length){
            throw new InvariantError('Refresh token tidak valid')
        }
    }

    async deleteRefreshToken(refreshToken){
        await this.verifyRefreshToken(refreshToken)
        const sql = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [refreshToken]
        }
        await this._pool.query(sql)
    }
}

module.exports = AuthenticationsService