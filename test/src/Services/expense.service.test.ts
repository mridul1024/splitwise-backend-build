import * as RepositoryMock from "../../../src/Repository/expense.repository";
import { createExpenseService, getAllExpensesService, splitExpenseService } from "../../../src/Services/expense.service";

describe("Expense service test -> ", () => {
  test("should create expense service", async () => {
    jest.spyOn(RepositoryMock, "addExpenseToDb").mockResolvedValue({
      id: 1,
      creation_date: new Date('2024-04-05T17:44:31.872Z'),
      description: "Random description",
      paid_by: 4,
      is_borrowed: false,
      total_amount: 1000,
      shared_between: [2, 3],
    });

    const result = await createExpenseService({
      id: 1,
      creation_date: new Date('2024-04-05T17:44:31.872Z'),
      description: "Random description",
      paid_by: 4,
      is_borrowed: false,
      total_amount: 1000,
      shared_between: [2, 3],
    });
    expect(result).toStrictEqual({
      id: 1,
      creation_date: new Date('2024-04-05T17:44:31.872Z'),
      description: "Random description",
      paid_by: 4,
      is_borrowed: false,
      total_amount: 1000,
      shared_between: [2, 3],
    });
  });

  test("should get all expenses for a user", async () => {
    jest.spyOn(RepositoryMock,'getAllExpensesByUserFromDb').mockResolvedValue({} as any);
    const result = await getAllExpensesService({
        result: 1
    } as any);
    expect(result).toBeTruthy();
  })

  test('should generate splits for a given expense', async () => {
    jest.spyOn(RepositoryMock, 'insertSplitExpenseIntoDb').mockResolvedValue({} as any);
    const mockPayload = {
        total_amount: 1000,
        shared_between: [3,4,5],
        id: 3, 
        paid_by: 6,
        description: 'random expense', 
        is_borrowed: false
    }
    const result = await splitExpenseService(mockPayload);
    expect(result).toBeTruthy();
  })
});