import { db } from "../Clients/Kysely";
import { UsersTable } from "../Clients/Kysely/types";

/**
 * @method getUserByEmail
 * @description Repository function to get a user by email from the db
 * @param email {string}
 * @returns an entry from the user table 
 */
export async function getUserByEmail(email: string){
    return await db.selectFrom('users').where('email','=',email).selectAll().execute();
}

/**
 * @method insertUser
 * @description Repository function to insert an user to the database
 * @param payload UsersTable
 * @returns the inserted entry of the type UsersTable
 */
export async function insertUser(payload: UsersTable){
    return await db.insertInto('users').values(payload).returningAll().executeTakeFirstOrThrow();
}

/**
 * @method getAmountOwedFromDb
 * @description Repository function to get the owed amount from the database
 * @param payload {UsersTable}
 * @returns a number (owed amount)
 */
export async function getAmountOwedFromDb(payload: UsersTable){
    const totalUnsettledAmount = await db.selectFrom('split').select(({fn}) => [
        fn.sum('amount').as('amount_owed')
    ])
      .where('user_id', '=', payload.id!)
      .where('is_settled', '=', false).executeTakeFirstOrThrow();
    
    return totalUnsettledAmount;
}

/**
 * @method getAmountDueFromDb
 * @description Repository function to get the due amount from the database
 * @param payload {UsersTable}
 * @returns a number (due amount)
 */
export async function getAmountDueFromDb(payload: UsersTable){
    const totalAmountDue = await db.selectFrom('split').select(({fn}) => [
        fn.sum('amount').as('amount_due')
    ]).innerJoin('expense','split.expense_id','expense.id').where('split.is_settled','=',false).where('expense.paid_by','=',payload.id!).executeTakeFirstOrThrow();
    return totalAmountDue;
}


/**
 * @method getAllUsersFromDb
 * @description Repository function to fetch all available users
 * @param payload {UsersTable}
 * @returns a number (due amount)
 */
export async function getAllUsersFromDb() {
    const allUsers = await db.selectFrom('users').select(['email', 'name', 'id', 'phone_number']).execute();
    return allUsers;
}