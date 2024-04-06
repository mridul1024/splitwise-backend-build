import { FastifyPluginCallback } from "fastify";
import { ApplicationServer } from "./Server";
import swaggerPlugin from "./Plugins/swagger.plugin";
import userRoutesPlugin from './Controller/user.controller';
import groupRoutesPlugin from './Controller/group.controller';
import expenseRoutesPlugin from './Controller/expense.controller';
import jwtPlugin from "./Plugins/jwt.plugin";
import bcryptPlugin from "./Plugins/bcrypt.plugin";

/**
 * Route extension plugins
 */
const controllerPlugins: FastifyPluginCallback[] = [
    userRoutesPlugin,
    groupRoutesPlugin,
    expenseRoutesPlugin
]

/**
 * Secondary plugins
 */
const secondaryPlugins: FastifyPluginCallback[] = [
    bcryptPlugin, 
    jwtPlugin, 
    swaggerPlugin
]

/**
 * Server object initialization and startup
 */
const server = new ApplicationServer();
server.registerPlugins([...secondaryPlugins,...controllerPlugins]);
server.serve();