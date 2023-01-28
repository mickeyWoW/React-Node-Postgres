import history from 'lib/history';
import routes from 'routes';
import { getAdminToken, setCurrentAdmin } from 'components/Admin/service';

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type Options = {
  method?: HTTPMethod;
  headers?: Record<string, string>;
  body?: string | FormData | Blob | File;
};

const paramsToSearch = (
  query?: Record<string, string | number | undefined>,
) => {
  if (!query) return '';

  const filtered: Record<string, string> = {};
  for (const key in query)
    if (query[key] !== undefined) filtered[key] = query[key] as string;

  const str = new URLSearchParams(filtered).toString();
  return str ? `?${str}` : '';
};

type RequestOptions = {
  method: HTTPMethod;
  url: string;
  query?: Record<string, string | number | undefined>;
  data?: unknown;
  options?: Options;
  auth?: boolean;
};

export const request = async <T>({
  method,
  url,
  query,
  data,
  options = {},
  auth = true,
}: RequestOptions): Promise<T> => {
  options.method = method;
  if (!options.headers) options.headers = {};
  const { headers } = options;
  headers.accept = 'application/json';

  if (data) {
    const formData = new FormData();
    const record = data as Record<string, string>;
    for (const key in record) {
      const value = record[key];
      if (Array.isArray(value)) {
        const arrayKey = `${key}[]`;
        value.forEach((item) => formData.append(arrayKey, item));
      } else if (value !== undefined) formData.append(key, value);
    }
    options.body = formData;
  }

  if (auth) {
    const token = getAdminToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}${url}${paramsToSearch(query)}`,
    options,
  );

  if (response.status === 401) {
    // Invalid token
    setCurrentAdmin();
    history.push(routes.login);
    throw new Error('Unauthorized');
  }

  const contentType = response.headers.get('Content-Type');
  const isJSON = contentType?.includes('application/json');

  // eslint-disable-next-line
  let body: any
  try {
    body = await (isJSON ? response.json() : response.text());
  } catch (err) {
    body = undefined;
  }

  if (!response.ok) throw new Error(body.error || body);

  return body;
};

export const get = <T>(
  url: string,
  options?: Omit<RequestOptions, 'method' | 'url'>,
) => request<T>({ method: 'GET', url, ...options });

export const post = <T>(
  url: string,
  options?: Omit<RequestOptions, 'method' | 'url'>,
) => request<T>({ method: 'POST', url, ...options });

export const patch = <T>(
  url: string,
  options?: Omit<RequestOptions, 'method' | 'url'>,
) => request<T>({ method: 'PATCH', url, ...options });
