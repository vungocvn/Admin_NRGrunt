'use client'
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import EditProductForm from './editProduct';

export default function Admin() {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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
  const [total, setTotal] = useState({ total_item: 0, total_page: 1, page_size: 5, page_index: 1 });

  const token = Cookies.get('token_cua_Ngoc') || "";
  const router = useRouter();

  // Lấy danh sách sản phẩm
  const getAllProduct = ({ id_category, sortOder, sort_col, pageIndex, pageSize }: any) => {
    setLstProduct([]);
    axios
      .get("http://127.0.0.1:8000/api/products", {
        params: { id_category, sort_col, sort_order: sortOder, page_index: pageIndex, page_size: pageSize }
      })
      .then((res) => {
        if (res.data.status === 200) {
          setTotal({ ...total, page_index: pageIndex || total.page_index, total_page: res.data.data.total_pages, total_item: res.data.data.total_items });
          setLstProduct(res.data.data.items);
        } else {
          alert("Error fetching products");
        }
      }).catch((error) => {
        alert("Error fetching products");
      });
  };

  // Lấy danh sách danh mục
  const getAllCategory = () => {
    axios.get("http://127.0.0.1:8000/api/categories")
      .then((res) => {
        if (res.data.status === 200) {
          setDataCategory(res.data.data);
        } else {
          alert("Error fetching categories");
        }
      }).catch((error) => {
        console.error("Error fetching categories", error);
      });
  };

  // Hàm tạo sản phẩm mới
  const createProduct = () => {
    axios.post("http://127.0.0.1:8000/api/products", editData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      alert(res.data.message);
      setLstProduct([res.data.data, ...lstProduct]);
      setOpenModal(false);
      getAllProduct({ id_category: 0, pageIndex: total.page_index });
    }).catch((error) => {
      alert(error.response.data.error);
    });
  };

  // Hàm cập nhật sản phẩm
  const updateProduct = () => {
    axios.put(`http://127.0.0.1:8000/api/products/${editData.id}`, editData, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      alert(res.data.message);
      setOpenModal(false);
      getAllProduct({ id_category: 0, pageIndex: total.page_index });
    }).catch((error) => {
      alert(error.response.data.error);
    });
  };

  // Hàm mở modal và chuyển chế độ edit
  const handleEditData = (id: number) => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`)
      .then((res) => {
        setEditdata(res.data.data);
        setIsEdit(true);
        setOpenModal(true);
      });
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEdit(false);
    setEditdata({ image: "", name: "", price: 0, quantity: 0, description: "", origin: "", discount: 0, status: false, category_id: 1 });
  };

  // Hàm reload lại trang
  const handleReload = () => {
    window.location.reload(); // Hoặc dùng router.reload() nếu bạn sử dụng Next.js
  };

  // Hàm thay đổi trang
  const handlePageChange = (page: number) => {
    if (page < 1 || page > total.total_page) return;
    setTotal({ ...total, page_index: page });
    getAllProduct({ id_category: 0, pageIndex: page, sort_col: "id", sortOder: "desc" });
  };

  // Phân trang
  const paginate = () => {
    const pages = [];
    for (let i = 1; i <= total.total_page; i++) {
      pages.push(i);
    }
    return pages;
  };

  const paginationButtons = paginate().map((page) => (
    <button
      key={page}
      className={`pagination-button ${page === total.page_index ? "active" : ""}`}
      onClick={() => handlePageChange(page)}
    >
      {page}
    </button>
  ));

  useEffect(() => {
    getAllProduct({ id_category: 0, pageIndex: total.page_index, sort_col: "id", sortOder: "desc" });
    getAllCategory();
  }, [total.page_index]);

  return (
    <div className="container">
      <div className="content">
        <div className="content-sub">
          <div className="one"><h2><i className="fa-solid fa-house"></i> Trang chủ admin</h2></div>
          <div className="two" onClick={() => { setOpenModal(true); setIsEdit(false); }}>+ Add</div>
        </div>
        <div className="reload-button">
          <button onClick={handleReload} className="btn-reload">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        {/* Modal Create/Edit Product */}
        {openModal && (
          <EditProductForm
            editData={editData}
            setEditdata={setEditdata}
            dataCategory={dataCategory}
            handleImageUpload={(e, setInsert, dataInsert, alert) => {}}
            updateProduct={isEdit ? updateProduct : createProduct}
            cancelProcess={handleCloseModal}
          />
        )}

        <div className="content-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Origin</th>
                <th>Discount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {lstProduct.map((product) => (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} width={100} /></td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.categories}</td>
                  <td>{product.quantity}</td>
                  <td>{product.origin}</td>
                  <td>{product.discount}</td>
                  <td>{product.description}</td>
                  <td>{product.status ? "Open" : "Hide"}</td>
                  <td>
                    <button onClick={() => handleEditData(product.id)}>
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                  </td>
                  <td>
                    <button onClick={() => lstProduct(product.id)}>
                      <i className="fa-solid fa-delete-left"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            disabled={total.page_index === 1}
            onClick={() => handlePageChange(total.page_index - 1)}
          >
            Previous
          </button>

          {paginationButtons}

          <button
            disabled={total.page_index === total.total_page}
            onClick={() => handlePageChange(total.page_index + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
