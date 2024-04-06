import { Database } from './types' 
import {Pool} from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'splitwise_db',
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    port: 5432,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})