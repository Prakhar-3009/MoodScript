import React from 'react'
import { BarLoader } from 'react-spinners'

const EntryLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <BarLoader color="#fb923c" height={8} width={180} speedMultiplier={0.7} className="mb-6" />
      <div className="text-orange-800 text-lg font-semibold">Fetching your journal entry...</div>
      <div className="text-orange-500 text-sm mt-2">Hang tight, your thoughts are on their way!</div>
    </div>
  )
}

export default EntryLoading;