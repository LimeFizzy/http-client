# Low-Level HTTP Client implementation

A minimal, low-level HTTP client built using raw TCP sockets in Node.js. This client bypasses the Node.js HTTP modules and implements the HTTP protocol directly on top of TCP sockets.

## Features

- Supports GET, POST, PUT, and DELETE HTTP methods
- Uses raw TCP sockets (via Node.js net module) for connections
- Interactive CLI interface
- Simple and intuitive command syntax
- Handles request headers and response parsing

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd http-client

# Install dependencies
npm i

# Build the TypeScript code
npm run build
```

## Usage

Start the interactive client:

```bash
npm start
```

### Available Commands

The CLI supports the following commands:

```
GET <host> <path>
POST <host> <path> <body>
PUT <host> <path> <body>
DELETE <host> <path>
EXIT - Exit the application
```

### Examples

```
# GET request
> GET example.com /

# POST request with JSON body
> POST httpbin.org /post {"name":"test","value":123}

# PUT request
> PUT httpbin.org /put {"id":1,"status":"updated"}

# DELETE request
> DELETE httpbin.org /delete
```

## How It Works

This client implements HTTP requests and response parsing from scratch using:

1. TCP socket connection (via Node.js net module)
2. Manual creation of HTTP request headers and body
3. Parsing of HTTP responses, including status codes, headers, and body
4. Interactive CLI loop for continuous operation

The client directly handles the TCP socket lifecycle, including connection, data transmission/reception, and cleanup.

## Technical Details

- Written in TypeScript
- No HTTP or HTTPS dependencies
- Uses EventEmitter for socket event handling
- Manual HTTP request and response formatting/parsing
- Uses port 80 by default for HTTP connections