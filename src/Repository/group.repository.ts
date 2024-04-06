import { db } from "../Clients/Kysely";
import { GroupsTable } from "../Clients/Kysely/types";

/**
 * @method addGroupToDb
 * @description Repository function which handles the insertion of a new group into the database
 * @param payload {GroupsTable}
 * @returns the entry which was inserted of type GroupsTable
 */
export const addGroupToDb = async (payload: GroupsTable) => {
    return await db.insertInto('groups').values(payload).returningAll().executeTakeFirstOrThrow();
}

/**
 * @method deleteGroupFromDb
 * @description Repository function to delete a group from the database based on its id
 * @param groupId {number}
 * @returns the deleted entry of GroupsTable type
 */
export const deleteGroupFromDb = async (groupId: number) => {
    return await db.deleteFrom('groups').where('id','=',groupId).returningAll().executeTakeFirstOrThrow();
}