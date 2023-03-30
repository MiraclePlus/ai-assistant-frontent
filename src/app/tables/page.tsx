'use client';

import React, { FC, useEffect } from 'react'
// import useSWR from 'swr'

// const fetcher = (...args) => fetch(...args).then(res => res.json())

const Page = () => { 
  // const { data, error, isLoading } = useSWR('/api/tables', fetcher)
  // console.log('----------------', data, error, isLoading);
  const a = async () => {
    console.log('----------------- initialized');
    const res = await fetch('/api/tables').then(res => res.json())
    console.log('-------------------------', res);
    return res
  };

  useEffect(() => {
    const res = a();
  }, [])
    

  return (
    <div>
      tables
    </div>
  )
}

export default Page;
