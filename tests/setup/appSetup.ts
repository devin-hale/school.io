import indexRouter from '../../routes/indexRouter.js';
import orgRouter from '../../routes/orgRouter.js';
import userRouter from '../../routes/userRouter.js';
import classRouter from '../../routes/classRouter.js';
import studentRouter from '../../routes/studentRouter.js';

import docRouter from '../../routes/docRouters/docRouter.js';
import comRouter from '../../routes/docRouters/comRouter.js';

import express, { Express, response } from 'express';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.options('*', cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', indexRouter);
app.use('/organizations', orgRouter);
app.use('/users', userRouter);
app.use('/classes', classRouter);
app.use('/students', studentRouter);
app.use('/docs', docRouter);

app.use((req: any, res: any, next: any, err: any): void => {
	res.status(500).send({ error: err });
});

export default app;
