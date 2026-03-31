import dynamic from "next/dynamic";

export const revalidate = 0;

const SettingsPage = dynamic(() => import("./_client"), { ssr: false });

export default function Page() {
  return <SettingsPage />;
}
