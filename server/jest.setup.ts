import 'dotenv/config';
import {
  patchPgClient,
  startTransaction,
  rollbackTransaction,
  closePg,
} from 'tests/utils/patchPg';
import typeormConnection from 'lib/typeormConnection';
import { sentEmailsForTests } from 'lib/mailer';

patchPgClient();

beforeAll(async () => {
  await typeormConnection;
});

beforeEach(async () => {
  sentEmailsForTests.length = 0; // clear emails
  await startTransaction();
});

afterEach(async () => {
  await rollbackTransaction();
});

afterAll(async () => {
  const connection = await typeormConnection;
  await connection.close();
  await closePg();
});
