# Sample node.js application in Docker

This is a sample app to demonstrate how to develop & deploy a node.js application using `docker compose`. The application is made of several containers:

- nginx (serve statics, proxy to node.js)
- node.js (application server)
- MongoDB
- mongo-express for DB administration

Target: it should run locally in dev mode with live reload when code changes, as well as in production mode with all code loaded in the containers. DB data should be persisted between deployments. It should also be possible to run it on Kubernetes or Openshift easily.

## Development environment - Windows installation

Installation:

- Install Docker Desktop (requires Windows 10 Home v2004 - May 2020 update, or Windows 10 Enterprise with HyperV activated)
  - <https://docs.docker.com/docker-for-windows/install/>
- Install Docker extension in VSCode

## Running the code locally in prod mode

Once you get everything setup, it is simple to start/stop the app from the repository root folder:

    docker compose -f docker-compose.yml up -d
    docker compose -f docker-compose.yml down

Note: in VSCode, you can simply right-click on `docker-compose.yml` and choose `Compose Up` (or `Compose Restart` or `Compose Down`).

Docker will download the images from the docker hub and start the containers: you will see them appear in Docker Dashboard, VSCode Docker extension, or using `docker ps` in terminal. Two ports are exposed:

- <http://localhost:8080> to access the web site
- <http://localhost:8081> to access the Mongo DB admin panel

Functionally, you can add and remove sharks to the list, through the site or the DB admin directly. This setup is however not practical for development, as you would need to rebuild the docker image everytime you update the code:

    docker build ./client/ -t sfidanza/sharks-frontend   # for changes in ./client/
    docker build ./server/ -t sfidanza/sharks   # for changes in ./server/
    docker compose -f docker-compose.yml up -d

## Running the code locally in dev mode

To use the local code from the repository and get instant refresh of code updates, we will build the server (app) and client (nginx) images locally and use bind mounts from the docker containers to the host filesystem. This is done through the `docker-compose.override.yml` configuration which is automatically applied by docker when the target file is not specified (no `-f` option). Note that `node_modules` is still kept inside a volume, so that it is properly initiated in dev mode as well.

This time, the command to start/stop the app is even simpler:

    docker compose up -d --build
    docker compose down

You still access the application the same way once the containers are up. Additionally, you can see the logs of the containers or shell into them directly from VSCode: right-click on the container from the docker extension tab and you will see the options.

## Debugging the node.js code

The node.js container also exposes port 9229 and the process in dev mode is started with debug activated (using the `package.json` debug script). Launching the Chrome DevTools external debugger (`chrome://inspect` in the Chrome address bar), you should see the server code in the Sources tab and you will be able to set breakpoints. If you don't, make sure you have `localhost:9229` listed in the Connection tab.

## CI pipeline

The github workflow is triggered when pushing commits on github: it automatically builds and publishes images to github container repository.

- [sfidanza/sharks-backend](https://github.com/sfidanza/sharks/pkgs/container/sharks-backend)
- [sfidanza/sharks-frontend](https://github.com/sfidanza/sharks/pkgs/container/sharks-frontend)

## Running on Openshift

The `docker-compose.yml` file can also be used to deploy the services on Openshift. Once logged in Openshift with a valid oc context (for example on the [RedHat try out Openshift cluster](https://learn.openshift.com/playgrounds/openshift44/)), you can simply run:

    kompose up --provider openshift

Alternatively, to see the generated services definition, you can simply convert with kompose and then use oc to deploy services:

    kompose convert --provider openshift --out oc-resources.yaml
    oc create -f oc-resources.yaml

Note: to deploy the services, you only need the `docker-compose.yml` file, which you can grab on any platform through

    curl https://raw.githubusercontent.com/sfidanza/sharks/publish/docker-compose.yml -o docker-compose.yml

## Credits

I started this by following [Kathleen Juell's tutorial to dockerize applications](https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose), hence the shark imagery.
