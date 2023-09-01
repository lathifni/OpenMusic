const { nanoid } = require('nanoid')
const { Pool } = require('pg');
const NotFoundError = require('../exeption/NotFoundError');

class CollaborationService {
    constructor() {
        this._pool = new Pool()
    }

    async addCollaboration({ playlistId, userId }){
        try {
            const sql = {
                text: 'INSERT INTO collaborations VALUES ($1,$2,$3) RETURNING id',
                values: [nanoid(16), playlistId, userId]
            }
            const res = await this._pool.query(sql)
            if (!res.rows[0].id) {
                throw new InvariantError('Catatan gagal ditambahkan')
            }
            return res.rows[0].id
        } catch (error) {
            console.log(error
                )
        }
    }
}

module.exports = CollaborationService