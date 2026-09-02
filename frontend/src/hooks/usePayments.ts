import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post('/payments/create', { orderId });
      return response.data.data;
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (verificationData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      const response = await api.post('/payments/verify', verificationData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
