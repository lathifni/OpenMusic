const { Pool } = require("pg");
const { nanoid } = require('nanoid');
const InvariantError = require("../exeption/InvariantError");
const NotFoundError = require("../exeption/NotFoundError");
const AutorizationError = require('../exeption/AuthorizationError')

class PlaylistService {
    constructor() {
        this._pool = new Pool()
    }

    async addPlaylist({ name, owner }) {
        const sql = {
            text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values: [nanoid(16), name, owner]
        }
        const res = await this._pool.query(sql)
        if (!res.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan')
        }
        return res.rows[0].id
    }

    async getAllPlaylists({ owner }) {
        const sql = {
            text: 'SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.owner=$1',
            values: [owner]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan')
        }
        return res.rows
    }

    async addSongIntoPlaylist({ songId, idPlaylist }) {
        const sql = {
            text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
            values: [nanoid(16), idPlaylist, songId]
        }
        const res = await this._pool.query(sql)
        if (!res.rows[0].id) {
            throw new InvariantError('Gagal menambahkan lagu ke dalam playlist')
        }
    }

    async getPlaylistByIdAndOwner({ owner, idPlaylist }) {
        const sql = {
            text: 'SELECT p.id, p.name, u.username FROM playlists AS p INNER JOIN users AS u ON p.owner = u.id WHERE p.owner = $1 AND p.id = $2',
            values: [owner, idPlaylist]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            // const sqll = {
            //     text: 'SELECT * FROM playlist_songs WHERE id = $1',
            //     values: [idPlaylist]
            // }
            // const ress = await this._pool.query(sqll)
            // if (!ress.rows.length) {
            //     // return 0
            //     throw new NotFoundError('Gagal, id playlist tidak ditemukan')
            // }
            throw new AutorizationError('Anda tidak punya akses terhadap playlist ini')
        }
        return res.rows[0]
    }

    async checkPlaylistId(idPlaylist){
        const sql = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [idPlaylist]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            // return 0
            return 0 && new NotFoundError('Gagal, id playlist tidak ditemukan')
        }
    }

    async getSongsInPlaylistById(idPlaylist){
        const sql = {
            text: "SELECT * FROM songs INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1",
            values: [idPlaylist]
        }
        return (await this._pool.query(sql)).rows.map(row => ({
            id: row.id,
            title: row.title,
            performer: row.performer
        }))
    }

    async deletePlaylistById(idPlaylist){
        const sql = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [idPlaylist]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length) {
            throw new InvariantError('gagal menghapus playlist')
        }
    }

    async deleteSongInPlaylist({ songId, idPlaylist }){
        const sql = {
            text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
            values: [songId, idPlaylist]
        }
        const res = await this._pool.query(sql)
        if (!res.rows.length){
            throw new InvariantError('gagal menghapus song dalm playlist')
        }
    }
}

module.exports = PlaylistService