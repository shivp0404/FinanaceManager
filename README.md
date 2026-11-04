# Muneem – Personal Finance Management

## Introduction

**Muneem** is a personal finance management application designed to help individuals manage their money, track daily transactions, monitor monthly budgets, and understand their spending habits.

It provides a centralized dashboard to monitor income, expenses, and budgets. With category-wise reports and monthly visual insights, Muneem helps users understand where their money goes and make better financial decisions.

---

# Project Structure

Muneem follows the Next.js App Router architecture with a modular structure for server actions, application routes, components, and services.

```text
muneem/
│
├── actions/
│   ├── auth.actions.ts
│   ├── budget.actions.ts
│   ├── profile.action.ts
│   ├── reports.actions.ts
│   └── transaction.actions.ts
│
├── app/
│   ├── _components/
│   │
│   ├── (auth)/
│   │
│   ├── (dashboard)/
│   │   ├── budget/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── reports/
│   │   ├── transaction/
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   └── auth/
│   │       └── refresh/
│   │           └── route.ts
│   │
│   ├── services/
│   │   └── finduser.tsx
│   │
│   ├── favicon.ico
│   └── globals.css
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed1.ts
│
├── public/
│
├── generated/
│   └── prisma/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
└── README.md
```

### Folder Responsibilities

| Folder / File | Responsibility |
|---|---|
| `actions/` | Server actions for authentication, budgets, profiles, reports, and transactions. |
| `app/_components/` | Shared application components. |
| `app/(auth)/` | Authentication-related pages, including login and registration. |
| `app/(dashboard)/` | Dashboard application pages and their shared layout. |
| `app/api/` | API routes, including the authentication refresh endpoint. |
| `app/services/` | Shared application services and user-related operations. |
| `prisma/` | Database

## Features

### 1. Authentication & Authorization
- User registration and login.
- Secure authentication using access and refresh tokens.
- Logout functionality.
- Authorization to ensure users can access only their own financial data.

### 2. Dashboard
- Overview of income and expenses.
- Monthly budget overview.
- Spending summaries.
- Centralized view of financial information.

### 3. Transaction Management
- Create income and expense transactions.
- View transaction history.
- Edit and delete transactions.
- Search transactions.
- Sort and filter transactions.

### 4. Category Management
- Organize transactions using categories.
- Associate each transaction with its corresponding category.
- Predefined global categories.

### 5. Monthly Budget Management
- Create a budget for a particular month.
- Monitor spending against the allocated budget.
- Update an existing monthly budget once during a month.

### 6. Reports & Insights
- Category-wise expense analysis.
- Monthly financial reports.
- Visual representation of financial data using charts.
- Understand spending patterns across different categories.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Type safety |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and management |
| Prisma PostgreSQL Adapter | PostgreSQL connectivity |
| Recharts | Data visualization |
| bcrypt | Password hashing |
| jsonwebtoken | Token-based authentication |

---

# Getting Started

Follow these instructions to clone and run Muneem on your local machine.

## Prerequisites

Before getting started, make sure you have installed:

- [Node.js](https://nodejs.org/) (compatible with Next.js 16)
- npm (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) or a PostgreSQL database provider such as [Neon](https://neon.tech/)
- Git

You can verify your installations using:

```bash
node -v
npm -v
git --version
```

## Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone <https://github.com/shivp0404/FinanaceManager.git>
```

Navigate into the project directory:

```bash
cd FinanceManager
```

## Step 2: Install Dependencies

Install the project dependencies:

```bash
npm install
```

If you are installing the dependencies manually, the required packages are:

```bash
npm install @prisma/adapter-pg@^7.10.1 @prisma/client@^7.10.1 bcrypt@^6.0.0 jsonwebtoken@^9.0.3 next@16.4.3 pg@^8.23.1 react@19.3.0 react-dom@19.3.0 recharts@^3.10.1
```
**Note:** If you have cloned the repository and its `package.json` and lockfile contain all required dependencies, `npm install` is sufficient. You do not need to install them again manually.

## Step 3: Configure Environment Variables

Create a file named `.env` in the root directory of the project.

Add the following environment variables:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5433/financemanager2"

ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
```

### Understanding the environment variables

| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL database connection string |
| ACCESS_TOKEN_SECRET | Secret used to sign access tokens |
| REFRESH_TOKEN_SECRET | Secret used to sign refresh tokens |

**Database configuration:**

Make sure your PostgreSQL server is running and that the database `financemanager2` exists.

Replace the username, password, port, and database name with your actual PostgreSQL configuration.

If you are using Neon or another hosted PostgreSQL provider, use the connection string provided by that service.

**Important:** Never share your actual database credentials or authentication secrets. Do not commit your `.env` file to GitHub.

## Step 4: Run Database Migrations

Muneem uses Prisma ORM to manage database models and migrations.

Run the following command:

```bash
npx prisma migrate dev --name init
```

This command:

- Reads the Prisma schema.
- Creates the required database tables.
- Applies the migration to your PostgreSQL database.
- Stores migration history in the `prisma/migrations` directory.

## Step 5: Generate Prisma Client

After applying the migrations, generate Prisma Client:

```bash
npx prisma generate
```

This generates the Prisma Client based on your database schema, allowing the application to interact with PostgreSQL through Prisma.

## Step 6: Seed the Database

Muneem provides two seed scripts to initialize the database.

Run the following commands in the given order:

**1. Seed Global Categories**

```bash
npm run seedCategory
```

This inserts the predefined global categories used by the application.

**2. Seed Application Data**

```bash
npm run seed
```

This inserts the initial application data.

Make sure both commands complete successfully before proceeding.

## Step 7: Start the Development Server

Once the database setup and seeding are complete, start the application:

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

You can now register an account and start using Muneem!

---

## Database Management

Some useful Prisma commands for development:

**Create a new migration after modifying the Prisma schema:**

```bash
npx prisma migrate dev --name migration_name
```

**Generate Prisma Client:**

```bash
npx prisma generate
```

**Open Prisma Studio to inspect database records:**

```bash
npx prisma studio
```

---

## Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

---

## License

This project is available under the MIT License.