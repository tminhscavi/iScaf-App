import { getFactories } from "@/services/factoryServices"
import { TFactory } from "@/types/factory"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

export const useFactories = (options?: UseQueryOptions<TFactory[], Error>) => {
  return useQuery({
    queryKey: ['factories'],
    queryFn: (): Promise<TFactory[]> => getFactories(),
    ...options,
  })
}