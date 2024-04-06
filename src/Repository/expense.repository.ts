import { db } from "../Clients/Kysely"
import { ExpenseTable, SplitTable } from "../Clients/Kysely/types"

/**
 * @method addExpenseToDb
 * @description Adds a new Expense to the database table (Expense)
 * @param expensePayload {ExpenseTable}
 * @returns the inserted entry of ExpenseTable type
 */
export const addExpenseToDb = async (expensePayload: ExpenseTable) => {
    return await db.insertInto('expense').values(expensePayload).returningAll().executeTakeFirstOrThrow();
}

/**
 * @method insertSplitExpenseIntoDb
 * @description Adds an individual split for all of the users who are sharing the expense
 * @param splitPayload {SplitTable[]}
 * @returns array of entries inserted of the type SplitTable
 */
export const insertSplitExpenseIntoDb = async (splitPayload: SplitTable[]) => {
    return await db.insertInto('split').values(splitPayload).returningAll().execute();
}

/**
 * @method getAllExpensesByUserFromDb
 * @description Fetches all expenses of a particular user from the database
 * @param id {number}
 * @returns returns an array of records following a combination of fields from SplitTable and ExpenseTable type
 */
export const getAllExpensesByUserFromDb = async (id: number) => {
    const expenses = await db
    .selectFrom('split')
    .selectAll('split')
    .innerJoin('expense','split.expense_id','expense.id')
    .where('split.user_id','=',id)
    .select(['expense.paid_by','expense.total_amount'])
    .execute()
    return expenses;
}