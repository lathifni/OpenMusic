const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler
    },
    // {
    //     method: 'GET',
    //     path: '/albums/{id}',
    //     handler: handler
    // },{
    //     method: 'PUT',
    //     path: '/albums/{id}',
    //     handler: handler
    // },{
    //     method: 'DELETE',
    //     path: '/delete/{id}',
    //     handler: handler
    // },{
    //     method: 'POST',
    //     path: '/songs',
    //     handler: handler
    // },{
    //     method: 'GET',
    //     path: '/songs',
    //     handler: handler
    // },{
    //     method: 'GET',
    //     path: '/songs/{id}',
    //     handler: handler
    // },{
    //     method: 'PUT',
    //     path: '/songs/{id}',
    //     handler: handler
    // },{
    //     method: 'DELETE',
    //     path: '/songs/{id}',
    //     handler: handler
    // },{
    //     method: 'GET',
    //     path: '/albums/{albumId}',
    //     handler: handler
    // },{
    //     method: 'GET',
    //     path: '/songs/{search}',
    //     handler: handler
    // }
]

module.exports = routes