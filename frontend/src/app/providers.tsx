import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { usePhienStore } from '@/app/store'
import { datXuLyHetPhien } from '@/shared/api/axiosClient'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false } },
})

export function Providers() {
  // shared không được import app, nên app đăng ký cách xử lý khi token hết hạn
  useEffect(() => {
    datXuLyHetPhien(() => {
      usePhienStore.getState().dangXuat()
      queryClient.clear()
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
