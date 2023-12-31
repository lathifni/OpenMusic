const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (req, h) => handler.postAlbumHandler(req, h)
    },{
        method: 'GET',
        path: '/albums/{id}',
        handler: (req, h) => handler.getAlbumByIdHandler(req, h)
    },{
        method: 'PUT',
        path: '/albums/{id}',
        handler: (req, h) => handler.putAlbumByIdHandler(req, h)
    },{
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (req, h) => handler.deleteAlbumByIdHandler(req, h)
    },{
        method: 'POST',
        path: '/songs',
        handler: (req, h) => handler.postSongHandler(req, h)
    },{
        method: 'GET',
        path: '/songs',
        handler: (req) => handler.getSongsHandler(req)
    },{
        method: 'GET',
        path: '/songs/{id}',
        handler: (req, h) => handler.getSongByIdHandler(req, h)
    },{
        method: 'PUT',
        path: '/songs/{id}',
        handler: (req, h) => handler.putSongByIdHandler(req, h)
    },{
        method: 'DELETE',
        path: '/songs/{id}',
        handler: (req, h) => handler.deleteSongByIdHandler(req, h)
    }, {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: (req, h) => handler.postAlbumLikeByIdHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    }, {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: (req, h) => handler.getAlbumLikeByIdHandler(req, h),
    }, {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: (req, h) => handler.deleteAlbumLikeByIdHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    }
]

module.exports = routes