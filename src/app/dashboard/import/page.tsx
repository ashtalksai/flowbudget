import dynamic from "next/dynamic";

export const revalidate = 0;

const ImportPage = dynamic(() => import("./_client"), { ssr: false });

export default function Page() {
  return <ImportPage />;
}
