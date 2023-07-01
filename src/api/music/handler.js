const ClientError = require("../../exeption/ClientError")

class MusicHandler {
    constructor(service, validator) {
        this._service = service
        this._validator = validator
    }

    async postAlbumHandler(req, h) {
        this._validator.validateAlbumsPayload(req.payload)
        const { name, year } = req.payload
        const albumId = await this._service.addAlbum({ name, year })
        return h.response({
            status: 'success',
            data: { albumId: albumId }
        }).code(201)
    }

    async getAlbumByIdHandler(req, h) {
        const { id } = req.params
        const album = await this._service.getAlbumById(id)
        return {
            status: 'success',
            data: { album }
        }
    }

    async putAlbumByIdHandler(req, h) {
        this._validator.validateAlbumsPayload(req.payload)
        const { id } = req.params
        await this._service.editAlbumById(id, req.payload)
        return {
            status: 'success',
            message: 'Album ' + req.params + ' berhasil diperbarui'
        }
    }

    async deleteAlbumByIdHandler(req, h) {
        const { id } = req.params
        await this._service.deleteAlbumById(id)
        console.log('testtt')
        return {
            status: 'success',
            message: 'data dengan id ' +id+ ' berhasil dihapus'
        }
    }

    async postSongHandler(req, h) {
        const { title, year, genre, performer, duration, albumId } = req.payload
        const songsId = await this.service.addSong({ title, year, genre, performer, duration, albumId })
        return res = h.response({
            status: 'success',
            data: { songsId: songsId }
        }).code(201)
    }

    async getSongsHandler() {
        const songs = await this._service.getSongs()
        return {
            status: 'success',
            data: { songs: songs }
        }
    }

    async getSongByIdHandler() {
        const song = await this.service.getSongById(req.params)
        return {
            status: 'success',
            data: { song: song }
        }
    }

    async putSongByIdHandler() {
        await this.service.editAlbumById(req.params, req.payload)
        return {
            status: 'success',
            message: `Berhasil memperbarui song ${req.params}`
        }
    }

    async deleteSongByIdHandler() {
        await this._service.deleteSongById(req.params)
        return {
            status: 'success',
            message: `Berhasil menghapus song ${req.params}`
        }
    }
}

module.exports = MusicHandler