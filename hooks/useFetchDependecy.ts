
import React, { useEffect } from 'react'

export const useFetchDependecy = (funcion: () => Promise<void>, dependecy: any) => {
    useEffect(()=>{
        const fetchData = async()=>{
            try {
                await funcion();
            } catch (error) {
                
            }
        }
    },[])
  return []
}
