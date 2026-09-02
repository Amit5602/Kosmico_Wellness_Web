import { formatINR } from '../../utils/currency';
import { useState } from 'react';
import { useAdminProducts, useAdminDeleteProduct, useAdminCreateProduct, useAdminUpdateProduct } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/Button';
import { ProductFormModal } from '../../components/admin/ProductFormModal';

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const { data, isLoading } = useAdminProducts(page, 20, search);
  const deleteMutation = useAdminDeleteProduct();
  const createMutation = useAdminCreateProduct();
  const updateMutation = useAdminUpdateProduct();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to soft-delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (formData: FormData) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, productData: formData }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmit} 
        initialData={editingProduct} 
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif text-primary">Manage Products</h1>
        <Button onClick={openCreateModal}>
          Add Product
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border border-border rounded-lg px-4 py-2 flex-1 max-w-sm"
        />
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-main">Product</th>
                <th className="px-6 py-4 font-medium text-text-main">Price</th>
                <th className="px-6 py-4 font-medium text-text-main">Stock</th>
                <th className="px-6 py-4 font-medium text-text-main">Status</th>
                <th className="px-6 py-4 font-medium text-text-main text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">Loading...</td></tr>
              ) : data?.products?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No products found.</td></tr>
              ) : (
                data?.products?.map((product: any) => (
                  <tr key={product._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-main">{product.name}</div>
                      <div className="text-xs text-text-muted">/{product.slug}</div>
                    </td>
                    <td className="px-6 py-4">{formatINR(product.price)}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${product.isActive ? 'text-green-600' : 'text-error'}`}>
                        {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        className="py-1 px-3 text-xs mr-2"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        className="py-1 px-3 text-xs text-error border-error hover:bg-error hover:text-white"
                        onClick={() => handleDelete(product._id)}
                        disabled={!product.isActive || deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data?.meta?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="flex items-center px-4 text-sm text-text-muted">Page {page} of {data.meta.pages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))} disabled={page >= data.meta.pages}>Next</Button>
        </div>
      )}
    </div>
  );
}
