import {HttpResponse} from './interfaces';

export const formatResponse = ({
  statusCode,
  statusMessage,
  headers,
  body,
}: HttpResponse) => {
  return `
  Status: ${statusCode} ${statusMessage}
  Headers: ${JSON.stringify(headers, null, 2)}
  Body: ${body}
  `;
};

export const parseArgs = (args: string[]) => ({
  host: args[1],
  path: args.length === 3 ? args.slice(2).join(' ') : args[2],
  body: args.length === 4 ? args.slice(3).join(' ') : '',
});
