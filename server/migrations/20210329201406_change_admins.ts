import { Migration } from 'rake-db';

export const change = (db: Migration, up: boolean) => {
  db.changeTable('admins', (t) => {
    t.string('firstName');
    t.string('lastName');
    t.boolean('isActive').required().default(false);
  });

  if (up) {
    db.dropIndex('admins', 'email');
    db.addIndex('admins', 'email', {
      unique: true,
    });
  }
};
