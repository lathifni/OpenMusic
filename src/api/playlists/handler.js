const NotFoundError = require("../../exeption/NotFoundError")

class PlaylistHandler {
    constructor(playlistsService, songsService, validator) {
        this._playlistsService = playlistsService
        this._songsService = songsService
        this._validator = validator
    }

    async postPlaylistHandler(req, h) {
        await this._validator.validatePlaylistPayload(req.payload)
        const { name } = req.payload
        const { id: credentialId } = req.auth.credentials
        const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId })
        return h.response({
            status: 'success',
            data: { playlistId: playlistId }
        }).code(201)
    }

    async getAllPlaylistsHandler(req, h) {
        const { id: credentialId } = req.auth.credentials
        const playlistId = await this._playlistsService.getAllPlaylists({ owner: credentialId })
        return h.response({
            status: 'success',
            data: { playlists: playlistId }
        })
    }

    async deletePlaylistByIdHandler(req, h) {
        const { id: credentialId } = req.auth.credentials
        const { id: idPlaylist } = req.params
        await this._playlistsService.getPlaylistByIdAndOwner({ owner: credentialId, idPlaylist })
        await this._playlistsService.deletePlaylistById(idPlaylist)
        return  h.response({
            status: 'success',
            message: 'berhasil menghapus playlists'
        })
    }

    async getSongsPlaylistById() {
        //
    }

    async postSongByIdIntoPlaylistHandler(req, h) {
        const { id: credentialId } = req.auth.credentials
        await this._validator.validateSongPlaylistPayload(req.payload)
        const { id: idPlaylist } = req.params
        const { songId } = req.payload
        await this._songsService.getSongById(songId)
        await this._playlistsService.getPlaylistByIdAndOwner({ owner: credentialId, idPlaylist })
        await this._playlistsService.addSongIntoPlaylist({ songId, idPlaylist })
        return h.response({
            status: 'success',
            message: 'berhasil menambahkan lagu ke dalam playlist'
        }).code(201)
    }

    async deleteSongsPlaylistByIdHandler(req, h) {
        const { id: credentialId } = req.auth.credentials
        await this._validator.validateSongPlaylistPayload(req.payload)
        const { id: idPlaylist } = req.params
        const { songId } = req.payload
        await this._playlistsService.getPlaylistByIdAndOwner({ owner: credentialId, idPlaylist })
        await this._playlistsService.deleteSongInPlaylist({ songId, idPlaylist })
        return h.response({
            status: 'success',
            message: 'Berhasil menghapus song dalam playlist'
        })
    }

    async getSongsPlaylistByIdHandler(req, h){
        const { id: credentialId } = req.auth.credentials
        await this._validator.validateSongPlaylistPayload(req.payload)
        const { id: idPlaylist } = req.params
        const test = await this._playlistsService.checkPlaylistId(idPlaylist)
        if (test == 0){
            throw new NotFoundError('Gagal, id playlist tidak ditemukan')
        }
        const playlist = await this._playlistsService.getPlaylistByIdAndOwner({ owner: credentialId, idPlaylist })
        
        const songs = await this._playlistsService.getSongsInPlaylistById(idPlaylist)
        const getSongsInPlaylist = { ...playlist, songs }

        return h.response({
            status: 'success',
            data: { playlist: getSongsInPlaylist }
        }).code(200)
    }
}

module.exports = PlaylistHandler