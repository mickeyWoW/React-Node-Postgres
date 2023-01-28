import { Migration } from 'rake-db';

export const change = async (db: Migration, up: boolean) => {
  await db.createTable('pods', (t) => {
    t.string('name').required();
    t.timestamps();
  });

  if (up) {
    await db.exec(`INSERT INTO pods (name) VALUES ('test1'), ('test2')`);
  }
};
