  
  export interface Database {
    users: UsersTable
    groups: GroupsTable
    expense: ExpenseTable
    split: SplitTable
  }


  export interface UsersTable {
    id?: number;
    email: string;
    name: string;
    phone_number: string;
    password: string; 
  }

  export interface GroupsTable {
    id?: number; 
    group_name: string; 
    creation_date?: string; 
    admin_user_id: number;
    members: number[];
  }

  export interface ExpenseTable {
    id?: number;
    creation_date?: Date;
    description: string;
    paid_by: number;
    is_borrowed: boolean;
    total_amount: number;
    shared_between: number[];
  }

  export interface SplitTable {
    id?: number;
    expense_id: number;
    user_id: number;
    amount: number;
    is_settled: boolean;
  }
  

