// import Link from "next/link";
// import RateUpdate from "./components/RateUpdate";

// export default function Home() {
//   return (
//     <div className="flex justify-center items-center mt-32 text-xl font-bold">
//       <h1>Fancy Jewellers Admin</h1>
//       <div className="bg-black text-white p-3 rounded-full">
//       <Link href="/admin" ><h1></h1>Add or Delete Product</Link>
//       </div>
//       <RateUpdate/>
//     </div>
//   );
// }

import Link from "next/link";
import RateUpdate from "./components/RateUpdate";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackagePlus, RefreshCw, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Fancy Jewellers Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackagePlus className="mr-2 text-blue-500" />
                Product Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                href="/admin" 
                className="flex items-center justify-between w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>Add or Delete Product</span>
                <ArrowRight className="ml-2" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="mr-2 text-green-500" />
                Rate Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RateUpdate />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
