import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.createTable('workOrders', (t) => {
    t.integer('podId').required().references('pods');
    t.string('name').required();
    t.string('productSku').required();
    t.integer('timeEstimateMin').required();
    t.integer('timeEstimateMax').required();
    t.integer('minTaskQuantity').required();
    t.integer('maxTaskQuantity').required();
    t.date('endDate').required();
    t.string('status').required();
    t.integer('paymentTerms').required();
    t.string('paymentStatus').required();
    t.integer('totalQuantity').required();
    t.integer('completedQuantity').required();
    t.string('instructionsPdfLink').required();
    t.string('instructionsVideoLink').required();
    t.string('postSignupInstructions').required();
    t.timestamps();
  });
};
