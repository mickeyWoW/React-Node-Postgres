import pgPromise from 'pg-promise';
import typeorm from 'lib/typeormConnection';

const pgp = pgPromise({
  capSQL: true,
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const create = async <T extends object | object[]>(
  table: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  record: object,
  {
    onConflict,
  }: {
    onConflict?: string;
  } = {},
): Promise<T> => {
  const db = await typeorm;
  const rows = await db.query(
    `${pgp.helpers.insert(
      record,
      Object.keys(Array.isArray(record) ? record[0] : record),
      table,
    )}${onConflict ? ` ON CONFLICT ${onConflict}` : ''} RETURNING *`,
  );

  return Array.isArray(record) ? rows : rows[0];
};
