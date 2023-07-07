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
    },
]

module.exports = routes