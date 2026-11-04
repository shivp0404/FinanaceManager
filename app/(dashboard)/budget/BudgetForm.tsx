
"use client";

import {
  addBudget,
  updateBudget,
  type BudgetActionState,
} from "@/actions/budget.actions";

import { useState, useTransition } from "react";

type BudgetFormProps = {
  budgetId: number | null;
  amount: number;
  editCount: number;
};

export default function BudgetForm({
  budgetId,
  amount,
  editCount,
}: BudgetFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(
    amount > 0 ? String(amount) : ""
  );
  const [state, setState] = useState<BudgetActionState>({
    success: false,
    message: "",
  });
  const [isPending, startTransition] = useTransition();

  const hasBudget = budgetId !== null;
  const canEdit = hasBudget && editCount === 0;
  const isLocked = hasBudget && editCount >= 1;

  const isDisabled = !budgetAmount || Number(budgetAmount) <= 0;

  async function handleSubmit(formData: FormData) {
    setState({ success: false, message: "" });

    startTransition(async () => {
      const result = hasBudget
        ? await updateBudget({ success: false, message: "" }, formData)
        : await addBudget({ success: false, message: "" }, formData);

      setState(result);

      if (result.success) {
        setShowForm(false);
        setBudgetAmount(
          String(Number(formData.get("amount")))
        );
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Budget Status */}
      {!hasBudget && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              No monthly budget set
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create a spending limit for this month.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setState({ success: false, message: "" });
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Monthly Budget
          </button>
        </div>
      )}

      {canEdit && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-gray-900">
              Current Budget: ₹{amount.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              You have one budget edit available this month.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setBudgetAmount(String(amount));
              setState({ success: false, message: "" });
              setShowForm(true);
            }}
            className="rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Edit Monthly Budget
          </button>
        </div>
      )}

      {isLocked && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <span className="text-lg text-amber-600">⚠</span>

            <div>
              <p className="font-semibold text-amber-900">
                Monthly budget editing is locked
              </p>
              <p className="mt-1 text-sm text-amber-800">
                You have already used your one allowed edit
                this month. You can set a new budget next month.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => !isPending && setShowForm(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {hasBudget
                    ? "Edit Monthly Budget"
                    : "Set Monthly Budget"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Set your overall spending limit for this month.
                </p>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {hasBudget && (
              <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> You can edit your
                  monthly budget only once. After saving, further
                  changes will be locked until next month.
                </p>
              </div>
            )}

            <form action={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Monthly Budget Amount
                </label>

                <div className="flex items-center rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <span className="border-r border-gray-200 px-4 py-3 text-gray-500">
                    ₹
                  </span>

                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    required
                    disabled={isPending}
                    className="w-full rounded-r-lg px-4 py-3 text-gray-900 outline-none"
                  />
                </div>
              </div>

              {state.message && (
                <p
                  className={`rounded-lg p-3 text-sm ${
                    state.success
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                  aria-live="polite"
                >
                  {state.message}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDisabled || isPending}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending
                    ? "Saving..."
                    : hasBudget
                      ? "Update Budget"
                      : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
