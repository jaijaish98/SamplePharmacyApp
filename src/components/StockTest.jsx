import { useState } from 'react'
import StockOverview from './stock/StockOverview'

const StockTest = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Stock Test Component</h1>
      <p>Testing StockOverview component import...</p>
      <StockOverview />
    </div>
  )
}

export default StockTest
