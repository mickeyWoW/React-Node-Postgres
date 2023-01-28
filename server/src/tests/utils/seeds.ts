import 'dotenv/config';
import typeorm from 'lib/typeormConnection';
import { podFactory, pod1, pod2 } from 'tests/factories/pod.factory';
import { skillFactory, skill1, skill2 } from 'tests/factories/skills.factory';
import { userFactory, currentUser } from 'tests/factories/user.factory';
import {
  workOrderFactory,
  workOrder1,
  workOrder2,
  workOrder3,
} from 'tests/factories/work-order.factory';

const main = async () => {
  const db = await typeorm;

  await db.query('TRUNCATE TABLE "pods" CASCADE');
  await podFactory.create(pod1);
  await podFactory.create(pod2);

  await db.query('TRUNCATE TABLE "skills" CASCADE');
  await skillFactory.create(skill1);
  await skillFactory.create(skill2);

  await db.query('TRUNCATE TABLE "workOrders" CASCADE');
  await workOrderFactory.create(workOrder1);
  await workOrderFactory.create(workOrder2);
  await workOrderFactory.create(workOrder3);

  await db.query('TRUNCATE TABLE "users" CASCADE');
  await userFactory.create(currentUser);

  await db.close();
};

main();
