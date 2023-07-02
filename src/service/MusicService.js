const { nanoid } = require('nanoid')
const { Pool } = require('pg');
const NotFoundError = require('../exeption/NotFoundError');

class MusicService {
    constructor() {
        this._pool = new Pool()
    }

    async addAlbum({ name, year }) {
        const sql = {
            text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values: [nanoid(16), name, year]
        }
        const res = await this._pool.query(sql)
        if (!res.rows[0].id) {
            throw new InvariantError('Catatan gagal ditambahkan')
        }
        return res.rows[0].id
    }

    async getAlbumById(id) {
        const sql = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('Id album tidak ditemukan')
        }
        return res.rows[0]
    }

    async editAlbumById(id, { name, year }) {
        const sql = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('gagal memperbarui album')
        }
    }

    async deleteAlbumById(id) {
        const sql = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('gagal menghapus album')
        }
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const sql = {
            text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [nanoid(16), albumId, title, year, genre, performer, duration]
        }
        const res = await this._pool.query(sql)
        if (!res.rows[0].id) {
            throw new InvariantError('Song gagal ditambahkan')
        }
        return res.rows[0].id
    }

    async getSongs(title, performer) {
        if (title !== undefined && performer !== undefined) {
            const sql = {
                text: "SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)",
                values: [`%${title}%`, `%${performer}%`]
            }
            return (await this._pool.query(sql)).rows.map(row => ({
                id: row.id,
                title: row.title,
                performer: row.performer
            }))
        }else if (title !== undefined || performer !== undefined){
            const sql = {
                text: "SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(performer) LIKE LOWER($2)",
                values: [`%${title}%`, `%${performer}%`]
            }
            return (await this._pool.query(sql)).rows.map(row => ({
                id: row.id,
                title: row.title,
                performer: row.performer
            }))
        }
        return (await this._pool.query('SELECT * FROM songs')).rows.map(row => ({
            id: row.id,
            title: row.title,
            performer: row.performer
        }))
    }

    async getSongById(id) {
        const sql = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('Id song tidak ditemukan')
        }
        return res.rows[0]
    }

    async editSongById(id, { title, year, genre, performer, duration }) {
        const sql = {
            text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5 WHERE id=$6 RETURNING id',
            values: [title, year, genre, performer, duration, id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('gagal memperbarui song')
        }
    }

    async deleteSongById(id) {
        const sql = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('gagal menghapus songs')
        }
    }

    async getSongsByAlbumId(id) {
        const sql = {
            text: 'SELECT * FROM songs WHERE album_id = $1',
            values: [id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            return []
        }
        return res.rows.map(row => ({
            id: row.id,
            title: row.title,
            performer: row.performer
        }))
    }
}

module.exports = MusicService