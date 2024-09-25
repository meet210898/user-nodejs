# User NodeJS
## The first test is located in the Test1 folder.
- **To run it, execute the following command in the terminal:** 
  ```bash
  node index.js
- **The result will be displayed in the terminal using console.log.**

## To run the second test:
1. **Create a .env file in the root of your project and add the following environment variables:**
  - **JWT_SECRET**: Your secret key for JWT.
  - **DATABASE_URL**: The connection string for your database.
  - **PORT**: (Optional) The port number for your server. If not specified, it will default to 5000.
2. **Install dependencies by running the following command in the terminal:**
   ```bash
   npm install
3. **Once installed, start the program using:**
   ```bash
   npm run dev

## Postman Collection
The Postman collection for testing the API is included in the project. You can find it with the following name:

`User.postman_collection.json`

You can import this file into Postman to easily test the available API endpoints.
