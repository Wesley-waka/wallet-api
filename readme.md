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

#### Create Wallet (`POST /wallet/create`)
- **Username required**: Validates that username is provided in request body
- **Username uniqueness**: Checks if username already exists in database
- **Error responses**: 
  - `400` - Username missing or already exists
  - `500` - Internal server error

#### Deposit Wallet (`POST /wallet/deposit`)
- **Required fields**: Validates username and amount are provided
- **Empty username**: Prevents empty username strings
- **Error responses**:
  - `400` - Missing username/amount or empty username
  - `500` - Internal server error

#### Get Wallet (`GET /wallet/:username`)
- **Wallet existence**: Returns 404 if wallet not found or is deleted
- **Error responses**:
  - `404` - Wallet not found
  - `500` - Internal server error

#### Get Wallet Balance (`GET /wallet/balance/:username`)
- **Wallet existence**: Returns 404 if wallet not found or is deleted
- **Error responses**:
  - `404` - Wallet not found
  - `500` - Internal server error

#### Transfer Funds (`POST /wallet/transfer`)
- **Required fields**: Validates userFunded (recipient) and amount are provided
- **Wallet existence**: Validates both source and recipient wallets exist
- **Sufficient funds**: Checks if source wallet has enough balance
- **Self-transfer prevention**: Prevents transferring to same user
- **Error responses**:
  - `400` - Missing fields, insufficient funds, or self-transfer
  - `404` - Source or recipient wallet not found
  - `500` - Internal server error

#### Withdraw Wallet (`POST /wallet/withdraw`)
- **Required fields**: Validates username and amount are provided
- **Empty username**: Prevents empty username strings
- **Wallet existence**: Validates wallet exists and is not deleted
- **Sufficient funds**: Checks if wallet has balance (prevents zero/negative withdrawals)
- **Error responses**:
  - `400` - Missing fields, empty username, or insufficient balance
  - `404` - Wallet not found
  - `500` - Internal server error

#### Delete Wallet (`POST /wallet/delete`)
- **Username required**: Validates username is provided
- **Soft delete**: Sets `isDeleted` flag to true instead of hard deletion
- **Error responses**:
  - `400` - Username missing
  - `500` - Internal server error

### Transaction Controller Validations

#### Get Transactions (`POST /transaction/`)
- **Username required**: Validates username is provided in request body
- **Transaction type validation**: Ensures transaction type is one of: SENT, RECEIVED, DEPOSIT, WITHDRAW
- **Query flexibility**: Allows filtering by transaction type or returns all transactions for user
- **Error responses**:
  - `400` - Username missing or invalid transaction type
  - `500` - Internal server error

### Service Layer Validations

#### Transaction Service
- **Amount validation**: Throws error if amount is null in `createTransaction`
- **Wallet validation**: Validates sender/receiver wallet existence during transaction creation
- **Enum enforcement**: Uses TypeScript enums for TransactionType and TransactionStatus

#### Wallet Service
- **Soft delete filtering**: `getWalletValidate` only returns wallets where `isDeleted: false`
- **Atomic operations**: Uses Prisma's `increment` and `decrement` for safe balance updates

### Database Schema Validations

#### Prisma Schema Constraints
- **Username uniqueness**: Enforced at database level with `@unique` constraint on `userName`
- **Required fields**: Database enforces non-null constraints for essential fields
- **Default values**: 
  - Wallet balance defaults to 0
  - `isDeleted` defaults to false
  - Transaction status defaults to COMPLETED
- **CUID generation**: Transaction and wallet IDs use CUIDs for uniqueness and security
- **Enum constraints**: TransactionStatus enum ensures only valid statuses

### Validation Types Summary

#### Input Validation
- Required field checks (username, amount, userFunded)
- Empty string prevention
- Data type validation

#### Business Logic Validation
- Sufficient funds verification
- Self-transfer prevention
- Wallet existence checks
- Username uniqueness

#### Data Integrity
- Database-level constraints
- Soft delete implementation
- Atomic balance operations
- Enum-based type safety

#### Error Handling
- Consistent HTTP status codes (400, 404, 500)
- Descriptive error messages
- Graceful failure handling

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

# Wallet API

