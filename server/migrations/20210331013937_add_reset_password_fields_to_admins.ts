import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.changeTable('admins', (t) => {
    t.string('resetPasswordToken', { index: true });
    t.timestamp('resetPasswordExpiresAt');
  });
};
