import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { UsersTable } from "../Clients/Kysely/types";
import { addNewUserToDb, compareHashedPassword, generateHash, getAmountDueService, getAmountOwedService, getUserService, signJWTPayload } from "../Services/user.service";
import { authCheck } from "../middleware/auth";

const BASE_ROUTE = '/user/';

class UserRoutes {
  private readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * @method userSignUp
   * @description Handler for handling sign up procedure
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async userSignUp(request: FastifyRequest, reply: FastifyReply) {
    if(!request.body){
      throw new Error('No user data provided!')
    }
    const userData = request.body as UsersTable;
    if(!userData.email || !userData.password){
      throw new Error('Email and Password are required fields!')
    }
    const passwordHash = await generateHash(this.fastify, userData.password);
    const serviceResponse = await addNewUserToDb({...userData, password: passwordHash}); 
    reply.send(serviceResponse);
  }

  /**
   * @method userLogin
   * @description Function for handling user login and generating a JWT token for performing different operations
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async userLogin(request: FastifyRequest, reply: FastifyReply) {
    const {email, password} = request.body as UsersTable;
    const user = await getUserService(email) as UsersTable;
    if(!user){
      reply.send({
        status: 404,
        response: 'User not found!'
      })
    }
    const isMatched = await compareHashedPassword(this.fastify, password, user.password);
    if(isMatched){
      const {id, password, phone_number, ...userData} = user;
      const token = signJWTPayload<Omit<UsersTable, 'id'|'password'|'phone_number'>>(this.fastify, userData, '1h');
      reply.send({
        status: 200, 
        authenticated: true,
        token
      })
    }
    reply.send({
      status: 401,
      authenticated: false,
      response: 'Unauthorized'
    })
  }

  /**
   * @method getUserDetails
   * @description Function to fetch user details along with their total available amount, the due and owed amounts
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async getUserDetails(request: FastifyRequest, reply: FastifyReply){
    const { email } = request?.query as {email: string};
    if(!email){
      throw new Error('No email specified!');
    }
    const userDetails = await getUserService(email);
    if(!userDetails){
      throw new Error('No user found!')
    }
    const { amount_owed } = await getAmountOwedService(userDetails);
    const { amount_due } = await getAmountDueService(userDetails);
    const total_amount = Number(amount_due) - Number(amount_owed);
    reply.send({
      status: 200,
      data: {
        user: {
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
        },
        amountOwed: Number(amount_owed),
        amountDue: Number(amount_due),
        totalAmount: total_amount
      }
    })
  }

    /**
   * @method createPlugin
   * @desription Factory method for generating the plugin
   * @param _ FastifyPluginOptions (optional)
   */
  static createPlugin(options?: FastifyPluginOptions): FastifyPluginCallback<FastifyPluginOptions> {
    return async (fastify: FastifyInstance, pluginOptions: FastifyPluginOptions) => {
      const userRoutes = new UserRoutes(fastify);
      fastify.post(BASE_ROUTE + 'signup',{
        schema: {
          description: 'This route handles the user sign up procedure.',
          tags: ['User Operation Handlers'],
          summary: 'User Sign Up',
          params: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'user email'
              },
              name: {
                type: 'string',
                description: 'user name'
              },
              phone_number: {
                type: 'string',
                description: 'user phone number'
              },
              password: {
                type: 'string',
                description: 'user password'
              }
            }
          },
          body: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'user email'
              },
              name: {
                type: 'string',
                description: 'user name'
              },
              phone_number: {
                type: 'string',
                description: 'user phone number'
              },
              password: {
                type: 'string',
                description: 'user password'
              }
            }
          },
          response: {
            409: {
              description: 'Failure Response',
              type: 'object',
              properties: {
                status: {
                  type: 'number'
                },
                response: {
                  type: 'string'
                }
              }
            },
            200: {
              description: 'Successful Response',
              type: 'object',
              properties: {
                status: {
                  type: 'number'
                },
                response: {
                  type: 'string'
                }
              }
            },
            500: {
              description: 'Failure Response',
              type: 'object',
              properties: {
                status: {
                  type: 'number'
                },
                response: {
                  type: 'string'
                }
              }
            }
          }
        }
      }, userRoutes.userSignUp.bind(userRoutes));
      fastify.post(BASE_ROUTE + 'login',{
        schema: {
          description: 'This route handles the user login procedure .',
          tags: ['User Operation Handlers'],
          summary: 'User Login',
          params: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'user email'
              },
              password: {
                type: 'string',
                description: 'user password'
              }
            }
          },
          body: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'user email'
              },
              password: {
                type: 'string',
                description: 'user password'
              }
            }
          },
          response: {
            401: {
              description: 'Failure Response (Unauthorized)',
              type: 'object',
              properties: {
                status: {
                  type: 'number'
                },
                authenticated: {
                  type: 'boolean'
                },
                response: {
                  type: 'string'
                }
              }
            },
            200: {
              description: 'Successful Response',
              type: 'object',
              properties: {
                status: {
                  type: 'number'
                },
                authenticated: {
                  type: 'boolean'
                },
                token: {
                  type: 'string'
                }
              }
            },
          }
        }
      }, userRoutes.userLogin.bind(userRoutes))
      fastify.get(BASE_ROUTE + 'info' +':email', {
        schema: {
          description: 'This route handles fetches the user information.',
          tags: ['User Operation Handlers'],
          summary: 'Get User Info',
          response: {
            200: {
              type: 'object',
              properties: {
                status: {type: 'number'},
                data: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'number'
                        },
                        name: {
                          type: 'string'
                        },
                        email: {
                          type: 'string'
                        }
                      }
                    },
                    amountOwed: {
                      type: 'number'
                    },
                    amountDue: {type: 'number'},
                    totalAmount: {type: 'number'}
                  },
                }
              }
            }
          }
        },
        onRequest: authCheck
      }, userRoutes.getUserDetails.bind(userRoutes));
    };
  }
}

export default UserRoutes.createPlugin();