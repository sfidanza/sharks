# Sample node.js application in Docker

This is a sample app to demonstrate how to dev & deploy a node.js application using docker-compose. The application is made of:

- a container with nginx (serve statics, proxy to node.js)
- a container with node.js (application server)
- a container with MongoDB
- a container with express-mongon for DB administration

This should run locally in dev mode with live reload when code changes, as well as in production mode with all code loaded in the containers. DB data is persisted in a docker volume.

It should also be possible to run it on Kubernetes or Openshift easily.

## Development environment - Windows installation

Installation:

- Install Docker Desktop (requires Windows 10 Home v2004 - May 2020 update, or Windows 10 Enterprise with HyperV activated)
  - <https://docs.docker.com/docker-for-windows/install-windows-home/>
- Install Docker extension in VSCode

## Running the code locally in prod mode

Once you get everything setup, it is simple to start/stop the app from the repository root folder:

    docker-compose -f docker-compose.yml up -d --build
    docker-compose -f docker-compose.yml down

Note: in VSCode, you can simply right-click on `docker-compose.yml` and choose `Compose Up` (or `Compose Restart` or `Compose Down`).

Docker will build the containers and start them: you will see them appear in Docker Dashboard, VSCode Docker extension, or using `docker ps` in terminal. Two ports are exposed:

- <http://localhost:8080> to access the web site
- <http://localhost:8081> to access the Mongo DB admin panel

You can add and remove sharks to the list, through the site or through the DB admin directly. This setup is however not practical for development, as you would need to `Compose Up` everytime you update the code.

## Running the code locally in dev mode

To get instant refresh of code updates, we use bind mounts from the docker containers (server and client) to the host filesystem. This is done through the `docker-compose.override.yml` configuration which is automatically applied by docker when the target file is not specified (no `-f` option). Note that `node_modules` is still kept inside the container, so that it is properly initiated in dev mode as well.

This time, the command to start/stop the app is even simpler:

    docker-compose up -d --build
    docker-compose down

Additionally, you can see the logs of the containers or shell into them directly from VSCode: right-click on the container from the docker extension tab and you will see the options.

## Debugging the node.js code

To do.

## Running on Openshift

Working on it...
