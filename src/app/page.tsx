import { getSession } from "@/lib/getSession";

export default async function Home() {
  const session = await getSession();
  console.log("🚀 ~ Home ~ session:", session);
  return (
    <>
      <h1>Home Component</h1>
      <pre>{JSON.stringify(session)}</pre>
    </>
  );
}
