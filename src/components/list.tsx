import { useState } from 'react';

export default function List() {
  // State để lưu danh sách danh mục sản phẩm
  const [categories, setCategories] = useState([
    { id: 1, name: 'Sữa Rửa Mặt' },
    { id: 2, name: 'Kem Dưỡng' },
    { id: 3, name: 'Son Môi' },
    { id: 4, name: 'Dầu Dưỡng Tóc' },
    { id: 5, name: 'Serum' },
  ]);

  // State để quản lý form thêm/sửa danh mục
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  // Thêm danh mục mới
  const addCategory = () => {
    if (newCategory.trim() === '') return;

    const newCategoryObj = {
      id: categories.length + 1,
      name: newCategory,
    };
    setCategories([...categories, newCategoryObj]);
    setNewCategory('');
  };

  // Chỉnh sửa danh mục
  const editCategory = (id) => {
    const category = categories.find((category) => category.id === id);
    setNewCategory(category.name);
    setEditingCategory(id);
  };

  // Lưu thay đổi sau khi chỉnh sửa
  const saveEdit = () => {
    setCategories(
      categories.map((category) =>
        category.id === editingCategory
          ? { ...category, name: newCategory }
          : category
      )
    );
    setNewCategory('');
    setEditingCategory(null);
  };

  // Xoá danh mục
  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
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
        <h3>Danh sách danh mục sản phẩm</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name}
            <div className="cover">
                   <div className="one">
              <button onClick={() => editCategory(category.id)}><i className="fa-solid fa-pen"></i></button>
              </div>
                <div className="two">
              <button onClick={() => editCategory(category.id)}><i className="fa-solid fa-trash"></i></button>
              </div>
            </div>
             
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
