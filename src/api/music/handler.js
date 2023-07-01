const ClientError = require("../../exeption/ClientError")

class MusicHandler{
    constructor(service, validator){
        this._service = service
        this._validator = validator
        this.postAlbumHandler = this.postAlbumHandler.bind(this)
    }

    async postAlbumHandler(request, h){
        try {
            console.log('1')
            this._validator.validateMusicPayload(request.payload)
            console.log('2')
            const { name, year} = request.payload
            const albumId = await this._service.addAlbum({ name, year })
            console.log('3')
            const res = h.response({
                status: 'success',
                data: { album: albumId }
            }).code(201)
            return res
        } catch (error) {
            if (error instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: error.message
                })
                response.code(400)
                return response
            }
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.'
            })
            response.code(500)
            console.error(error)
            return response
        }
    }

    // async getAlbumByIdHandler(){
    //     const album = await this._service.getAlbumById(request.params)
    //     return{
    //         status: 'success',
    //         data: { album: album}
    //     }
    // }

    // async putAlbumByIdHandler(){
    //     await this._service.editAlbumById(req.params, req.payload)
    //     return{
    //         status: 'success',
    //         message: 'Album '+req.params+' berhasil diperbarui'
    //     }
    // }

    // async deleteAlbumByIdHandler(){
    //     await this._service.deleteAlbumById(req.params)
    //     return{
    //         status: 'success',
    //         message: 'data dengan id '+req.params+' berhasil dihapus'
    //     }
    // }

    // async postSongHandler(req, h){
    //     const { title, year, genre, performer, duration, albumId } = req.payload
    //     const songsId = await this.service.addSong({ title, year, genre, performer, duration, albumId })
    //     return res =h.response({
    //         status: 'success',
    //         data: { songsId: songsId}
    //     }).code(201)
    // }

    // async getSongsHandler(){
    //     const songs = await this._service.getSongs()
    //     return{
    //         status: 'success',
    //         data: { songs: songs }
    //     }
    // }

    // async getSongByIdHandler(){
    //     const song = await this.service.getSongById(req.params)
    //     return{
    //         status: 'success',
    //         data: { song: song }
    //     }
    // }
    
    // async putSongByIdHandler(){
    //     await this.service.editAlbumById(req.params, req.payload)
    //     return{
    //         status: 'success',
    //         message: `Berhasil memperbarui song ${req.params}`
    //     }
    // }

    // async deleteSongByIdHandler(){
    //     await this._service.deleteSongById(req.params)
    //     return{
    //         status: 'success',
    //         message: `Berhasil menghapus song ${req.params}`
    //     }
    // }
}

module.exports = MusicHandler