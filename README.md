# Docker Compose Nodejs and MySQL example

## Run api test 

`install package:  npm i  hoặc yarn install`

`run api: npm run dev `

swagger: localhost:8080/api-docs

api: localhost:8080/api/{router}

## Thao tác với git

tạo nhánh mới:  `git checkout -b {tên nhánh}`

tạo git commit: 
+ `git add .`

+ `git commit -m {mesage}`

+ `git push `



## Run the System
We can easily run the whole with only a single command:
```bash
docker-compose up
```

Docker will pull the MySQL and Node.js images (if our machine does not have it before).

The services can be run on the background with command:
```bash
docker-compose up -d
```

## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:
```bash
docker-compose down --rmi all
```
