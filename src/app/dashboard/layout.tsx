import dynamic from "next/dynamic";

export const revalidate = 0;

const DashboardLayoutClient = dynamic(() => import("./_layout-client"), { ssr: false });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
