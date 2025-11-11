import { sha256 } from 'js-sha256';
import * as sharp from 'sharp';
import * as path from 'path';

export const buildTypeOrmOrder = (query: any) =>
  query
    ? Object.fromEntries(
        query.split(',').map((rule: string) => {
          const [field, order] = rule.split(':');
          return [field, order.toUpperCase()];
        }),
      )
    : {};

export const guidGenerator = (): string =>
  Array.from({ length: 4 }, () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .toUpperCase()
      .substring(1),
  ).join('');


export const processFile = async (
  file: Express.Multer.File,
  folder: string,
) => {
  const mimeTypeMap = {
    'image/jpg': '.jpg',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/pdf': '.pdf',
  };

  const fileExt = mimeTypeMap[file.mimetype] || '';
  const originalName = file.originalname
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(fileExt, '');

  const uniqueName = `uploads/${folder}/${Date.now()}-${originalName}-compressed${fileExt}`;
  const uploadDir = path.join(__dirname, '../../', uniqueName);

  if (file.mimetype.match(/^image\/(jpeg|png)$/)) {
    await sharp(file.buffer)
      .resize(800)
      .jpeg({ quality: 90 })
      .toFile(uploadDir);
  }

  return uniqueName;
};
