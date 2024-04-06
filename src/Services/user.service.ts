import { FastifyInstance } from "fastify"
import { getAmountDueFromDb, getAmountOwedFromDb, getUserByEmail, insertUser } from "../Repository/user.repository"
import { UsersTable } from "../Clients/Kysely/types"
import { EXPIRY_TIME } from "./types"

export const signJWTPayload = <T extends {}>(fastify: FastifyInstance, payload: T, expTime: EXPIRY_TIME = '1h') => {
    return fastify.jwt.sign(payload, {
        expiresIn: expTime
    })
}

export const verifyIfUserExists = async (email: string) => {
    const result = await getUserByEmail(email);
    return result.length > 0 ? true : false;
}

export const addNewUserToDb = async (payload: UsersTable) => {
    const {email} = payload;

    const exists = await verifyIfUserExists(email); 

    if(exists){
        throw {
            status: 409,
            response: 'User already exists!'
        };  
    }
    await insertUser(payload);
    
    return {
        status: 201, 
        response: 'User successfully added!'
    };
} 


export const generateHash = async (fastify: FastifyInstance, payload: string) => {
    const hash = await fastify.bcrypt.hash(payload); 
    return hash;
}

export const getUserService = async (email: string) => {
    const user = await getUserByEmail(email);
    return user[0]
}

export const getAmountOwedService = async (userData: UsersTable) => {
    const amountDue = await getAmountOwedFromDb(userData);
    return amountDue;
}

export const getAmountDueService = async (userData: UsersTable) => {
    const amountDue = await getAmountDueFromDb(userData);
    return amountDue;
}

export const compareHashedPassword = async (fastify: FastifyInstance, password: string, hashedPassword: string) => {
    const isMatched = await fastify.bcrypt.compare(password, hashedPassword);
    return isMatched;
}