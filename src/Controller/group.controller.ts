import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { GroupsTable } from "../Clients/Kysely/types";
import { createGroupService, deleteGroupService, getAllGroupsByUserIdService } from "../Services/group.service";
import { authCheck } from "../middleware/auth";

const BASE_ROUTE = '/groups/';

/**
 * @class GroupRoutes
 * @description Route controller for handling routes related to group creation functionality
 */
class GroupRoutes {
  private readonly fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  /**
   * @method createGroup 
   * @description Function to handle create group functionality
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async createGroup(request: FastifyRequest, reply: FastifyReply){
    const {group_name, admin_user_id} = request.body as GroupsTable;
    if(!group_name || !admin_user_id ){
      throw new Error('Group name must be specified!');
    }
    await createGroupService(request.body as GroupsTable);
    reply.send({
      status:200,
      response: 'Created group successfully!'
    } )
  }

  /**
   * @method deleteGroup
   * @description Function to delete a particular group
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async deleteGroup(request: FastifyRequest, reply: FastifyReply){
    const {id} = request.body as GroupsTable;
    await deleteGroupService(id!);
    reply.send({
      status: 200,
      response: 'Successfully deleted group!'
    })
  }

  /**
   * @method getAllGroupsByUserId
   * @description Lists all the groups that the specified user is part of
   * @param request FastifyRequest
   * @param reply FastifyReply
   */
  async getAllGroupsByUserId(request: FastifyRequest, reply: FastifyReply){
    const {id} = request.query as {id: number};
    const allGroups = await getAllGroupsByUserIdService(id);
    return {
      status: 200, 
      groups: allGroups
    }
  }
  
  /**
   * @method createPlugin
   * @desription Factory method for generating the plugin
   * @param _ FastifyPluginOptions (optional)
   */
  static createPlugin(options?: FastifyPluginOptions): FastifyPluginCallback<FastifyPluginOptions> {
    return async (fastify: FastifyInstance, pluginOptions: FastifyPluginOptions) => {
      const groupRoutes = new GroupRoutes(fastify);
      fastify.post(BASE_ROUTE + 'create', {
        schema: {
          description: 'This route handles the creation of a group.',
          tags: ['Group Operation Handlers'],
          summary: 'Create Group',
          params: {
            type: 'object',
            properties: {
              'group_name': {
                type: 'string',
                description: 'Group name'
              },
              'creation_date': {
                type: 'string',
                description: 'Creation date'
              },
              'admin_user_id': {
                type: 'number',
                description: 'Admin user id'
              },
              members: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: "Member ids"
              }
            }
          },
          body: {
            type: 'object',
            properties: {
              'group_name': {
                type: 'string',
                description: 'Group name'
              },
              'creation_date': {
                type: 'string',
                description: 'Creation date'
              },
              'admin_user_id': {
                type: 'number',
                description: 'Admin user id'
              },
              members: {
                type: 'array',
                items: {
                  type: 'number'
                },
                description: "Member ids"
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
      }, groupRoutes.createGroup.bind(groupRoutes));
      fastify.delete(BASE_ROUTE + 'delete', {
        schema: {
          description: 'This route handles the deletion of a group.',
          tags: ['Group Operation Handlers'],
          summary: 'Delete Group',
          params: {
            type: 'object',
            properties: {
              'id': {
                type: 'number',
                description: 'Group id'
              },
            }
          },
          body: {
            type: 'object',
            properties: {
              'id': {
                type: 'number',
                description: 'Group id'
              },
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
          }
        },
        onRequest: authCheck
      }, groupRoutes.deleteGroup.bind(groupRoutes));
      fastify.get(BASE_ROUTE + 'list' + ':id',{
        schema: {
          description: 'This route lists all of the groups that the specified user belongs to.',
          tags: ['Group Operation Handlers'],
          summary: 'List Group By ID',
          response: {
            200: {
              type: 'object',
              description: "Successful Response",
              properties: {
                status:{type: 'number'},
                allGroups: {type: 'array',
                  items: {type: 'object',
                  properties: {
                    id: {type: 'number'},
                    group_name: {type: 'string'},
                    creation_date: {type: 'string'},
                    admin_user_id: {type: 'number'},
                    members: {type: 'array',
                      items: {
                        type: 'number'
                      }
                    }
                  }
                }
                }
              }
            },
          }
        },
        onRequest: authCheck
      } , groupRoutes.getAllGroupsByUserId.bind(groupRoutes))
    };
  }
}

export default GroupRoutes.createPlugin();