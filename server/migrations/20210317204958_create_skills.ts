import { Migration } from 'rake-db';

export const change = async (db: Migration, up: boolean) => {
  db.createTable('skills', (t) => {
    t.string('name').required();
    t.timestamps();
  });

  if (up) {
    await db.exec(`INSERT INTO skills (name) VALUES ('skill1'), ('skill2')`);
  }
};
