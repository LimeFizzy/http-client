import * as readline from 'readline';
import {HttpClient} from './http-client';
import {HttpMethod, HttpResponse} from './interfaces';
import {formatResponse, parseArgs} from './utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const httpClient = new HttpClient();

async function promptUser() {
  console.log('\n--- HTTP Client ---');
  console.log('Available commands:');
  console.log('GET <host> <path>');
  console.log('POST <host> <path> <body>');
  console.log('PUT <host> <path> <body>');
  console.log('DELETE <host> <path>');
  console.log('EXIT - Exit the application');
  console.log('---------------------------\n');

  rl.question('> ', async (command) => {
    try {
      if (command.trim().toUpperCase() === 'EXIT') {
        rl.close();
        return;
      }

      const args = command.split(' ');
      const method = args[0].toUpperCase();

      const methodHandlers: Record<HttpMethod, () => Promise<HttpResponse>> = {
        [HttpMethod.GET]: async () => {
          if (args.length < 3) {
            throw new Error('Not enough arguments. Usage: GET <host> <path>');
          }
          const {host, path} = parseArgs(args);

          console.log(`Sending GET request to ${host}${path}...`);
          return httpClient.get(host, path);
        },

        [HttpMethod.POST]: async () => {
          if (args.length < 4) {
            throw new Error(
              'Not enough arguments. Usage: POST <host> <path> <body>'
            );
          }
          const {host, path, body} = parseArgs(args);

          console.log(`Sending POST request to ${host}${path}...`);
          return httpClient.post(host, path, body);
        },

        [HttpMethod.PUT]: async () => {
          if (args.length < 4) {
            throw new Error(
              'Not enough arguments. Usage: PUT <host> <path> <body>'
            );
          }
          const {host, path, body} = parseArgs(args);

          console.log(`Sending PUT request to ${host}${path}...`);
          return httpClient.put(host, path, body);
        },

        [HttpMethod.DELETE]: async () => {
          if (args.length < 3) {
            throw new Error(
              'Not enough arguments. Usage: DELETE <host> <path>'
            );
          }
          const {host, path} = parseArgs(args);

          console.log(`Sending DELETE request to ${host}${path}...`);
          return httpClient.delete(host, path);
        },
      };

      if (method in methodHandlers) {
        const response = await methodHandlers[method as HttpMethod]();
        console.log(formatResponse(response));
      } else {
        console.log(`Unsupported method: ${method}`);
        console.log('Supported methods: GET, POST, PUT, DELETE');
      }
    } catch (error) {
      console.error(
        'Error:',
        error instanceof Error ? error.message : String(error)
      );
    }

    promptUser();
  });
}

promptUser();
