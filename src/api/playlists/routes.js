const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: (req, h) => handler.postPlaylistHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    },{
        method: 'GET',
        path: '/playlists',
        handler: (req, h) => handler.getAllPlaylistsHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    },{
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: (req, h) => handler.deletePlaylistByIdHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    },{
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: (req, h) => handler.getSongsPlaylistByIdHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    },{
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: (req, h) => handler.postSongByIdIntoPlaylistHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    },{
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: (req, h) => handler.deleteSongsPlaylistByIdHandler(req, h),
        options: {
            auth: 'musicapp_jwt'
        }
    }
]

module.exports = routes