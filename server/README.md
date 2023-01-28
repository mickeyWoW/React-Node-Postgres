# Paskho Backend API

This project uses express, [typeorm](https://typeorm.io/) to work with database, [rake-db](https://www.npmjs.com/package/rake-db) for migrations and [yup](https://github.com/jquense/yup) for parameters validation.

## Deployment Instructions:

1. Run `npm install`

2. Set `DATABASE_URL` in `.env`

3. Change `JWT_SECRET` in `.env` to any random string

4. Run `npm run db create`

5. `npm start` starts API in dev environment. Use `npm run start:prod` to start in production mode

To make changes to DB, run `npm run db g create_new_table` to generate a new migration and run `npm run db migrate` to apply it.

## Tests

Set DATABASE_URL_TEST and DATABASES env variables to .env as shown in .env.example

```
npm run db create # to create test database
npm run db migrate # to migrate it
npm run db:seeds # seed data for test
```

Run tests:
```
npm test # run all tests
npm test -- --watch # run in watch mode
npm test src/tests/task.test.ts -- --watch # run specific file
```

To run only one test add `.only` to `it` in the test:
```js
it.only('should do something', () => { ... })
```

## Code Structure

1. Create new folder ([for reference](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)) for the required addition.
2. Add routes to `src/routes.ts`.
3. Files:
    - `controller.ts` for validation of parameters and sending response.
    - `service.ts` for business logic.
    - `middleware.ts` for express routing.
    - `model.ts` for typeorm models.

## Custom request handler function:

Every method in controller is wrapped with `requestHandler`.
`requestHandler` sets `user` type on request object:
```js
req.user // User type
```
There is the same `publicHandler` where `req.user` may be undefined.

First argument is for object validation:

```js
export const get = requestHandler(
  {
    params: yup.object({
      id: yup.number().required(),
    }),
  },
  async (req, res) => {
    res.json(await getUser(req.params.id))
  },
)
```

`params` are parameters from routing:
```
Route path: /users/:userId/tasks/:taskId
Request URL: http://localhost:3000/users/34/tasks/3
req.params: { "userId": "34", "taskId": "3" }
```

`requestHandler` can also validate `req.query`:
```js
export const list = requestHandler(
  {
    query: yup.object().shape({
      limit: yup.number(),
      offset: yup.number(),
    }),
  },
  async (req, res) => {
    const { limit, offset } = req.query
    // limit and offset have `any` type because they aren't required in yup schema
    ...
  }
)
```

`query` is for URI parameters, e.g.: http://localhost:3000/pods?limit=20&offset=50

`requestHandler` can validate `req.body` (form data or JSON) in the same way.
