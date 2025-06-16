import { useQuery } from '@tanstack/react-query'

export default function useRealTimeWeather(location: string, units: string){

    return useQuery({
        queryKey:['weather'],
        enabled: false,
        queryFn: async(): Promise<unknown> => {
            const response = await fetch(`${import.meta.env.VITE_REALTIME_WEATHER_ENDPOINT}?location=${location}&units=${units}`)
            return await response.json()
        }
    })
}