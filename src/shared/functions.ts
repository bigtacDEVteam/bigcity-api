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

const replaceDomainWithLocalhost = (url: string) => {
  const { hostname, port, protocol, href } = new URL(url);
  return href.replace(
    `${protocol}//${hostname}:${port}`,
    'http://localhost:5000',
  );
};

export const eghlFixedFields = (p: any) => ({
  MerchantName: 'BigTac',
  MerchantReturnURL:
    process.env.ENV === 'local' && p?.MerchantReturnURL
      ? replaceDomainWithLocalhost(p.MerchantReturnURL)
      : p?.MerchantReturnURL,
  MerchantCallbackURL:
    process.env.ENV === 'local' && p?.MerchantCallbackURL
      ? replaceDomainWithLocalhost(p.MerchantCallbackURL)
      : p?.MerchantCallbackURL,
  MerchantTermsURL:
    process.env.ENV === 'local' && p?.MerchantTermsURL
      ? replaceDomainWithLocalhost(p.MerchantTermsURL)
      : p?.MerchantTermsURL,
  LanguageCode: 'en',
  PageTimeout: '780',
  CurrencyCode: 'MYR',
});

export const generateSaleHashKey = (p: any) => {
  const fields = eghlFixedFields(p);
  const hashKey = [
    p.password,
    p.username,
    p.PaymentID,
    fields.MerchantReturnURL,
    fields.MerchantCallbackURL,
    p.Amount,
    fields.CurrencyCode,
    p.CustIP,
    fields.PageTimeout,
  ].join('');

  return sha256.update(hashKey).hex();
};

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
