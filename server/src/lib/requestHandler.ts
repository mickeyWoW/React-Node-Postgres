import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ValidationError, ObjectSchema } from 'yup';
import { User } from 'app/user/user.model';
import { Admin } from 'app/admin/admin.model';
import config from 'config';
import passport from 'passport';
import { UnauthorizedError } from 'errors';

// utility to validate parameters
const genericHandler = <Request>(authorize?: RequestHandler) => <
  /* eslint-disable @typescript-eslint/ban-types */
  Params extends object | undefined,
  Query extends object | undefined,
  Body extends object | undefined
  /* eslint-enable @typescript-eslint/ban-types */
>(
  {
    params,
    query,
    body,
  }: {
    params?: ObjectSchema<Params>;
    query?: ObjectSchema<Query>;
    body?: ObjectSchema<Body>;
  },
  fn: (
    req: Omit<Request, 'query' | 'params' | 'body'> & {
      params: Exclude<Params, undefined>;
      query: Exclude<Query, undefined>;
      body: Exclude<Body, undefined>;
    },
    res: Response,
    next?: NextFunction,
  ) => void,
) => {
  const handler: RequestHandler = async (req, res, next) => {
    try {
      const anyReq = req as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (params) anyReq.params = params.validateSync(req.params);
      if (query) anyReq.query = query.validateSync(req.query);
      if (body) anyReq.body = body.validateSync(req.body);
      await fn(anyReq, res, next);
    } catch (error) {
      if (error instanceof ValidationError)
        res.status(422).json({ error: error.errors.join('; ') });
      else {
        if (!error.status && !config.env.test) console.error(error);

        res
          .status(error.status || 500)
          .json({ error: error.message || 'Something went wrong' });
      }
    }
  };

  if (authorize) {
    const combined: RequestHandler = (req, res, next) =>
      authorize(req, res, (err: string) =>
        err ? next(err) : handler(req, res, next),
      );
    return combined;
  } else {
    return handler;
  }
};

export const publicHandler = genericHandler<
  Omit<Request, 'user'> & { user?: User }
>();

export const requestHandler = genericHandler<
  Omit<Request, 'user'> & { user: User }
>((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user || !(user instanceof User)) {
      next(new UnauthorizedError(err?.message || info));
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
});

export const adminHandler = genericHandler<
  Omit<Request, 'user'> & { admin: Admin }
>((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, admin, info) => {
    if (err || !admin || !(admin instanceof Admin)) {
      next(new UnauthorizedError(err?.message || info));
    } else {
      (req as Request & { admin: Admin }).admin = admin;
      next();
    }
  })(req, res, next);
});
