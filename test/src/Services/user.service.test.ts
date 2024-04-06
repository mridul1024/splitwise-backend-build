import * as UserRepositoryMock from "../../../src/Repository/user.repository";
import {
  verifyIfUserExists,
  addNewUserToDb, getUserService, compareHashedPassword
} from "../../../src/Services/user.service";
import * as UserServiceMock from "../../../src/Services/user.service";

const mockBcrypt = {
    compare: jest.fn(), 
  };

describe("User service tests -> ", () => {
  test("should verify if the user exists", async () => {
    jest.spyOn(UserRepositoryMock, "getUserByEmail").mockResolvedValue([
      {
        name: "user1",
      },
    ] as any);
    const result = await verifyIfUserExists("email@gmail.com");
    expect(result).toBeTruthy();
  });

  test("should return a false response while adding user if the user already exists", async () => {
    try {
      jest.spyOn(UserServiceMock, "verifyIfUserExists").mockResolvedValue(true);
      const result = await addNewUserToDb({} as any);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  test("should successfully add user", async () => {
    jest.spyOn(UserServiceMock, "verifyIfUserExists").mockResolvedValue(false);
    jest.spyOn(UserRepositoryMock, "insertUser").mockResolvedValue({
      name: "new user",
    } as any);
    const result = await addNewUserToDb({} as any);
    expect(result).toStrictEqual({
      status: 201,
      response: "User successfully added!",
    });
  });

  test('should return a user', async () => {
    jest.spyOn(UserRepositoryMock, 'getUserByEmail').mockResolvedValue([{name: 'random user'}] as any);
    const result = await getUserService('random@gmail.com');
    expect(result).toBeTruthy()
  })

  it('should compare hashed password and return true on match', async () => {
    const mockPassword = 'plainPassword';
    const mockHashedPassword = '$2y$10$...hashedPassword...'; 
    const mockIsMatched = true;

    mockBcrypt.compare.mockResolvedValueOnce(mockIsMatched);

    const fastify: any = { bcrypt: mockBcrypt }; 

    const isMatched = await compareHashedPassword(fastify, mockPassword, mockHashedPassword);

    expect(mockBcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
    expect(isMatched).toEqual(true);
  });

  it('should compare hashed password and return false on mismatch', async () => {
    const mockPassword = 'wrongPassword';
    const mockHashedPassword = '$2y$10$...hashedPassword...'; 
    const mockIsMatched = false;

    mockBcrypt.compare.mockResolvedValueOnce(mockIsMatched);

    const fastify: any = { bcrypt: mockBcrypt }; 

    const isMatched = await compareHashedPassword(fastify, mockPassword, mockHashedPassword);

    expect(mockBcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
    expect(isMatched).toEqual(false);
  });

  it('should throw error on bcrypt comparison error', async () => {
    const mockPassword = 'plainPassword';
    const mockHashedPassword = '$2y$10$...hashedPassword...'; 
    const mockError = new Error('bcrypt error');

    mockBcrypt.compare.mockRejectedValueOnce(mockError);

    const fastify: any = { bcrypt: mockBcrypt }; 

    await expect(compareHashedPassword(fastify, mockPassword, mockHashedPassword)).rejects.toThrow(mockError);

    expect(mockBcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
  });
});