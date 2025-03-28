'use client'
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import EditProductForm from './editProduct';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Admin() {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [id: number]: boolean }>({});
  const [editData, setEditdata] = useState<any>({
    image: "",
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    origin: "",
    discount: 0,
    status: false,
    category_id: 1,
  });
  const [lstProduct, setLstProduct] = useState<any>([]);
  const [dataCategory, setDataCategory] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [total, setTotal] = useState({ total_item: 0, total_page: 1, page_size: 5, page_index: 1 });

  const token = Cookies.get('token_cms') || "";
  const router = useRouter();

  const getAllProduct = ({ id_category, sortOder, sort_col, pageIndex, pageSize }: any) => {
    setLstProduct([]);
    axios
      .get("http://127.0.0.1:8000/api/products", {
        params: {
          id_category,
          sort_col,
          sort_order: sortOder,
          page_index: pageIndex,
          page_size: pageSize || total.page_size,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          const data = res.data.data;
          setTotal({
            ...total,
            page_index: data.page,
            total_page: data.total_pages,
            total_item: data.total_items,
            page_size: data.page_size,
          });
          setLstProduct(data.items);
        } else {
          toast.error("Error fetching products");
        }
      })
      .catch(() => {
        toast.error("Error fetching products");
      });
  };

  const resetFormData = () => {
    setEditdata({
      image: "",
      name: "",
      price: 0,
      quantity: 0,
      description: "",
      origin: "",
      discount: 0,
      status: false,
      category_id: 1,
    });
  };

  const getAllCategory = () => {
    axios.get("http://127.0.0.1:8000/api/categories")
      .then((res) => {
        if (res.data.status === 200) {
          setDataCategory(res.data.data);
        } else {
          toast.error("Error fetching categories");
        }
      }).catch((error) => {
        toast.error("Error fetching categories");
      });
  };

  const createProduct = () => {
    if (editData.image.startsWith("blob:")) {
      toast.error("Vui lòng đợi ảnh được upload thành công trước khi lưu.");
      return;
    }
  
    if (!editData.name || !editData.price || !editData.category_id) {
      toast.error("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }
    axios.post("http://127.0.0.1:8000/api/products", editData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      toast.success("Product created successfully!");
      handleCloseModal();
      getAllProduct({ id_category: selectedCategory, pageIndex: 1, sort_col: "id", sortOder: "desc" });
    }).catch((error) => {
      toast.error("Failed to create product. " + error.response.data.error);
    });
  };

  const handleOpenCreateModal = () => {
    resetFormData();
    setIsEdit(false);
    setOpenModal(true);
  };

  const updateProduct = () => {
    axios.put(`http://127.0.0.1:8000/api/products/${editData.id}`, editData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      toast.success("Product updated successfully!");
      setOpenModal(false);
      getAllProduct({ id_category: selectedCategory, pageIndex: total.page_index, sort_col: "id", sortOder: "desc" });
    }).catch((error) => {
      toast.error("Failed to update product. " + error.response.data.error);
    });
  };

  const deleteProduct = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      toast.success("Product deleted successfully!");
      getAllProduct({ id_category: selectedCategory, pageIndex: total.page_index, sort_col: "id", sortOder: "desc" });
    }).catch((error) => {
      toast.error("Failed to delete product. " + error.response.data.error);
    });
  };

  const handleEditData = (id: number) => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => {
        setEditdata(res.data.data);
        setIsEdit(true);
        setOpenModal(true);
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    resetFormData();
  };

  const formatCurrency = (amount: number, currency = 'VND', locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > total.total_page) return;
    setTotal({ ...total, page_index: page });
    getAllProduct({ id_category: selectedCategory, sortOder: "desc", sort_col: "id", pageIndex: page });
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200 && response.data.filePath) {
        // Gán ảnh thực sự từ server vào editData.image
        setEditdata((prev: any) => ({
          ...prev,
          image: response.data.filePath, // ← Đây là ảnh server hiểu được
        }));
      } else {
        toast.error('Image upload failed!');
      }
    } catch (error) {
      toast.error('Error uploading image!');
    }
  };


  const handleCategoryChange = (e: any) => {
    const catId = parseInt(e.target.value);
    setSelectedCategory(catId);
    setTotal({ ...total, page_index: 1 });
    getAllProduct({ id_category: catId, sort_col: "id", sortOder: "desc", pageIndex: 1 });
  };

  useEffect(() => {
    getAllProduct({ id_category: selectedCategory, sort_col: "id", sortOder: "desc", pageIndex: total.page_index });
    getAllCategory();
  }, [total.page_index]);

  return (
    <div className="container">
      <div className="content">
        <div className="content-sub">
          <div className="one">
            <h2>Danh sách sản phẩm</h2>
          </div>
          <div className="action-buttons">
            <button className="btn-add" onClick={handleOpenCreateModal}>+ Add</button>
          </div>
        </div>

        {openModal && (
          <EditProductForm
            editData={editData}
            setEditdata={setEditdata}
            dataCategory={dataCategory}
            handleImageUpload={handleImageUpload}
            updateProduct={isEdit ? updateProduct : createProduct}
            cancelProcess={handleCloseModal}
          />
        )}

        <div className="content-table" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Price</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Origin</th>
                <th>Discount</th>
                <th>Description</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {lstProduct.map((product: any) => (
                <tr key={product.id}>
                  <td><img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} width={100} /></td>
                  <td>{product.name}</td>
                  <td>{product.status ? "Open" : "Hide"}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{dataCategory.find((cat: any) => cat.id === product.category_id)?.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.origin}</td>
                  <td>{product.discount}</td>
                  <td>
                    <div className={`description ${expandedDescriptions[product.id] ? "expanded" : ""}`} dangerouslySetInnerHTML={{ __html: product.description }}></div>
                    <span className="desc-toggle" onClick={() => setExpandedDescriptions((prev) => ({ ...prev, [product.id]: !prev[product.id] }))}>
                      {expandedDescriptions[product.id] ? "Thu gọn" : "Xem thêm"}
                    </span>
                  </td>
                  <td><button onClick={() => handleEditData(product.id)}><i className="fa-solid fa-pen-to-square"></i></button></td>
                  <td><button onClick={() => deleteProduct(product.id)}><i className="fa-solid fa-delete-left"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer">
          <div className="pagination-filter">
            <label style={{ marginRight: '6px' }}>Lọc theo danh mục:</label>
            <select onChange={handleCategoryChange} value={selectedCategory}>
              <option value={0}>Tất cả</option>
              {dataCategory.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="pagination-controls">
            <button disabled={total.page_index === 1} onClick={() => handlePageChange(total.page_index - 1)}>Previous</button>
            {Array.from({ length: total.total_page }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => handlePageChange(page)} className={`pagination-button ${page === total.page_index ? "active" : ""}`} >
                {page}
              </button>
            ))}
            <button disabled={total.page_index === total.total_page} onClick={() => handlePageChange(total.page_index + 1)}>Next</button>
          </div>
        </div>

        <style jsx>{`
          .pagination-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 20px;
          }
          .pagination-filter select {
            padding: 6px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
          .pagination-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }
          .pagination-button {
            padding: 6px 12px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #fff;
            cursor: pointer;
          }
          .pagination-button.active {
            background-color: #00A878;
            color: white;
            font-weight: bold;
          }
          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
