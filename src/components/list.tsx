import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function List() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const token = Cookies.get("token_cms");

  const getCategory = () => {
    axios.get('http://127.0.0.1:8000/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setCategories(res.data.data);
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const addCategory = () => {
    if (!newCategory.trim()) return;

    axios.post('http://127.0.0.1:8000/api/categories',
      { name: newCategory },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
      if (res.data.status === 200) {
        setNewCategory('');
        setEditingCategory(null);
        getCategory(); // ✅ Lấy dữ liệu mới ngay lập tức
      }
    });
  };

  const editCategory = (id) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setNewCategory(category.name);
      setEditingCategory(id);
    }
  };

  const saveEdit = () => {
    axios.put(`http://127.0.0.1:8000/api/categories/${editingCategory}`,
      { name: newCategory },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
      if (res.data.status === 200) {
        setNewCategory('');
        setEditingCategory(null);
        getCategory(); // ✅ Cập nhật lại danh sách ngay
      }
    });
  };

  const deleteCategory = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.data.status === 200) {
        getCategory(); // ✅ Cập nhật ngay sau khi xóa
      }
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Quản lý Danh mục Sản phẩm</h1>
        <div className="formSection">
          <h3>{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={editingCategory ? saveEdit : addCategory}>
            {editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}
          </button>
        </div>
      </div>

      <div className="categoryList">
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name}
              <div className="cover">
                <div className="one">
                  <button onClick={() => editCategory(category.id)}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </div>
                <div className="two">
                  <button onClick={() => deleteCategory(category.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