A comprehensive REST API for wallet management and transactions built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **Wallet Management**: Create, retrieve, update balance, and soft-delete wallets
- **Transaction Processing**: Deposit, withdraw, and transfer funds between wallets
- **Transaction History**: View all transactions or filter by type
- **Robust Validation**: Comprehensive input validation with meaningful error messages
- **Soft Delete**: Wallets are marked as deleted instead of being permanently removed
- **Transaction Status**: Track transaction status (PENDING, COMPLETED, FAILED)

## 📊 Database Schema

### Wallet Model
```typescript
interface Wallet {
  id: string;
  userName: string; // Unique identifier
  balance: number;  // Current balance
  isDeleted: boolean; // Soft delete flag
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction Model
```typescript
interface Transaction {
  id: string;
  sender_wallet_id?: string; // null for deposits
  receiver_wallet_id?: string; // null for withdrawals
  amount: number;
  type: 'SENT' | 'RECEIVED' | 'DEPOSIT' | 'WITHDRAW';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔗 API Endpoints

### Wallet Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/wallet` | Create a new wallet | No |
| GET | `/wallet/:username` | Get wallet details | No |
| GET | `/wallet/:username/balance` | Get wallet balance only | No |
| POST | `/wallet/deposit` | Deposit funds | No |
| POST | `/wallet/withdraw` | Withdraw funds | No |
| POST | `/wallet/transfer` | Transfer funds between wallets | No |
| DELETE | `/wallet` | Soft delete wallet | No |

### Transaction Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/transaction` | Get transactions (with optional filtering) | No |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Basic health check |

## 📝 Request/Response Examples

### Create Wallet
```bash
POST /wallet
Content-Type: application/json

{
  "username": "xWaka"
}
```

**Success Response (201):**
```json
{
  "id": "clx123abc456def789",
  "userName": "xWaka",
  "balance": 0,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:30:00.000Z",
  "isDeleted": false
}
```

**Validation Errors:**
```json
// Missing username
{ "error": "Username is required" }

// Username already exists
{ "error": "Username already exists" }
```

### Get Wallet
```bash
GET /wallet/xWaka
```

**Success Response (200):**
```json
{
  "id": "clx123abc456def789",
  "userName": "xWaka",
  "balance": 1500.50,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T11:45:00.000Z",
  "isDeleted": false
}
```

**Error Response (404):**
```json
{ "error": "Wallet not found" }
```

### Get Wallet Balance
```bash
GET /wallet/xWaka/balance
```

**Success Response (200):**
```json
{
  "username": "xWaka",
  "balance": 1500.50
}
```

### Deposit Funds
```bash
POST /wallet/deposit
Content-Type: application/json

{
  "username": "xWaka",
  "amount": 1000
}
```

**Success Response (200):**
```json
{
  "id": "clx123abc456def789",
  "userName": "xWaka",
  "balance": 1000,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T11:45:00.000Z",
  "isDeleted": false
}
```

**Validation Errors:**
```json
// Missing fields
{ "error": "Username and amount are required" }

// Empty username
{ "error": "Username cannot be empty" }
```

### Withdraw Funds
```bash
POST /wallet/withdraw
Content-Type: application/json

{
  "username": "xWaka",
  "amount": 500
}
```

**Success Response (200):**
```json
{
  "id": "clx123abc456def789",
  "userName": "xWaka",
  "balance": 500,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T11:50:00.000Z",
  "isDeleted": false
}
```

**Validation Errors:**
```json
// Missing fields
{ "error": "Username and amount are required" }

// Empty username
{ "error": "Username cannot be empty" }

// Empty balance
{ "error": "Wallet balance is empty" }

// Insufficient funds
{ "error": "Insufficient funds" }
```

### Transfer Funds
```bash
POST /wallet/transfer
Content-Type: application/json

{
  "username": "xWaka",
  "amount": 200,
  "userFunded": "will_smith"
}
```

**Success Response (200):**
```json
{ "message": "Transfer successful" }
```

**Validation Errors:**
```json
// Missing fields
{ "error": "User funded and amount are required" }

// Same user
{ "error": "User funded and username cannot be same" }

// User not found
{ "error": "User funded not found" }

// Insufficient funds
{ "error": "Insufficient funds" }
```

### Delete Wallet
```bash
DELETE /wallet
Content-Type: application/json

{
  "username": "xWaka"
}
```

**Success Response (200):**
```json
{
  "id": "clx123abc456def789",
  "userName": "xWaka",
  "balance": 0,
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T12:00:00.000Z",
  "isDeleted": true
}
```

**Validation Errors:**
```json
// Missing username
{ "error": "Username is required" }
```

### Get Transactions
```bash
POST /transaction
Content-Type: application/json

// Get all transactions
{
  "username": "xWaka"
}

// Get transactions by type
{
  "username": "xWaka",
  "transactionType": "SENT"
}
```

**Success Response (200):**
```json
[
  {
    "id": "clx456def789ghi012",
    "sender_wallet_id": "clx123abc456def789",
    "receiver_wallet_id": "clx789ghi012jkl345",
    "amount": 200,
    "type": "SENT",
    "status": "COMPLETED",
    "createdAt": "2024-03-15T12:00:00.000Z",
    "updatedAt": "2024-03-15T12:00:00.000Z"
  }
]
```

**Validation Errors:**
```json
// Missing username
{ "error": "Username is required" }

// Invalid transaction type
{ "error": "Transaction type must be SENT, RECEIVED, DEPOSIT or WITHDRAW" }
```

## ✅ Validations

### Input Validations

#### Common Validations (All Endpoints)
- **Username Required**: All endpoints require a username
- **Non-empty Username**: Username cannot be an empty string
- **Amount Required**: Amount field must be provided for financial operations

#### Wallet-Specific Validations
- **Username Uniqueness**: Wallet usernames must be unique
- **Wallet Existence**: Wallet must exist and not be deleted
- **Sufficient Funds**: Balance must cover withdrawal/transfer amounts
- **Non-negative Balance**: Cannot withdraw more than available balance
- **Different Users**: Transfer sender and receiver must be different

#### Transaction-Specific Validations
- **Transaction Type**: Must be one of: SENT, RECEIVED, DEPOSIT, WITHDRAW
- **User Existence**: Username must exist for transaction queries

### Error Responses

All validation errors return HTTP 400 status with descriptive error messages:
```json
{
  "error": "Descriptive error message"
}
```

Not found errors return HTTP 404 status:
```json
{
  "error": "Resource not found"
}
```

Server errors return HTTP 500 status:
```json
{
  "error": "Internal server error"
}
```

## 🔧 Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Architecture**: RESTful API

## 📦 Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── wallet.controller.ts
│   └── transaction.controller.ts
├── routes/              # Route definitions
│   ├── wallet.route.ts
│   └── transaction.route.ts
├── services/            # Business logic
│   ├── wallet.service.ts
│   └── transaction.service.ts
├── lib/                # Database connection
│   └── prisma.ts
├── server.ts            # Express server setup
└── index.ts            # Application entry point

prisma/
├── schema.prisma        # Database schema
└── migrations/          # Database migrations
```

## 🚀 Getting Started

### Docker Setup

1. **Install Docker and Docker Compose**
2. **Ensure Docker is running** and port 4000 is available
3. **Start database**:
   ```bash
   docker-compose up -d
   ```
4. **Check port** in `docker-compose.yml` (default is 4000)
5. **Import Postman collection** to test API `Wallet-API-Postman-Collection.json`

### Local Setup

1. **Install Node.js** (v18 or higher)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration

4. **Run PostgreSQL database** locally:
   ```bash
   postgresql://wallet:wallet@localhost:5433/wallet
   ```
5. **Run database migrations**:
   ```bash
   npx prisma migrate
   ```
6. **Start server**:
   ```bash
   npm run dev
   ```
7. **Access API** at `http://localhost:4000`

## 📚 Postman Collection

A comprehensive Postman collection is included (`Wallet-API-Postman-Collection.json`) with:
- All API endpoints
- Request/response examples
- Validation error scenarios
- Automated tests

Import the collection into Postman to test all endpoints easily.

## 🔒 Security Considerations

- Input validation on all endpoints
- SQL injection prevention via Prisma ORM
- Error message sanitization
- Soft delete for data integrity

## 📈 Future Enhancements

- [ ] Authentication & Authorization
- [ ] Pagination for transaction history
- [ ] Transaction limits and rate limiting
- [ ] Audit logging
- [ ] API versioning
- [ ] WebSocket support for real-time updates

## 📊 Visual Documentation

![Project Structure](./project-structure.png)
![ERD Diagram](./WalletERDpng.png)
![Git Flow](./Gitflow.png)
