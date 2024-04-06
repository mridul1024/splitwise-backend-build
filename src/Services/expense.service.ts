import { ExpenseTable, SplitTable, UsersTable } from "../Clients/Kysely/types";
import { addExpenseToDb, getAllExpensesByUserFromDb, insertSplitExpenseIntoDb } from "../Repository/expense.repository";

export const createExpenseService = async (expense: ExpenseTable) => {
    const result = await addExpenseToDb(expense);
    return result;
}

export const splitExpenseService = async (payload: ExpenseTable) => {
    const {total_amount, shared_between, id, paid_by } = payload;
    const splitAmount = +total_amount / (shared_between.length + 1);
    const insertionPayload: SplitTable[] = []

    if(!Number.isInteger(splitAmount)){
        insertionPayload.push({
            amount: +(splitAmount + 0.01).toFixed(2),
            expense_id: id!,
            is_settled: true,
            user_id: paid_by,
        })

        shared_between.forEach((memberId) => {
            insertionPayload.push({
                amount: +splitAmount.toFixed(2),
                expense_id: id!,
                is_settled: false,
                user_id: memberId,
            })
        })
    }
    else{
        insertionPayload.push({
            amount: +splitAmount.toFixed(2),
            expense_id: id!,
            is_settled: true,
            user_id: paid_by,
        })

        shared_between.forEach((memberId) => {
            insertionPayload.push({
                amount: +splitAmount.toFixed(2),
                expense_id: id!,
                is_settled: false,
                user_id: memberId,
            })
        })
    }
    const insertedRecords = await insertSplitExpenseIntoDb(insertionPayload);
    return insertedRecords;
}


export const getAllExpensesService = async  (payload: UsersTable) => {
    const { id } = payload;
    const expenses = await getAllExpensesByUserFromDb(id!);
    return expenses;
}