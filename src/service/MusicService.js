const { nanoid } = require('nanoid')
const { Pool } = require('pg');
const NotFoundError = require('../exeption/NotFoundError');
const InvariantError = require("../exeption/InvariantError");

class MusicService {
    constructor(cacheService) {
        this._pool = new Pool()
        this._cacheService = cacheService
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
        // return res.rows[0]
        const albumData = res.rows[0];
        albumData.coverUrl = albumData.cover;
        delete albumData.cover;

        return albumData;
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

    async checkAlbumId(idAlbums) {
        const sql = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [idAlbums]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('Gagal, id albums tidak ditemukan')
        }
    }

    async checkLiked(idAlbums, user_id) {
        const sql = {
            text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
            values: [idAlbums, user_id]
        }
        const res = await this._pool.query(sql)
        if (res.rows.length) {
            throw new InvariantError('Gagal, sudah pernah di like')
        }
    }

    async postLikeByAlbumId({ user_id, album_id }) {
        const sql = {
            text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
            values: [nanoid(16), user_id, album_id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new InvariantError('Like gagal ditambahkan')
        }
        this._cacheService.delete(`album likes:${album_id}`)
        return res.rows[0].id
    }

    async getLikeByAlbumId(album_id) {
        const cached = await this._cacheService.get(`album likes:${album_id}`)
        if (cached){
            console.log('ada nih')
            return [parseInt(cached), true]
        }
        const sql = {
            text: 'SELECT COUNT(album_id) AS total_likes FROM user_album_likes WHERE album_id = $1',
            values: [album_id]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new InvariantError('Gagal mendapatkan data like')
        }
        const likes = parseInt(res.rows[0].total_likes)
        await this._cacheService.set(`album likes:${album_id}`, likes)
        console.log(album_id)
        return [likes, false]

        // try {
        //     await this._cacheService.delete(`album likes:${album_id}`)
        //     const cached = await this._cacheService.get(`album likes:${album_id}`)
        //     return cached
        //     // if (cached){
        //     //         console.log('ada nih')
        //     //         return parseInt(cached)
        //     //     }
        // } catch (error) {
        //         const sql = {
        //             text: 'SELECT COUNT(album_id) AS total_likes FROM user_album_likes WHERE album_id = $1',
        //             values: [album_id]
        //         }
        //         const res = await this._pool.query(sql)
        //         if (!res.rows.length) {
        //             throw new InvariantError('Gagal mendapatkan data like')
        //         }
        //         const likes = parseInt(res.rows[0].total_likes)
        //         await this._cacheService.set(`album likes:${album_id}`, likes)
        //         console.log(album_id)
        //         return likes
        // }
    }

    async deleteLikeByAlbumId(album_id, user_id) {
        const sql = {
            text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
            values: [album_id, user_id]
        }
        await this._cacheService.delete(`album likes:${album_id}`)
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('gagal menghapus like')
        }
    }
}

module.exports = MusicService