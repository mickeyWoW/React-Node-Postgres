import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.renameColumn('users', 'resetShortToken', 'resetPasswordToken');

  db.changeTable('users', (t) => {
    t.drop('resetExpires', 'date');
    t.timestamp('resetPasswordExpiresAt');
  });
};
