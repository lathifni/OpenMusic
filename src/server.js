const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert');
const path = require('path');
require('dotenv').config()
const ClientError = require('./exeption/ClientError')

const music = require('./api/music')
const MusicService = require('./service/MusicService')
const MusicValidator = require('./validator/music')

const users = require('./api/users')
const UsersService = require('./service/UsersService')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./service/AuthenticationsService')
const TokenManager = require('./tokenizer/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

const playlists = require('./api/playlists')
const PlaylistService = require('./service/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

const collaborations = require('./api/collab')
const CollaborationService = require('./service/CollabService')
const CollaborationValidator = require('./validator/collab')

const _exports = require('./api/exports')
const ProducerService = require('./service/ProducerService')
const ExportValidator = require('./validator/exports')

const uploads = require('./api/uploads');
const StorageService = require('./service/StorageService')
const UploadsValidator = require('./validator/uploads');

const CacheService = require('./service/CacheService')

const init = async () => {
  const cacheService = new CacheService();
  const musicService = new MusicService(cacheService)
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const playlistService = new PlaylistService()
  const collaborationService = new CollaborationService()
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/name'))
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: Jwt
    }, {
      plugin: Inert
    }
  ])

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    })
  })

  await server.register([
    {
      plugin: music,
      options: {
        service: musicService,
        validator: MusicValidator
      }
    }, {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    }, {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    }, {
      plugin: playlists,
      options: {
        playlistsService: playlistService,
        songsService: musicService,
        validator: PlaylistsValidator
      }
    }, {
      plugin: collaborations,
      options: {
        service: collaborationService,
        validator: CollaborationValidator
      }
    }, {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService: playlistService,
        validator: ExportValidator
      }
    }, {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      return h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      }).code(500);
    }
    return h.continue;
  });

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()