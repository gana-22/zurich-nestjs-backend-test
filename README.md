# zurich-nestjs-backend-test

This is a NestJS API for Zurich Malaysia's motor insurance website. The API allows users to obtain insurance premiums based on the vehicle's location and product code. It also includes administrative functionalities to maintain products and prices.

## Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/gana-22/zurich-nestjs-backend-test.git
  cd zurich-nestjs-backend-test
  ```

2. Install dependencies:
  ```sh
  npm install
  ```
  
3. Copy the `.env.example` file and rename it as `.env` then fill in the required credentials.
```sh
mv .env.example .env
```

4. Run the docker:
  ```sh
  docker compose up --build -d
  ```
  This command will start the PostgreSQL container and automatically create the `motor_insurance_website` database and `products` table with the specified credentials.

5. Access the application:
  ```sh
  http://localhost:3000/
  ```


## Endpoints
### Public Endpoints
`GET /product`: Query parameters include productCode and location. Accessible by all users.

### Admin Endpoints
`POST /product`: Request body includes productCode, location, and price. Admin access only.
`PUT /product`: Query parameter includes productCode. Request body includes location and price. Admin access only.
`DELETE /product`: Query parameter includes productCode. Admin access only.


## Postman Collection
To make it easier to test the API, a Postman collection is provided. You can find it in the `docs` directory.

1. Open Postman.
2. Import the collection file located at `docs/Zurich-NestJs.postman_collection.json`.
3. Follow the instructions within the collection to test the API endpoints.
The collection is organized into four different folders, each corresponding to a CRUD method (Create, Read, Update, Delete). Each folder contains both successful and failure scenarios. Additionally, each request includes a post-response script to verify if the response is correct.

## Testing
Run the unit tests using jest:
```sh
npm run test
```


## Linting
Lint the code using ESLint:
```sh
npm run lint
```


## Coverage
The test coverage is 90% and above
```sh
npm run coverage
```


## Swagger
All endpoints are accessible from Swagger. Visit http://localhost:3000/api to view the Swagger documentation.


## Security
The API requires a header token/metadata containing the user role to be checked before accessing an endpoint. Middleware is used for security and role-checking purposes.


## Deployment
The API is deployment-ready and includes a Docker Compose script to set up the PostgreSQL database.


### Update and Delete Operations
The update and delete operations are based on the `product_code`, which can have multiple records. To ensure precise modifications, additional filters based on `location` or `price` can be used. This allows for more targeted updates and deletions, preventing unintended changes to multiple records with the same `product_code`.