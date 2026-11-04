type CardsProps = {
  Heading: string;
  Amount: number;
};

export default function Cards({ Heading, Amount }: CardsProps) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <p className="text-gray-500">{Heading}</p>

      <h2 className="mt-2 text-2xl font-bold">
        ₹{Amount.toLocaleString("en-IN")}
      </h2>
    </div>
  );
}