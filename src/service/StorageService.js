const fs = require('fs');
const { Pool } = require("pg");
const InvariantError = require("../exeption/InvariantError");
 
class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool()
 
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }
 
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;
    const fileStream = fs.createWriteStream(path);
 
    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

    async updateCover({ albumId, fileLocation}){
        const sql = {
            text: 'update albums SET cover = $1 WHERE id = $2 RETURNING id',
            values: [fileLocation, albumId]
        }
        const res = await this._pool.query(sql)
            if (!res.rows.length) {
                throw new InvariantError('gagal memperbarui cover album')
            }
    }
}

module.exports = StorageService;