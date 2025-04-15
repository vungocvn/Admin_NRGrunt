import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { logout } from "@/untils/auth";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function List() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = Cookies.get("token_cms");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.warning("You must log in to access this page.");
      router.push("/login");
    }
  }, []);

  const getCategory = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then((res) => setCategories(res.data.data))
    .catch((err) => console.error("Lỗi khi lấy danh mục:", err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCategory();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/categories',
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Add category successfully");
      closeModal();
      getCategory();
    } catch (err) {
      toast.error("Error when adding category");
    }
  };

  const saveEdit = () => {
    axios.put(
      `http://127.0.0.1:8000/api/categories/${editingCategory}`,
      { name: newCategory },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
      if (res.data.status === 200) {
        toast.success("Update category successfully");
        closeModal();
        getCategory();
      }
    }).catch(() => toast.error("Error when updating category"));
  };

  const deleteCategory = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.data.status === 200) {
        toast.success("Delete category successfully");
        getCategory();
      }
    }).catch(() => toast.error("Error when deleting category"));
  };

  const openModal = (id = null) => {
    if (id) {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        setNewCategory(category.name);
        setEditingCategory(id);
      }
    } else {
      setNewCategory('');
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategory('');
    setEditingCategory(null);
  };

  return (
    <div className="container">
      <div className="header">
  <h1>Quản lý Danh mục Sản phẩm</h1>
  <div style={{ textAlign: 'right', marginBottom: '16px' }}>
    <button
      onClick={() => openModal()}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        backgroundColor: "#01ab78",
        color: "white",
        border: "none",
        fontWeight: "500",
      }}
    >
      + Thêm danh mục
    </button>
  </div>
</div>


      <div className="categoryList">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Đang tải danh mục...</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                {category.name}
                <div className="cover">
                  <div className="one">
                    <button onClick={() => openModal(category.id)}>
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
        )}
      </div>

      {isModalOpen && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>{editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nhập tên danh mục"
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Hủy</button>
              <button className="save-btn" onClick={editingCategory ? saveEdit : addCategory}>
                {editingCategory ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
