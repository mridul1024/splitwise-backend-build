import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ExpenseTable} from "../Clients/Kysely/types";
import { createExpenseService, getAllExpensesService, splitExpenseService } from "../Services/expense.service";
import { getUserByEmail } from "../Repository/user.repository";
import { authCheck } from "../middleware/auth";

const BASE_ROUTE = '/expense/';

/**
 * @class Expense Route Extension Class
 * @description Contains all the the route handlers for handling expenses
 */
class ExpenseRoutes {
  private readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * @method addExpense
   * @description Controller for handling the routing ops of 'add expense' functionality
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async addExpense(request: FastifyRequest, reply: FastifyReply){
    const {description, total_amount, paid_by} = request.body as ExpenseTable;
    if(!description || !paid_by || !total_amount){
        reply.send({
            status: 500,
            response: 'Description, payer and total amount must be specified!'
        })
    }
    const expense = await createExpenseService(request.body as ExpenseTable);
    await splitExpenseService(expense);
    reply.send({
        status:200,
        response: 'Expense has been created successfully!'
    })
  }

  /**
   * @method getExpensesByUser
   * @description Controller which returns the expenses by a user
   * @param request FastifyRequest
   * @param reply FastifyReply
   * @returns 
   */
  async getExpensesByUser(request: FastifyRequest, reply: FastifyReply){
    const {email} = request.query as {email: string};
    const userData = await getUserByEmail(email);
    const expenses = await getAllExpensesService(userData[0]);
    return expenses;
  }

  /**
   * @method createPlugin
   * @desription Factory method for generating the plugin
   * @param _ FastifyPluginOptions (optional)
   */
  static createPlugin(_?: FastifyPluginOptions): FastifyPluginCallback<FastifyPluginOptions> {
    return async (fastify: FastifyInstance, pluginOptions: FastifyPluginOptions) => {
      const expenseRoutes = new ExpenseRoutes(fastify);
      fastify.post(BASE_ROUTE + 'add', {
        schema: {
          description: 'This route handles the insertion of a group expense.',
          tags: ['Expense Operation Handlers'],
          summary: 'Add Expense',
          params: {
            type: 'object',
            properties: {
              'creation_date': {
                type: 'string',
                description: 'Expense creation date',
              },
              'paid_by': {
                type: 'number',
                description: 'The person who paid the expense'
              },
              'is_borrowed': {
                type: 'boolean',
                description: 'Borrowed / Lent'
              },
              'total_amount': {
                type: 'number',
                description: 'Total amount which is paid out.'
              },
              'shared_between': {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'The group of people who are sharing the expense.'
              }
            }
          },
          body: {
            type: 'object',
            properties: {
              'creation_date': {
                type: 'string',
                description: 'Expense creation date',
              },
              'paid_by': {
                type: 'number',
                description: 'The person who paid the expense'
              },
              'is_borrowed': {
                type: 'boolean',
                description: 'Borrowed / Lent'
              },
              'total_amount': {
                type: 'number',
                description: 'Total amount which is paid out.'
              },
              'shared_between': {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: 'The group of people who are sharing the expense.'
              }
            }
          },
          response: {
            200: {
              type: 'object',
              description: "Successful Response",
              properties: {
                status:{type: 'number'},
                response: {type: 'string'}
              }
            },
            500: {
              type: 'object',
              description: "Failure Response",
              properties: {
                status:{type: 'number'},
                response: {type: 'string'}
              }
            }
          }
        },
        onRequest: authCheck
      }, expenseRoutes.addExpense.bind(expenseRoutes));
      fastify.get(BASE_ROUTE + 'byUser' + ':email',{
        schema: {
          description: 'This route fetches the expenses for a particular user.',
          tags: ['Expense Operation Handlers'],
          summary: 'Get Expense',
          response: {
            200: {
              type: 'array',
              description: "Successful Response",
              items: {
                type: 'object',
                properties: {
                  id: {type: 'number'},
                  expense_id: {type: 'number'},
                  user_id: {type: 'number'},
                  amount: {type: 'number'},
                  is_settled: {type: 'boolean'},
                  total_amount: {type: 'number'},
                  paid_by: {type: 'number'}
                }
              }
            },
            500: {
              type: 'object',
              description: "Failure Response",
              properties: {
                status:{type: 'number'},
                response: {type: 'string'}
              }
            }
          }
        },
        onRequest: authCheck
      }, expenseRoutes.getExpensesByUser.bind(expenseRoutes));
    };
  }
}

export default ExpenseRoutes.createPlugin();