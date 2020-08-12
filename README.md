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

Docker will download the images from the docker hub and start the containers: you will see them appear in Docker Dashboard, VSCode Docker extension, or using `docker ps` in terminal. Two ports are exposed:

- <http://localhost:8080> to access the web site
- <http://localhost:8081> to access the Mongo DB admin panel

You can add and remove sharks to the list, through the site or through the DB admin directly. This setup is however not practical for development, as you would need to `Compose Up` everytime you update the code.

## Running the code locally in dev mode

To use the local code from the repository and get instant refresh of code updates, we will build the server (app) and client (nginx) images locally and use bind mounts from the docker containers to the host filesystem. This is done through the `docker-compose.override.yml` configuration which is automatically applied by docker when the target file is not specified (no `-f` option). Note that `node_modules` is still kept inside the container, so that it is properly initiated in dev mode as well.

This time, the command to start/stop the app is even simpler:

    docker-compose up -d --build
    docker-compose down

You still access the application the same way once the containers are up. Additionally, you can see the logs of the containers or shell into them directly from VSCode: right-click on the container from the docker extension tab and you will see the options.

## Debugging the node.js code

The node.js container also exposes port 9229 to an external debugger and the process in dev mode is started with debug activated (using the `package.json` debug script). Launching the Chrome DevTools external debugger (`chrome://inspect` in the Chrome address bar), you should see the server code in the Sources tab and you will be able to set breakpoints. If you don't, make sure you have `localhost:9229` listed in the Connection tab.

## Publish to dockerhub

I have setup a dockerhub repository for each image to be built and configured them to pull from github at each new commit to the `publish` branch:

- [sfidanza/sharks](https://hub.docker.com/repository/docker/sfidanza/sharks)
- [sfidanza/sharks-frontend](https://hub.docker.com/repository/docker/sfidanza/sharks-frontend)

## Running on Openshift

Working on it...
