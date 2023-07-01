const { nanoid } = require('nanoid')
const { Pool } = require('pg');
const NotFoundError = require('../exeption/NotFoundError');

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
        const res = await this._pool.query(sql)
        if (!res.rows[0].id){
            throw new InvariantError('Catatan gagal ditambahkan')
        }
        return res.rows[0].id
    }

    async getAlbumById(id){
        const sql ={
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }
        return (await this._pool.query(sql)).rows[0]
    }

    async editAlbumById(id, { name, year }){
        const sql = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length){
            throw new NotFoundError('gagal memperbarui album')
        }
    }

    async deleteAlbumById(id){
        console.log('servicenya delete')
        const sql = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }
        
        const res = await this._pool.query(sql)
        if (!res.rows.length){
            throw new NotFoundError('gagal menghapus album')
        }
    }
}

module.exports = MusicService