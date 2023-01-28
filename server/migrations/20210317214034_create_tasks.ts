import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.createTable('tasks', (t) => {
    t.integer('claimedQuantity').required();
    t.integer('completedQuantity').required().default(0);
    t.boolean('completedOnTime');

    t.integer('userId').required().references('users');
    t.integer('workOrderId').required().references('workOrders');
    t.timestamps();
  });
};
