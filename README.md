# Instructions

## Installation

_**Pre-requisites**: [Node.js](https://nodejs.org) (preferably current LTS version, v12.16.3), [NPM](https://npmjs.com)
(typically comes with [Node.js](https://nodejs.org), Development has been done with v6.14.4)_

```bash
npm i                    # Install dependencies
cp .env.example .env     # Copy and edit environment variables
```

Compile and run

```bash
npm run build
npm start
```

## Commands

```bash
npm i                    # Install dependencies
npm start                # Start application
npm run build            # Build application
npm run test             # Run Unit tests
npm run lint             # Lint code
cp .env.example .env     # Copy and edit environment variables
```

## Env Vars

**ENV:** name of the environment.

## Tests/development

Business logic has been coded with TDD, a good start point to understand this code base is to read the the test file
and understand what the feature is supposed to do before reading the actual code.

## Considerations

- I decided to use TypeScript with Node since this is my main language at the moment.
- The app never request for a web server, but since the requierements asks for a Dockerfile/docker-compose, I assumed
  that i would be appreceiatad(I also thought to make a CLI app instead of a web server).
- Installing Node, NPM and its dependencies can be avoided by creating an image with the Dockerfile provided, this
  dockerfile will try to use the `.env` file so no arguments will be needed on image start (take into account that the
  command`cp .env.example .env` will be a prerequisite for this).  
  To start a container with the image execute `docker run -p 3000:3000 <image>`, take into account that logFile will be
  inside the container.

## How to

I provided a postman collection inside this repo, with that and the server running anyone can tinker with this app
