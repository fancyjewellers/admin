import Link from "next/link";
import RateUpdate from "./components/RateUpdate";

export default function Home() {
  return (
    <div className="flex justify-center items-center mt-32 text-xl font-bold">
      <div className="bg-black text-white p-3 rounded-full">
      <Link href="/admin" ><h1>Fancy Jewellers Admin</h1></Link>
      
      </div>
      <RateUpdate/>
    </div>
  );
}
