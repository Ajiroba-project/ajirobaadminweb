import { useQuery } from '@tanstack/react-query';

interface Data {
    // Define the structure of your data
}

const fetchData = async (url: string, criteria?: any): Promise<Data> => {
    const response = await fetch(url);
    return await response.json();
}


export const useQueryData = (url: string, title: string, isEnabled: boolean) => {
    return useQuery<Data>({
        queryKey: [title],
        queryFn: () => fetchData(url),
        enabled: isEnabled
    });
}




