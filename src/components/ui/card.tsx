export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border bg-white dark:bg-gray-800 p-4 shadow">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}