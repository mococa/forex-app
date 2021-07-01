# Getting started

## Mongo on docker

run `docker pull mongo`

After this,

running `docker images`, `mongo` should be there.

run `docker run --name my-mongo -p 27017:27017 -d mongo`

And that's it.

## Run project

### Warning

You should run these commands inside the root folder of this project.

#### All at once

run `yarn run full`

#### Server

run `yarn run server`

#### Client

run `yarn run client`
