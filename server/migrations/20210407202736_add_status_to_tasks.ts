import { Migration } from 'rake-db';

export const change = (db: Migration, up: boolean) => {
  db.addColumn('tasks', 'status', 'text', { default: "'Active'" });

  db.exec(`UPDATE tasks SET status = 'In Review' WHERE active = false`);

  db.dropColumn('tasks', 'active', 'boolean');
};
