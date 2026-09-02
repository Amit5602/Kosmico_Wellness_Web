import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

export function ProductFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: FormData) => void; 
  initialData?: any;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSlug(initialData.slug || '');
      setPrice(initialData.price?.toString() || '');
      setStock(initialData.stock?.toString() || '');
      setCategory(initialData.category || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setSlug('');
      setPrice('');
      setStock('');
      setCategory('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('description', description);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Product' : 'Create Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required type="text" className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input required type="text" className="w-full border p-2 rounded" value={slug} onChange={e => setSlug(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input required type="number" step="0.01" className="w-full border p-2 rounded" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input required type="number" className="w-full border p-2 rounded" value={stock} onChange={e => setStock(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category (ID)</label>
            <input required type="text" className="w-full border p-2 rounded" value={category} onChange={e => setCategory(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required className="w-full border p-2 rounded" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Images (Cloudinary)</label>
            <input type="file" multiple accept="image/*" className="w-full border p-2 rounded" onChange={e => setImages(e.target.files)} />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
