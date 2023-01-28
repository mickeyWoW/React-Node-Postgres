import { Migration } from 'rake-db';

export const change = (db: Migration, up: boolean) => {
  db.changeTable('tasks', (t) => {
    t.boolean('active').default(true);
  });
};
