import { includes } from 'ramda';

const domain: string = "http://10.0.1.10:8000"

const fetchData = async (method: string, path: string, data: object = {}) => {
  const options = {
    method,
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  }
  if (includes(method, ['POST', 'PUT', 'DELETE'])) {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(`${domain}${path}`, options);
  return await res.json();
}

export {
  fetchData,
}
