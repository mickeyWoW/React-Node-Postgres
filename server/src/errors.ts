import { ErrorRequestHandler } from 'express';

export class UnauthorizedError extends Error {
  status = 401;

  constructor(message = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  status = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}

export class ValidationError extends Error {
  status = 422;

  constructor(message = 'Validation failed') {
    super(message);
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(message = 'Not found') {
    super(message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(error.status || 500).send({ error: error.message });
};
