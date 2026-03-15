
## Wallet API Documentation

Postman collection for Wallet API backend project. This collection includes all endpoints for wallet management and transaction


## Features
- Create wallet
- Get wallet balance
- Deposit money
- Withdraw money
- Transfer money
- Get transaction (SENT/RECEIVED,DEPOSIT,WITHDRAW) history for a Wallet

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker
- Docker Compose

## Project Structure

![Project Structure](./project_structure.png)


## ERD Diagram

![ERD](./WalletERDpng.png)

## GIT Flow Diagram

![GIT FLOW](./Gitflow.png)

## Setup Instructions

#### Docker Setup

1. Install Docker and Docker Compose
2. Ensure Docker is running and port 4000 is available
3. Run the following command to start the database:
   ```bash
   docker-compose up -d
   ```
4. Check the port in `docker-compose.yml` (default is 4000)
5. Import the Postman collection to test the API `Wallet-API-Postman-Collection.json` or use the API documentation at `https://documenter.getpostman.com/view/29202259/2sBXigMDuJ`

#### Local Setup

1. Install Node.js (v18 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. Run your (PostgreSQL) database locally using:
   ```bash
   postgresql://wallet:wallet@localhost:5433/wallet
   ```
5. Run database migrations:
   ```bash
   npx prisma migrate
   ```
6. Start the server:
   ```bash
   npm run dev
   ```
6. Access the API at `http://localhost:4000`

7. Import the Postman collection to test the API `Wallet-API-Postman-Collection.json` or use the API documentation at `https://documenter.getpostman.com/view/29202259/2sBXigMDuJ`


#### Prerequisites
- Node.js (v18 or higher)
- Docker
- Docker Compose

### API Testing

For API Documentation, please refer to the API published at `https://documenter.getpostman.com/view/29202259/2sBXigMDuJ`.

