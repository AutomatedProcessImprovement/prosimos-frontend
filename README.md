# Prosimos Client

![build_badge](https://github.com/AutomatedProcessImprovement/prosimos-frontend/actions/workflows/build.yml/badge.svg)

![prod_push_badge](https://github.com/AutomatedProcessImprovement/prosimos-frontend/actions/workflows/push-docker-image.yml/badge.svg)

![local_push_badge](https://github.com/AutomatedProcessImprovement/prosimos-frontend/actions/workflows/push-local-docker-image.yml/badge.svg)


The web client implemented as a part of the [Prosimos Web Application](https://github.com/AutomatedProcessImprovement/prosimos-docker). 


## Start the client locally (via npm)

> Please, note that you need to have `Node.js` and `npm` installed on your computer in order to follow these steps. The instructions on how to do that could be found here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#overview

1) Install all dependencies
    ```
    npm install
    ```
2) Start the client
    ```
    npm start
    ```

## Start the client locally (via Docker)

> Please, note that you need to have `Docker` installed in order to follow the following steps. The installation instructions could be found here: https://docs.docker.com/get-docker/
Also, we need to have a running instance of `api` service before starting the front-end. The instructions on how to start the back-end service could be found [here](https://github.com/AutomatedProcessImprovement/prosimos-microservice#start-the-web-server-locally-via-docker).

0) *Pre-requisite step*: Docker is running.
1) Build the image from the current code version.
    ```
    docker build -f Dockerfile.local -t prosimos-client-local .
    ```

    Note: it might take a while to finish (around 9 min)
2) Start the container.
    ```
    docker run -p 80:80 prosimos-client-local
    ```
3) Access http://localhost:80/

## Regarding client's development
<details><summary>Development notes</summary>

## Release the new version of the API docker image
1) Build the image from the current code version.
    ```
    docker build -f Dockerfile -t prosimos-client .
    ```

2) Get the image id of the created image in step 1
    ```
    docker images prosimos-client
    ```

3) Tag the image specifying the version we will be releasing, e.g. `0.1.8`
    ```
    docker tag <ImageID_from_step_2> irynahalenok/prosimos-client:0.1.8
    ```

4) Push the created version to the Docker hub
    ```
    docker push irynahalenok/prosimos-client:0.1.8
    ```

5) Tag the created version in git
    ```
    git tag 0.1.8 <SHA>
    ```
    where `<SHA>` should be changed to the SHA of the last commit in the release.

6) Push the created tag
    ```
    git push origin 0.1.8
    ```

</details>