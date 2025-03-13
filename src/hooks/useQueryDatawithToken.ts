import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchData = async <T>(url: string, token?: string): Promise<T> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `token ${token}` }), // Include token if provided
    },
  });

  if (!response.ok) {
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
  isEnabled: boolean,
  token?: string
): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey,
    queryFn: () => fetchData<T>(url, token),
    enabled: isEnabled,
  });
};
