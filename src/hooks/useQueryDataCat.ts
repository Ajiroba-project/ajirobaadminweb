import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    // Log error response for debugging
    console.error(
      "Network response was not ok:",
      response.status,
      response.statusText
    );
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return response.json();
};

export const useQueryData = <T>(
  url: string,
  queryKey: (string | number | any)[],
  isEnabled: boolean
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey,
    queryFn: () => fetchData<T>(url),
    enabled: isEnabled,
  });
};
