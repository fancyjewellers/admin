// "use client"
// import { getRate, updateX } from '@/lib/actions/actions';

// import React, { useEffect, useState } from 'react'

// const RateUpdate = () => {
//   const [prevx,setPrevX]=useState<number>()
//   const [newx,setNewX]=useState<string|number>()
//   const [id,setId]=useState<any>()
//   useEffect(()=>{
//     const fatafatch=async()=>{
//       const xvalue=await getRate()
//       setPrevX(xvalue[0].x)
//       setId(xvalue[0]._id)
//     }
//     fatafatch()
//   },[])
//   const handleSubmit=async(id:any,x:number)=>{
//     const result=await updateX(id,x);
//     if (result) {
//       setNewX(0);
//     }
//   }
//   return (
//     <div>
//       <p>present X is :{prevx}</p>
//     <h3>your new X</h3>
//       <input type='any' onChange={(e)=>{setNewX(e.target.value)}} value={newx} /> 
//       <button onClick={() => handleSubmit(id, Number(newx))} >Update</button>
//     </div>
//   )
// }

// export default RateUpdate
"use client"
import React, { useEffect, useState } from 'react'
import { getRate, updateX } from '@/lib/actions/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

const RateUpdate = () => {
  const [prevx, setPrevX] = useState<number>(0);
  const [newx, setNewX] = useState<string>('');
  const [id, setId] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialRate = async () => {
      try {
        setIsLoading(true);
        const xvalue = await getRate();
        if (xvalue && xvalue.length > 0) {
          setPrevX(xvalue[0].x);
          setId(xvalue[0]._id);
        } else {
          setError('No rate data found');
        }
      } catch (err) {
        setError('Failed to fetch current rate');
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialRate();
  }, []);

  const handleSubmit = async () => {
    if (!newx) {
      setError('Please enter a valid value');
      return;
    }

    try {
      setIsLoading(true);
      const numericNewX = Number(newx);
      const result = await updateX(id, numericNewX);
      
      if (result) {
        setPrevX(numericNewX);
        setNewX('');
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (err) {
      setError('Failed to update rate');
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCw className="mr-2 text-blue-500" />
          Rate Update
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="mr-2 text-red-500" />
            {error}
          </div>
        )}

        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Rate updated successfully!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current X Value
            </label>
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">{prevx}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New X Value
            </label>
            <Input 
              type="number" 
              placeholder="Enter new X value" 
              value={newx}
              onChange={(e) => {
                setNewX(e.target.value);
                setError('');
              }}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading || !newx}
          >
            {isLoading ? 'Updating...' : 'Update Rate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RateUpdate
