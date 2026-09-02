import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export const useWishlist = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data.data.wishlist;
    },
    enabled: isAuthenticated,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const wishlist = queryClient.getQueryData<any>(['wishlist']);
  
  return useMutation({
    mutationFn: async (productId: string) => {
      // Determine if it's an add or remove operation based on current cache
      const isItemInWishlist = wishlist?.items?.some((item: any) => item._id === productId || item === productId);
      
      if (isItemInWishlist) {
        const { data } = await api.delete(`/wishlist/items/${productId}`);
        return data.data.wishlist;
      } else {
        const { data } = await api.post('/wishlist/items', { productId });
        return data.data.wishlist;
      }
    },
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(['wishlist'], updatedWishlist);
    },
  });
};
