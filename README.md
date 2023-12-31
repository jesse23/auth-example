# auth-example
Example for using nginx with saml

## auth-server
test URL:
```
http://localhost:3001/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.xW0ZfuPrW1tEaKrydn7xIQJAx6LSNUy7WkisqWB6eN4
```
token is generated using secreate : 'secreate'

## auth-sam
```
cd apps/auth-sam
npm i
npm start
access http://localhost:3000/login?return_url=/home
```

## nginx
- install docker-compose and docker
- `./run-dev.sh`
- access `http://localhost:3000/`

# APM
All APM setup is under `docker` folder as external services.
- Signoz: http://localhost:3301
- Grafana: http://localhost:3300
- Zipkin: http://localhost:9411

# Reference
- https://github.com/riddheshganatra/NGINX-auth_request
- https://github.com/andreacioni/saml2-nest-poc
- https://github.com/mnadeem/nodejs-opentelemetry-tempo/tree/main