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
        const songs = await this._service.getSongsByAlbumId(id)
        const getDetailAlbumContainsSongs = { ...album, songs}
        return {
            status: 'success',
            data: { album: getDetailAlbumContainsSongs }
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
        return {
            status: 'success',
            message: 'data dengan id ' +id+ ' berhasil dihapus'
        }
    }

    async postSongHandler(req, h) {
        this._validator.validateSongsPayload(req.payload)
        const { title, year, genre, performer, duration, albumId } = req.payload
        const songsId = await this._service.addSong({ title, year, genre, performer, duration, albumId })
        return h.response({
            status: 'success',
            data: { songId: songsId }
        }).code(201)
    }

    async getSongsHandler(req) {
        const { title, performer } = req.query
        const songs = await this._service.getSongs(title, performer)
        return {
            status: 'success',
            data: { songs: songs }
        }
    }

    async getSongByIdHandler(req, h) {
        const { id } = req.params
        const song = await this._service.getSongById(id)
        return {
            status: 'success',
            data: { song }
        }
    }

    async putSongByIdHandler(req, h) {
        this._validator.validateSongsPayload(req.payload)
        const { id } = req.params
        await this._service.editSongById(id, req.payload)
        return {
            status: 'success',
            message: `Berhasil memperbarui song `
        }
    }

    async deleteSongByIdHandler(req, h) {
        const { id } = req.params
        await this._service.deleteSongById(id)
        return {
            status: 'success',
            message: `Berhasil menghapus song `
        }
    }
}

module.exports = MusicHandler