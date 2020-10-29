import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..','..','tmp');

interface IUploadConfig {
    driver: 's3' | 'disk';
    config: {
        disk: {};
        aws: {
            bucket: string;
        };
    },

    multer: {
        storage: StorageEngine;
    },

    tmpFolder: string;
    uploadsFolder: string;
}

export default {
    driver: process.env.STORAGE_DRIVER,

    tmpFolder: tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const fileName = `${fileHash}-${file.originalname}`;
            
                return callback(null, fileName);
            }
        }),
    },
    config: {
        disk: {},
        aws: {
            bucket: 'app-gobarber-pedro-beto',
        }
    }
} as IUploadConfig;

