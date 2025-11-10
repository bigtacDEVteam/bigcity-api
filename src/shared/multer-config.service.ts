import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';

@Injectable()
export class MulterConfigService {
  static getMulterOptions(destination: string) {
    return {
      storage: diskStorage({
        destination,
        filename: (req, file, cb) => {
          const mimeTypeMap = {
            'image/jpg': '.jpg',
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'application/pdf': '.pdf',
          };

          const fileExt = mimeTypeMap[file.mimetype] || '';
          // console.log(fileExt);
          // Sanitize filename by removing spaces and special characters
          const originalName = file.originalname
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9._-]/g, '');

          // Append timestamp for uniqueness
          const uniqueName = `${Date.now()}-${originalName}${fileExt}`;

          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new Error('Only image files and PDFs are allowed!'), false);
        } else {
          cb(null, true);
        }
      },
    };
  }

  static async compressImage(filePath: string, destinationPath: string) {
    console.log('compress');
    await sharp(filePath)
      .resize(800) // Resize width to 800 pixels (optional)
      .jpeg({ quality: 20 }) // Compress JPEG with 80% quality
      .toFile(destinationPath);
  }
}
