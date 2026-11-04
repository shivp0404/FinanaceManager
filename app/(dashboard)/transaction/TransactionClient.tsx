"use client";

import { useMemo, useState } from "react";
import {
  addExpense,
  updateTransaction,
  deleteTransaction,
} from "@/actions/transaction.actions";

type TransactionType = "INCOME" | "EXPENSE";

type Transaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
};

type FilterType = "ALL" | "INCOME" | "EXPENSE";

type SortType = "NEWEST" | "OLDEST" | "HIGH" | "LOW";

export default function TransactionClient({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Search, filter and sorting states
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [sortBy, setSortBy] = useState<SortType>("NEWEST");

  // Process transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search by description (real-time, case-insensitive)
    if (search.trim()) {
      result = result.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      );
    }

    // Filter by transaction type
    if (filterType !== "ALL") {
      result = result.filter((transaction) => transaction.type === filterType);
    }

    // Sort transactions
    result.sort((a, b) => {
      switch (sortBy) {
        case "NEWEST":
          return new Date(b.date).getTime() - new Date(a.date).getTime();

        case "OLDEST":
          return new Date(a.date).getTime() - new Date(b.date).getTime();

        case "HIGH":
          return b.amount - a.amount;

        case "LOW":
          return a.amount - b.amount;

        default:
          return 0;
      }
    });

    return result;
  }, [transactions, search, filterType, sortBy]);

  // Update transaction
  async function handleUpdate(id: number, formData: FormData) {
    const result = await updateTransaction(id, formData);

    if (result.success) {
      setEditingId(null);
    } else {
      alert(result.message);
    }
  }

  // Delete transaction
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) return;

    const result = await deleteTransaction(id);

    if (!result.success) {
      alert(result.message);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Transactions</h1>

      <p className="mt-2 text-gray-600">Manage all your income and expenses.</p>

      {/* Add Transaction Button */}
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-white"
      >
        {showForm ? "Cancel" : "Add Transaction"}
      </button>

      {/* Add Transaction Form */}
      {showForm && (
        <form
          action={async (formData) => {
            const result = await addExpense(formData);

            if (result.success) {
              setShowForm(false);
            } else {
              alert(result.message);
            }
          }}
          className="mt-6 rounded-lg bg-white p-5 shadow"
        >
          <h2 className="mb-4 text-xl font-semibold">Add Transaction</h2>

          <div className="mb-4">
            <label className="mb-2 block">Transaction Type</label>

            <select
              name="type"
              defaultValue="EXPENSE"
              required
              className="w-full rounded-lg border p-3"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2 block">Description</label>

            <input
              type="text"
              name="description"
              placeholder="e.g. Grocery shopping"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block">Amount (₹)</label>

            <input
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              placeholder="Enter amount"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block">Category</label>

            <select
              name="categoryId"
              defaultValue=""
              required
              className="w-full rounded-lg border p-3"
            >
              <option value="" disabled>
                Select Category
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Save Transaction
          </button>
        </form>
      )}

      {/* Search, Filter and Sort */}
      <div className="mt-6 grid gap-4 rounded-lg bg-white p-5 shadow md:grid-cols-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border p-3 outline-none focus:border-slate-900"
        />

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="w-full rounded-lg border p-3"
        >
          <option value="ALL">All Transactions</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortType)}
          className="w-full rounded-lg border p-3"
        >
          <option value="NEWEST">Newest First</option>
          <option value="OLDEST">Oldest First</option>
          <option value="HIGH">Highest Amount</option>
          <option value="LOW">Lowest Amount</option>
        </select>
      </div>

      {/* All Transactions */}
      <div className="mt-6 rounded-lg bg-white p-5 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Transactions</h2>

          <span className="text-sm text-gray-500">
            {filteredTransactions.length} of {transactions.length}
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="py-4 text-gray-500">
            {transactions.length === 0
              ? "No transactions added yet."
              : "No matching transactions found."}
          </p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="border-b py-4 last:border-0">
              {editingId === transaction.id ? (
                <form
                  action={(formData) => handleUpdate(transaction.id, formData)}
                  className="space-y-3"
                >
                  <select
                    name="type"
                    defaultValue={transaction.type}
                    required
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>

                  <input
                    type="text"
                    name="description"
                    defaultValue={transaction.description}
                    required
                    className="w-full rounded-lg border p-3"
                  />

                  <input
                    type="number"
                    name="amount"
                    defaultValue={transaction.amount}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full rounded-lg border p-3"
                  />
                  <div>
                    <label className="mb-2 block">Category</label>

                    <select
                      name="categoryId"
                      defaultValue={transaction.categoryId}
                      required
                      className="w-full rounded-lg border p-3"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-white"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-medium">{transaction.description}</p>

                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString("en-IN")}
                    </p>

                    <span
                      className={`text-xs font-medium ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`font-semibold ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString("en-IN")}
                    </p>

                    <button
                      type="button"
                      onClick={() => setEditingId(transaction.id)}
                      className="text-sm font-medium text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-sm font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
