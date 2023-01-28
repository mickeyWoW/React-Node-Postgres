/* eslint-disable */
import { Client, Pool, PoolClient, QueryConfig, QueryResult } from 'pg';
import config from 'config';

let savePoints: string[] | undefined;
let connection: any;
let poolConnection: any;

export const patchPgClient = () => {
  const { connect, query } = Client.prototype as any;

  Client.prototype.connect = async function (callback?: (err: Error) => void) {
    if (connection) {
      if (callback) callback(undefined as unknown as Error);
      return connection
    }

    connection = await connect.call(this);
    if (callback) callback(undefined as unknown as Error);
    return connection;
  };

  const poolConnect: any = Pool.prototype.connect;
  Pool.prototype.connect = async function (callback?: (err: Error, client: PoolClient, done: (release?: any) => void) => void) {
    if (!poolConnection) {
      poolConnection = await poolConnect.call(this);
      poolConnection.release = () => {};
    }

    if (callback) callback(undefined as unknown as Error, poolConnection, () => {});
    return poolConnection;
  };

  type Input = QueryConfig | string
  type Params = any[] | Callback
  type Callback = (err: Error, result: QueryResult) => void
  Client.prototype.query = async function (input: Input, params?: Params, callback?: Callback) {
    if (typeof input !== "string")
      throw new Error('Only string first argument is supported by pg.query')

    if (typeof params === 'function') {
      callback = params
      params = undefined
    }

    let sql = input.trim();

    if (sql.startsWith('START TRANSACTION') || sql.startsWith('BEGIN')) {
      if (savePoints) {
        const savePoint = Math.random().toString(36).substring(2, 15);
        savePoints.push(savePoint);
        sql = `SAVEPOINT "${savePoint}"`;
      } else {
        savePoints = [];
      }
    } else {
      const isCommit = sql.startsWith('COMMIT');
      const isRollback = !isCommit && sql.startsWith('ROLLBACK');
      if (isCommit || isRollback) {
        if (!savePoints) {
          throw new Error(
            `Trying to ${
              isCommit ? 'COMMIT' : 'ROLLBACK'
            } outside of transaction`,
          );
        } else {
          if (savePoints.length) {
            const savePoint = savePoints.pop();
            sql = `${
              isCommit ? 'RELEASE' : 'ROLLBACK TO'
            } SAVEPOINT "${savePoint}"`;
          } else {
            savePoints = undefined;
          }
        }
      }
    }

    try {
      const result = await query.call(this, sql, params);
      if (callback) callback(undefined as unknown as Error, result)
      return result
    } catch (error) {
      if (callback) callback(error, undefined as unknown as QueryResult)
      else throw error
    }
  };
};

export const startTransaction = async (
  db = new Pool({ connectionString: config.databaseUrl }),
) => {
  await rollbackTransaction(db);
  await db.query('BEGIN');
};

export const rollbackTransaction = async (
  db = new Pool({ connectionString: config.databaseUrl }),
) => {
  while (savePoints) await db.query('ROLLBACK');
};

export const closePg = () => {
  poolConnection?.end();
  connection?.end();
};
