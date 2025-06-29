import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

const ProductTable = ({ hideAddButton }) => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Xoá sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(prod => prod.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditCode(product.code);
  };

  // Lưu chỉnh sửa
  const handleSave = async (id) => {
    try {
      const response = await axios.put(`/api/products/${id}`, {
        name: editName,
        code: editCode,
      });
      setProducts(products.map(prod =>
        prod.id === id ? response.data : prod
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h1>Product List</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            {!hideAddButton && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {editingId === product.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingId === product.id ? (
                  <input
                    value={editCode}
                    onChange={e => setEditCode(e.target.value)}
                  />
                ) : (
                  product.code
                )}
              </td>
              {!hideAddButton && (
              <td>
                {editingId === product.id ? (
                  <>
                    <button onClick={() => handleSave(product.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </>
                )}
              </td>
            )}
            </tr>
          ))}
        </tbody>
      </table>
    {!hideAddButton && (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <button onClick={() => router.push('/add-product')} style={{padding: "8px 16px"}}>Add</button>
      </div>
    )}
  </div>
  );
};

export default ProductTable;