const { nanoid } = require('nanoid')
const { Pool } = require('pg');

class MusicService{
    constructor(){
        this._pool = new Pool()
    }

    async addAlbum({ name, year }){
        const id = nanoid(16)
        const sql = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values: [id, name, year]
        }
        const result = await this._pool.query(sql)
        if (!result.rows[0].id){
            throw new InvariantError('Catatan gagal ditambahkan')
        }
        return result.rows[0].id
        // return console.log('berhasil masuk ke addAlbum')
    }
}

module.exports = MusicService