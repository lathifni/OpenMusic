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

    async postAlbumLikeByIdHandler(req, h) {
        const { id: album_id } = req.params
        const { id: user_id } = req.auth.credentials
        await this._service.checkAlbumId(album_id)
        await this._service.checkLiked(album_id, user_id)
        await this._service.postLikeByAlbumId({ user_id, album_id })
        return h.response({
            status  : 'success',
            message : `Berhasil memberikan like `
        }).code(201)
    }

    async getAlbumLikeByIdHandler(req, h) {
        try {
            const { id: album_id } = req.params
            const [likes, cache] = await this._service.getLikeByAlbumId(album_id)
            // const cache = await this._service.getLikeByAlbumId(album_id)
            const response = h.response({
                status  : 'success',
                data : {likes: likes}
            }).code(200)
            if(cache) response.header('X-Data-Source', 'cache')
            return response
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAlbumLikeByIdHandler(req, h) {
        const { id: album_id } = req.params
        const { id: user_id } = req.auth.credentials
        await this._service.deleteLikeByAlbumId(album_id, user_id)
        return h.response({
            status  : 'success',
            message : `Berhasil membatalkan like `
        }).code(200)
    }
}

module.exports = MusicHandler