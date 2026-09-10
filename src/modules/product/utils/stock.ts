export const LOW_STOCK_THRESHOLD = 5

export type StockStatus = 'in-stock' | 'low' | 'out'

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out'
  if (stock <= LOW_STOCK_THRESHOLD) return 'low'
  return 'in-stock'
}
