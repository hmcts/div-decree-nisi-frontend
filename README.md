# Divorce Decree Nisi

## Getting started


Install dependencies:

`yarn install`

`touch docker-compose.yaml`

put the following into docker-compose.yaml file:

```
redis:
  image: redis
  ports:
    - "6379:6379"
```
    
Start database:

`docker-compose up`

Start application:

`yarn dev`

The application will now be running on https://localhost:3000
