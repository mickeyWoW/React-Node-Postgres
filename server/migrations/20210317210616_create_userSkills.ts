import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.createTable('userSkills', (t) => {
    t.integer('skillId').required().references('skills');
    t.integer('userId').required().references('users');
    t.timestamps();
  });
};
