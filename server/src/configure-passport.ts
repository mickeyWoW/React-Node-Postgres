import passport from 'passport';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as userService from 'app/user/user.service';
import * as adminService from 'app/admin/admin.service';
import config from 'config';
import { UnauthorizedError, ValidationError } from 'errors';
import { User } from 'app/user/user.model';
import { getRepository } from 'typeorm';
import { Admin } from 'app/admin/admin.model';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new JwtStrategy(
    options,
    async ({ id, type }: { id: number; type: 'user' | 'admin' }, done: any) => {
      let error;
      try {
        if (type === 'user') {
          const user = await userService.getUserById(id);
          const repo = getRepository(User);
          return done(undefined, repo.create(user));
        } else if (type === 'admin') {
          const admin = await adminService.getById(id);
          if (admin.isActive) {
            const repo = getRepository(Admin);
            return done(undefined, repo.create(admin));
          } else {
            error = new UnauthorizedError('Admin is not active');
          }
        }
      } catch (err) {
        error = new UnauthorizedError();
      }
      return done(error, false);
    },
  ),
);
