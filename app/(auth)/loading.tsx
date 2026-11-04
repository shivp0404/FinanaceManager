
export default function DashboardLoading() {
  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-green-100 border-t-green-600" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Muneem
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Getting your finances ready...
          </p>
        </div>
      </div>
    </div>
  );
}
