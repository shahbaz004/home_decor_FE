import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical, X } from 'lucide-react';
import { useGetAdminProductsQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation } from '@/api/apiSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { productSchema } from '@/utils/validators.js';
import Button from '@/components/ui/Button.jsx';
import Input, { Textarea } from '@/components/ui/Input.jsx';
import Modal from '@/components/ui/Modal.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { TableSkeleton } from '@/components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function ProductForm({ product, onSuccess, onClose }) {
  const isEdit = !!product;
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: product ? {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      sale_price: product.sale_price,
      category: product.category?.id || product.category,
      stock: product.stock,
      sku: product.sku,
      is_active: product.is_active,
      is_featured: product.is_featured,
    } : { is_active: true, is_featured: false },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      sale_price: data.sale_price ? Number(data.sale_price) : null,
      stock: Number(data.stock),
    };
    try {
      if (isEdit) {
        await updateProduct({ id: product.id, ...payload }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created!');
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Product Name" required error={errors.name?.message} {...register('name')} />
        <Input label="Slug" required error={errors.slug?.message} {...register('slug')} />
      </div>
      <Textarea label="Description" required rows={3} error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Price (₹)" type="number" required error={errors.price?.message} {...register('price')} />
        <Input label="Sale Price (₹)" type="number" error={errors.sale_price?.message} {...register('sale_price')} />
        <Input label="Stock" type="number" required error={errors.stock?.message} {...register('stock')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="SKU" required error={errors.sku?.message} {...register('sku')} />
        <Input label="Category ID" error={errors.category?.message} {...register('category')} />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_active')} className="rounded" />
          <span className="text-sm">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('is_featured')} className="rounded" />
          <span className="text-sm">Featured</span>
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isCreating || isUpdating}>
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </form>
  );
}

function AdminProducts({ mode }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, isLoading, refetch } = useGetAdminProductsQuery({ page, page_size: 15, search });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 15) : 1;

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-serif font-bold text-neutral-800">Products</h1>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-neutral-100 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={8} cols={6} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.url || product.image || `https://picsum.photos/seed/${product.id}/40/40`}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-medium text-neutral-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-neutral-400">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {product.category?.name || product.category || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-800">{formatPrice(product.sale_price || product.price)}</p>
                        {product.sale_price && (
                          <p className="text-xs text-neutral-400 line-through">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.is_active ? 'success' : 'default'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/products/${product.slug}`} target="_blank">
                          <Button size="xs" variant="ghost" className="text-neutral-500">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="xs" variant="ghost" onClick={() => openEdit(product)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-neutral-400">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-neutral-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={refetch}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default AdminProducts;
