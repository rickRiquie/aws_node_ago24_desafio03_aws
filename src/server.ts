import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import AppDataSource from './db/data-source';
import { errors } from 'celebrate';
import AppError from './shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import routes from './shared/routes/routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/', routes);

app.use(errors());

app.use(
  (error: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });

    return next(error);
  },
);

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });
