import { useEffect, useState } from "react";

interface FetchState<T> {
    response: T | null;
    isLoading: boolean;
    error: string | null;
}


export function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {

    const [response, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect( () => {

        const abortController = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);

            try {

                const res = await fetch(url, { 
                    ...options,
                    signal: abortController.signal });

                if (!res.ok) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }

                const result = await res.json();

                setData(result as T);
                setError(null);

            } catch (err: any) {
                if (err.name !== 'AbortError'){
                    setError(err.message || "Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData()

        return () => abortController.abort();
    }, [url, JSON.stringify(options)]);

    return {response, isLoading, error};
}