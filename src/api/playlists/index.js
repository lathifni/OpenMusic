const routes = require("./routes")
const PlaylistHandler = require("./handler")

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, {playlistsService, songsService, validator}) => {
        const playlistHandler = new PlaylistHandler(playlistsService, songsService, validator)
        server.route(routes(playlistHandler))
    }
}