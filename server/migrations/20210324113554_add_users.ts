import { Migration } from 'rake-db';

export const change = (db: Migration, up: boolean) => {
  db.changeTable('users', (t) => {
    t.string('resetShortToken');
    t.date('resetExpires');
  });
};
