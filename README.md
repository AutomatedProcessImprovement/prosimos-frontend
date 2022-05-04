# Prosimos client (frontend)

## Start the client locally
1) Install all dependencies
    ```
    npm install
    ```
2) Start the client
    ```
    npm start
    ```

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
