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

  const token = Cookies.get("token_cms");;
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
    .then((res) => {
      setCategories(res.data.data);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy danh mục:", err);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
  
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/categories',
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest',
            Pragma: 'no-cache',
            Expires: '0'
          },
        }
      );
  
      toast.success("add category successfully");
      setNewCategory('');
      setEditingCategory(null);
      getCategory();
  
    } catch (err) {
      toast.error("error when adding category");
      console.error("error:", err);
    }
  };
  

  const editCategory = (id:any) => {
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
        toast.success("update category successfully");
        setNewCategory('');
        setEditingCategory(null);
        getCategory();
      }
    }).catch(() => {
      toast.error("error when updating category");
    });
  };

  const deleteCategory = (id:any) => {
    axios.delete(`http://127.0.0.1:8000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.data.status === 200) {
        toast.success("Delete category successfully");
        getCategory();
      }
    }).catch(() => {
      toast.error("error when deleting category");
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
        {loading ? (
          <p className="text-center py-4 text-gray-500">Đang tải danh mục...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}