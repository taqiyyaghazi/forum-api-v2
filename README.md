# Forum API

A robust RESTful API for a forum application, built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.

## 🚀 Key Features

- **Clean Architecture**: Separation of concerns for maintainability and scalability.
- **Authentication**: Secure JWT-based authentication (Access & Refresh Tokens).
- **Thread & Comment System**: Create threads, add comments, and reply to comments.
- **Database Management**: PostgreSQL with `node-pg-migrate` for schema migrations.
- **Testing**: Comprehensive unit and integration tests using `Vitest`.
- **Linting**: Code quality enforcement with ESLint and TypeScript.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Testing**: Vitest, Supertest
- **Dependency Injection**: instances-container
- **Package Manager**: pnpm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **pnpm** (Package Manager) -> `npm install -g pnpm`
- **PostgreSQL** (Database)

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/taqiyyaghazi/forum-api-v2.git
cd forum-api-v2
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file and a `.env.test` file in the root directory. You can use `.env.example` as a reference.

**Copy the example file:**

```bash
cp .env.example .env
cp .env.example .env.test
```

**Update `.env` with your local database credentials:**

```env
# HTTP SERVER
HOST=localhost
PORT=5000

# POSTGRES
PGHOST=localhost
PGUSER=your_db_user
PGDATABASE=forumapi
PGPASSWORD=your_db_password
PGPORT=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your_super_secret_access_key
REFRESH_TOKEN_KEY=your_super_secret_refresh_key
ACCCESS_TOKEN_AGE=3000
```

### 4. Database Setup

Ensure your PostgreSQL service is running and create the databases specified in your `.env` files (`forumapi` and `forumapi_test`).

```sql
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```

**Run Migrations:**

```bash
# For Development Database
pnpm migrate:up

# For Test Database (Required for running tests)
pnpm migrate:up:test
```

### 5. Running the Application

**Development Mode:**

This uses `nodemon` and `tsx` to restart the server on file changes.

```bash
pnpm dev
```

**Production Build:**

```bash
pnpm build
pnpm start
```

## 🧪 Running Tests

To run the full test suite (unit and integration tests):

```bash
pnpm test
```

To run tests with code coverage:

```bash
pnpm test:coverage
```

To run tests in watch mode:

```bash
pnpm test:watch
```

## 🏗️ Project Structure

```
src/
├── Applications/    # Use Cases and Application Logic
├── Commons/         # Shared utilities, constants, exceptions
├── Domains/         # Entities and Repository Interfaces
├── Infrastructures/ # External frameworks, Database, HTTP Server
├── Interfaces/      # Http Handlers and Routes
└── app.ts          # Entry point
tests/               # Shared Test Helpers
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
