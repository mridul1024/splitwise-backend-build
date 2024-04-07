# Splitwise Clone (Backend)

Application similar to 'Splitwise' for managing expenses.
## Run Locally

To run this project use

```bash
  npm i && npm run dev
```

In order to execute test cases use
```bash
  npm run test -- --coverage --watchAll
```

The application is deployed using `render` and it can be accessed through the following link:

[Deployed backend application](https://splitwise-backend-build.onrender.com)

## Documentation
The documentation can be accessed through the following link:

[Swagger Documentation](https://splitwise-backend-build.onrender.com/api/docs)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

`DEV ENVIRONMENT`

```
DATABASE_NAME='splitwise_db'
DATABASE_HOST='localhost'
DATABASE_USER='postgres'
DATABASE_PASSWORD='root'
DATABASE_PORT=5432
SERVER_PORT=3000
SERVER_HOST=localhost
JWT_SECRET='cbkzgrhy=kechd[qw/)e?b/mgw-u^|{i'
```


## Tech Stack

`Node` | `Fastify` | `Postgres` | `Kysely` | `Typescript`