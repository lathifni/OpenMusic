const ClientError = require("../../exeption/ClientError");
const NotFoundError = require("../../exeption/NotFoundError");

class ExportsHandler {
    constructor(service, playlistService, validator) {
      this._service = service;
      this._playlistService = playlistService
      this._validator = validator;
    }
    
    async postExportNotesHandler(req, h) {
        try {
          this._validator.validateExportNotesPayload(req.payload);
          const { id: credentialId } = req.auth.credentials
          const { id:idPlaylist } = req.params
          console.log(idPlaylist)
          const test = await this._playlistService.checkPlaylistId(idPlaylist)
          if (test == 0){
              throw new NotFoundError('Gagal, id playlist tidak ditemukan')
          }
          const playlist = await this._playlistService.getPlaylistByIdAndOwner({ owner: credentialId, idPlaylist })
          const message = {
            userId      : req.auth.credentials.id,
            targetEmail : req.payload.targetEmail,
            idPlaylist  : idPlaylist,
          };
    
          await this._service.sendMessage('export:music', JSON.stringify(message));
    
          const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrean',
          });
          response.code(201);
          return response;
        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
    
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          console.error(error);
          return response;
        }
      }
}

module.exports = ExportsHandler;