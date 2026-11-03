import { HashRouter } from 'react-router-dom'
import { CartProvider } from '@/entities/cart/model/cart-store'
import { AppRouter } from './router'

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </HashRouter>
  )
}
