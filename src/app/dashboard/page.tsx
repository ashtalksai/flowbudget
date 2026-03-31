import dynamic from "next/dynamic";

export const revalidate = 0;

const DashboardPage = dynamic(() => import("./_client"), { ssr: false });

export default function Page() {
  return <DashboardPage />;
}
