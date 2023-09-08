const ClientError = require('../../exeption/ClientError');
 
class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }
 
  async postUploadImageHandler(req, h) {
    try {
        const { id: albumId } = req.params
      const { cover } = req.payload;
      this._validator.validateImageHeaders(cover.hapi.headers);
 
      const filename = await this._service.writeFile(cover, cover.hapi);
      // const fileLocation = `/uploads/name/${filename}`
      const fileLocation = `http://localhost:${process.env.PORT}/uploads/name/${filename}`
      // const fileLocation = `${filename}`
      this._service.updateCover({ albumId, fileLocation})
      const response = h.response({
        status: 'success',
        message: "Sampul berhasil diunggah"
      }).code(201);
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

  async test(req, h) {
    console.log('gambar nih')
    return h.code(200)
  }
}
 
module.exports = UploadsHandler;