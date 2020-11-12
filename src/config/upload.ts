import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, cb) => {
      const fileHash = randomBytes(10).toString('hex');
      const fileName = `${Date.now()}-${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
