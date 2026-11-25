import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Tooltip } from 'radix-ui'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from '@/components/ui'
import { router } from './router'

/**
 * Cache dos dados remotos. O cliente da API já repete falhas de rede enquanto o Render acorda,
 * então aqui uma nova tentativa basta.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tooltip.Provider delayDuration={300}>
        <RouterProvider router={router} />
        <Toaster />
      </Tooltip.Provider>
    </QueryClientProvider>
  )
}
