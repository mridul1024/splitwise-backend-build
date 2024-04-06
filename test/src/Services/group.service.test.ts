import * as RepositoryMock from '../../../src/Repository/group.repository';
import { createGroupService, deleteGroupService } from '../../../src/Services/group.service';

describe('Group service tests -> ', () => {
    test('should create a group', () => {
        jest.spyOn(RepositoryMock, 'addGroupToDb').mockResolvedValue({} as any);
        const result = createGroupService({} as any);
        expect(result).toBeTruthy();
    })

    test('should delete a group', () => {
        jest.spyOn(RepositoryMock, 'deleteGroupFromDb').mockResolvedValue({} as any);
        const result = deleteGroupService({} as any);
        expect(result).toBeTruthy();
    })
})