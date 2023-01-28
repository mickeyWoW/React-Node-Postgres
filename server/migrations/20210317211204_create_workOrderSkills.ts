import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.createTable('workOrderSkills', (t) => {
    t.integer('skillId').required().references('skills');
    t.integer('workOrderId').required().references('workOrders');
    t.timestamps();
  });
};
