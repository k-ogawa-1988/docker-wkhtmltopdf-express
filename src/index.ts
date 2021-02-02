import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import wkhtmltopdf from 'wkhtmltopdf';

type Orientation = 'Landscape' | 'Portrait';
type PageSize =
  | 'A0'
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'A7'
  | 'A8'
  | 'A9'
  | 'B0'
  | 'B1'
  | 'B2'
  | 'B3'
  | 'B4'
  | 'B5'
  | 'B6'
  | 'B7'
  | 'B8'
  | 'B9'
  | 'B10'
  | 'C5E'
  | 'Comm10E'
  | 'DLE'
  | 'Executive'
  | 'Folio'
  | 'Ledger'
  | 'Legal'
  | 'Letter'
  | 'Tabloid';

const app = express();
const textParser = bodyParser.text({ type: 'text/html' });
const jsonParser = bodyParser.json();

const getOrientation = (orgOrientation: any): Orientation => {
  if (typeof orgOrientation === 'string' && ['landscape', 'portrait'].includes(orgOrientation.toLowerCase())) {
    switch (orgOrientation.toLowerCase()) {
      case 'landscape':
        return 'Landscape';
      case 'portrait':
        return 'Portrait';
    }
  }

  return 'Portrait';
};

const getPageSize = (orgPageSize: any): PageSize => {
  if (typeof orgPageSize === 'string') {
    return (orgPageSize as PageSize) || 'A4';
  }

  return 'A4';
};

const getOptions = (req: Request): any => {
  return {
    debug: true,
    logLevel: 'info',
    pageSize: getPageSize(req.query.size),
    orientation: getOrientation(req.query.orientation),
  };
};

const onError = (err: Error, res: Response) => {
  console.error(err);
  res.status(500);
  res.append('Content-Type', 'text/json');
  res.end({ error: 'Unexpected error occurred', message: err.message, name: err.name, stack: err.stack });
};

app.post('/html', textParser, (req, res, next) => {
  console.info('Processing raw input...');

  res.append('Content-Type', 'application/pdf');
  wkhtmltopdf(req.body, getOptions(req))
    .pipe(res)
    .on('error', err => onError(err, res));
});

app.post('/url', jsonParser, (req, res, next) => {
  console.info(`Processing URL: ${req.body.url}`);

  res.append('Content-Type', 'application/pdf');
  wkhtmltopdf(req.body.url, getOptions(req))
    .pipe(res)
    .on('error', err => onError(err, res));
});

const APP_PORT = 5001;

app.listen(APP_PORT, () => {
  console.info(`Listen started at port ${APP_PORT}`);
  console.info(`Post to http://localhost:${APP_PORT}/html to generate PDF.`);
});
