import dynamic from "next/dynamic";

export const revalidate = 0;

const TransactionsPage = dynamic(() => import("./_client"), { ssr: false });

export default function Page() {
  return <TransactionsPage />;
}
