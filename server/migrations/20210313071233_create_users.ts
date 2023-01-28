import { Migration } from 'rake-db';

export const change = (db: Migration) => {
  db.createTable('users', (t) => {
    t.string('firstName').required();
    t.string('lastName').required();
    t.string('email', { unique: true }).required();
    t.string('password').required();
    t.boolean('isActive').required().default(true);
    t.string('address1').required();
    t.string('address2');
    t.string('city').required();
    t.string('state').required();
    t.string('zip').required();
    t.string('phone').required();
    t.integer('podId').required().references('pods');
    t.boolean('adminVerified').required().default(false);
    t.timestamps();
  });
};
