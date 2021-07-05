# Getting started

## Mongo on docker

run `docker pull mongo`

After this,

running `docker images`, `mongo` should be there.

run `docker run --name my-mongo -p 27017:27017 -d mongo`

And that's it.

For starting:

#### If it's not started

run `docker ps -a` to list your containers.

Look for the mongo container. And get the container ID from it

Then run `docker start CONTAINER-ID`

## Environment variables

As you can see on the .env.example file, there are a few environment variable to fill.

Create a .env file in the root directory declaring the variables following the .env.example model.

## Run project

### Warning

You should run these commands inside the root folder of this project.

#### All at once

run `yarn run full`

#### Server

run `yarn run server`

#### Client

run `yarn run client`
