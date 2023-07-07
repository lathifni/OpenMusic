const { Pool } = require("pg");
const bcrypt = require('bcrypt')
const InvariantError = require("../exeption/InvariantError");
const { nanoid } = require("nanoid");
const NotFoundError = require("../exeption/NotFoundError");
const AuthenticationError = require("../exeption/AuthenticationsError");

class UsersService {
    constructor(){
        this._pool = new Pool
    }

    async addUser({ username, password, fullname }){
        await this.verifyNewUser(username)
        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = {
            text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
            values: [nanoid(16), username, hashedPassword, fullname]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new InvariantError('gagal menambahkan user')
        }
        return res.rows[0].id
    }

    async getUserById(id){
        const sql = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length){
            throw new NotFoundError('User tidak ditemukan')
        }
    }

    async verifyNewUser(username){
        const sql = {
            text: 'SELECT * FROM users WHERE username = $1',
            values: [username]
        }
        const res = await this._pool.query(sql)
        if (res.rows.length > 0){
            throw new InvariantError('Gagal menambahkan user, username sudah ada')
        }
        return res.rows[0]
    }

    async verifyUserCridential(username, password){
        const sql = {
            text: 'SELECT id, password FROM users WHERE username = $1',
            values:[username]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length){
            throw new AuthenticationError('Kredensial yang dimasukkan salah')
        }
        
        const { id, password: hashedPassword } = res.rows[0]
        const match = await bcrypt.compare(password, hashedPassword)
        if (!match){
            throw new AuthenticationError('Kredensial yang Anda berikan salah')
        }
        return id
    }
}

module.exports = UsersService