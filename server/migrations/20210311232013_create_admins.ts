import { Migration } from 'rake-db';
import * as bcrypt from 'bcrypt';

export const change = async (db: Migration, up: boolean) => {
  db.createTable('admins', (t) => {
    t.string('email', { index: true }).required();
    t.string('password').required();
    t.timestamps();
  });

  if (up) {
    const salt = await bcrypt.genSalt(10);
    const email = 'admin@example.com';
    const password = await bcrypt.hash('test1234', salt);
    await db.exec(
      `INSERT INTO admins (email, password) VALUES('${email}', '${password}')`,
    );
  }
};
