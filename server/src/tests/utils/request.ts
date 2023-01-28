import { User } from 'app/user/user.model';
import { IncomingHttpHeaders } from 'http';
import { Schema } from 'yup';
import { currentUser } from 'tests/factories/user.factory';
import app from 'index';
import supertest from 'supertest';
import { createToken } from 'jwt';

type HTTPMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// eslint-disable-next-line @typescript-eslint/ban-types
type Body = object;

type Options = {
  user?: User | false;
  token?: string;
  body?: Body;
  schema?: Schema<unknown>;
};

type Result = {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const appForTest = supertest.agent(app);

export const request = async (
  method: HTTPMethods,
  url: string,
  { user, token, body, schema }: Options = {},
): Promise<Result> => {
  const headers: IncomingHttpHeaders = {};

  if (token || user !== false) {
    headers.authorization = `Bearer ${
      token ||
      createToken({ id: (user && user.id) || currentUser.id, type: 'user' })
    }`;
  }

  let request: any = appForTest;
  request = request[method.toLowerCase()].call(request, url);

  for (const key in headers) {
    if (headers[key])
      request = request.set('Authorization', headers[key] as string);
  }

  if (body) request = request.send(body);

  const result = await request;
  const data = result.body;

  if (schema) {
    try {
      schema.validateSync(data);
    } catch (error) {
      error.message += `\n\nActual response: ${JSON.stringify(
        data,
        undefined,
        2,
      )}`;

      throw error;
    }
  }

  return {
    status: result.status,
    data,
  };
};

export const requestPublic = (
  method: HTTPMethods,
  url: string,
  options: Options = {},
) => request(method, url, { ...options, user: false });

export const post = (url: string, options?: Options) =>
  request('POST', url, options);

export const postPublic = (url: string, options?: Options) =>
  requestPublic('POST', url, options);

export const get = (url: string, options?: Options) =>
  request('GET', url, options);

export const getPublic = (url: string, options?: Options) =>
  requestPublic('GET', url, options);

export const patch = (url: string, options?: Options) =>
  request('PATCH', url, options);

export const patchPublic = (url: string, options?: Options) =>
  requestPublic('PATCH', url, options);

export const put = (url: string, options?: Options) =>
  request('PUT', url, options);

export const putPublic = (url: string, options?: Options) =>
  requestPublic('PUT', url, options);

export const del = (url: string, options?: Options) =>
  request('DELETE', url, options);

export const delPublic = (url: string, options?: Options) =>
  requestPublic('DELETE', url, options);

export const testNotFound = async (request: Promise<Result>) => {
  const { status, data } = await request;

  expect(status).toBe(404);
  expect(data).toEqual({ error: 'Not found' });
};

export const testUnauthorized = async (request: Promise<Result>) => {
  const { status, data } = await request;

  expect(status).toBe(401);
  expect(data).toEqual({ error: 'Unauthorized' });
};

export const testForbidden = async (request: Promise<Result>) => {
  const { status, data } = await request;

  expect(status).toBe(403);
  expect(data).toEqual({ error: 'Forbidden' });
};
