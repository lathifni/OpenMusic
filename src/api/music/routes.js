const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (req, h) => handler.postAlbumHandler(req, h)
    },
    {
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
        handler: () => handler.postSongHandler()
    },{
        method: 'GET',
        path: '/songs',
        handler: () => handler.getSongsHandler()
    },{
        method: 'GET',
        path: '/songs/{id}',
        handler: () => handler.getSongByIdHandler()
    },{
        method: 'PUT',
        path: '/songs/{id}',
        handler: () => handler.putSongByIdHandler()
    },{
        method: 'DELETE',
        path: '/songs/{id}',
        handler: () => handler.deleteSongByIdHandler()
    },
    // {
    //     method: 'GET',
    //     path: '/albums/{albumId}',
    //     handler: () => handler
    // },{
    //     method: 'GET',
    //     path: '/songs/{search}',
    //     handler: () => handler
    // }
]

module.exports = routes