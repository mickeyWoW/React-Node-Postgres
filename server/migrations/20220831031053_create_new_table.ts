import { Migration } from 'rake-db'

export const change = (db: Migration, up: boolean) => {
  db.createTable('new_table', (t) => {
    t.timestamps()
  })
}
