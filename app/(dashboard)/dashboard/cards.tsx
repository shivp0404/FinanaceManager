type CardsProps = {
  Heading: string;
  Amount: number;
  tone: "blue" | "green" | "red" | "orange";
};

const styles = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function Cards({
  Heading,
  Amount,
  tone,
}: CardsProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${styles[tone]}`}
    >
      <p className="text-sm font-medium opacity-80">
        {Heading}
      </p>

      <h2 className="mt-3 text-2xl font-bold">
        ₹{Amount.toLocaleString("en-IN")}
      </h2>
    </div>
  );
}