import * as net from 'net';
import {EventEmitter} from 'events';
import {HttpMethod, HttpRequest, HttpResponse} from './interfaces';

export class HttpClient extends EventEmitter {
  private socket: net.Socket | null = null;

  constructor() {
    super();
  }

  private parseResponse(rawResponse: string): HttpResponse {
    const [headersStr, body] = rawResponse.split('\r\n\r\n', 2);
    const headerLines = headersStr.split('\r\n');

    const statusLine = headerLines[0];
    const statusMatch = statusLine.match(/HTTP\/\d\.\d\s+(\d+)\s+(.*)/);

    if (!statusMatch) {
      throw new Error(`Invalid status line: ${statusLine}`);
    }

    const statusCode = parseInt(statusMatch[1], 10);
    const statusMessage = statusMatch[2];

    const headers: Record<string, string> = headerLines
      .slice(1)
      .reduce((acc, line) => {
        const [key, value] = line.split(':', 2).map((part) => part.trim());
        if (key && value) {
          acc[key.toLowerCase()] = value;
        }
        return acc;
      }, {} as Record<string, string>);

    return {
      statusCode,
      statusMessage,
      headers,
      body: body || '',
    };
  }

  public async request({
    method,
    host,
    path,
    body,
  }: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      this.socket = socket;

      let headers: string[] = [
        `${method} ${path} HTTP/1.1`,
        `Host: ${host}`,
        'Connection: close',
      ];

      if (body) {
        headers.push(`Content-Length: ${Buffer.byteLength(body)}`);
      }

      let request = headers.join('\r\n') + '\r\n\r\n';

      if (body) {
        request += body;
      }

      let responseData = '';

      socket.connect(80, host, () => {
        socket.write(request);
      });

      socket.on('data', (data) => {
        responseData += data.toString();
      });

      socket.on('end', () => {
        try {
          const response = this.parseResponse(responseData);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      socket.on('error', (error) => {
        reject(error);
      });

      socket.setTimeout(10000, () => {
        socket.destroy();
        reject(new Error('Request timed out'));
      });
    });
  }

  public async get(host: string, path: string): Promise<HttpResponse> {
    return this.request({
      method: HttpMethod.GET,
      host,
      path,
    });
  }

  public async post(
    host: string,
    path: string,
    body: string
  ): Promise<HttpResponse> {
    return this.request({
      method: HttpMethod.POST,
      host,
      path,
      body,
    });
  }

  public async put(
    host: string,
    path: string,
    body: string
  ): Promise<HttpResponse> {
    return this.request({
      method: HttpMethod.PUT,
      host,
      path,
      body,
    });
  }

  public async delete(host: string, path: string): Promise<HttpResponse> {
    return this.request({
      method: HttpMethod.DELETE,
      host,
      path,
    });
  }

  public close(): void {
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }
}
