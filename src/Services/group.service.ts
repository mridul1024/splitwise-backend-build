import { GroupsTable } from "../Clients/Kysely/types"
import { addGroupToDb, deleteGroupFromDb } from "../Repository/group.repository";

export const createGroupService = async (payload: GroupsTable) => {
    const result = await addGroupToDb(payload);
    return result;
}


export const deleteGroupService = async (groupId: number) => {
    const result = await deleteGroupFromDb(groupId)
    return result;
}