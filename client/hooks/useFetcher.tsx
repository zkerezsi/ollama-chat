import { useState, useEffect } from "jsr:@hono/hono/jsx/dom";

export function useFetcher<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const ac = new AbortController();

    fetcher(ac.signal)
      .then((data) => setData(data))
      .catch((err) => setError(err as Error))
      .finally(() => setIsLoading(false));

    return () => ac.abort();
  }, [fetcher]);

  return { data, error, isLoading };
}
