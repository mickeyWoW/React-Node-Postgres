import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import 'dotenv/config';
import 'lib/typeormConnection';
import routes from 'routes';
import { resolve } from 'path';
import { types } from 'pg';

// parse numeric columns
types.setTypeParser(1700, (v) => parseFloat(v));

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for parsing multipart/form-data
const upload = multer();
app.use(upload.none());

app.use('/', routes);

if (process.env.HEROKU) {
  app.use(express.static(resolve(__dirname, '..', '..', '..', 'client/build')));

  const frontendFile = resolve(
    __dirname,
    '..',
    '..',
    '..',
    'client/build/index.html',
  );
  app.get('*', (req, res) => {
    res.sendFile(frontendFile);
  });
}

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

export default app;
