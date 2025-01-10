

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/store'

interface RequestPayload {
    url: string;
    payload: any;
    otp?: any;
    token?: string;
}

const postData = async (request: RequestPayload): Promise<any> => {
//   console.log(request.token, 'req.token');
//   console.log(request);

  const response = await fetch(request.url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Token ${request.token}` // Include the Authorization header
    },
    body: JSON.stringify(request.payload)
  });
  return await response.json();
}

type SuccessCallback = (data: any) => void;
type ErrorCallback = (error: any) => void;

interface MutationHookResult {
    data: any;
    error: any;
    isError: boolean;
    isSuccess: boolean;
    mutate: (payload: RequestPayload) => void;
    mutateAsync: (payload: RequestPayload) => Promise<any>;
    reset: () => void;
    status: string | null;
    onSuccess: SuccessCallback | undefined;
    otp?: any;
}

export const useMutateData = (title: string, onSuccess?: SuccessCallback, onError?: ErrorCallback): MutationHookResult => {
  const { token } = useAuthStore(state => ({
    token: state.token
  }));

  const mutation = useMutation({
    mutationKey: [title],
    mutationFn: (request: RequestPayload) => postData({ ...request, token }), // Ensure token is included
    onError: onError,
    onSuccess: onSuccess
  });

  return {
    data: mutation.data,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    reset: mutation.reset,
    status: mutation.status,
    onSuccess: onSuccess
  };
}

