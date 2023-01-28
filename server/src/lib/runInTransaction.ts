import { getConnection, QueryRunner } from 'typeorm';

export const runInTransaction = async (
  callback: (queryRunner: QueryRunner) => Promise<void>,
) => {
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await callback(queryRunner);
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
