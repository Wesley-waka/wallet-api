
## Wallet API Documentation

Postman collection for Wallet API backend project. This collection includes all endpoints for wallet management and transaction


## Features
- Create wallet
- Get wallet balance
- Deposit money
- Withdraw money
- Transfer money
- Get transaction (SENT/RECEIVED,DEPOSIT,WITHDRAW) history for a Wallet

## Validations

### Wallet Controller Validations

#### Create Wallet
- **Username required**: Validates that username is provided
- **Username uniqueness**: Checks if username already exists

#### Deposit Wallet
- **Required fields**: Validates username and amount are provided
- **Empty username**: Prevents empty username strings

#### Get Wallet
- **Wallet existence**: Returns 404 if wallet not found

#### Transfer Funds
- **Wallet existence**: Validates source wallet exists
- **Sufficient funds**: Checks if source wallet has enough balance
- **Required fields**: Validates recipient and amount are provided
- **Self-transfer prevention**: Prevents transferring to same user
- **Recipient existence**: Validates recipient wallet exists

#### Withdraw Wallet
- **Required fields**: Validates username and amount are provided
- **Empty username**: Prevents empty username strings

### Transaction Controller Validations

#### Get Transactions
- **Username required**: Validates username is provided
- **Transaction type validation**: Ensures transaction type is one of: SENT, RECEIVED, DEPOSIT, WITHDRAW

### Service Layer Validations

#### Transaction Service
- **Amount validation**: Throws error if amount is null

### Database Schema Validations

#### Prisma Schema
- **Username uniqueness**: Enforced at database level with unique constraint
- **Required fields**: Database enforces non-null constraints for required fields
- **Transaction and wallet IDs are uniquely generated using CUIDs**: with uniqueness enforced at the database level to enhance security.

### Validation Types Summary
- **Input validation**: Required fields, empty strings
- **Business logic**: Sufficient funds, self-transfer prevention
- **Data integrity**: Username uniqueness, wallet existence
- **Enum validation**: Transaction type restrictions
- **Error handling**: Proper HTTP status codes (400, 404, 500)

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker
- Docker Compose

## Project Structure

![Project Structure](./project-structure.png)


## ERD Diagram

![ERD](./Wallet.png)

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

