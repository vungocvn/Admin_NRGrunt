'use client'
import axios from "axios"
import { create } from "domain";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';

export default function Admin() {
    const [openView, setOpen] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const router = useRouter();
    const [selectCategory, setSelectCategory] = useState(null);
    const [lstProduct, setLstProduct] = useState<any>([])
    const [lstCategory, setLstCategory] = useState<any>([])
    const [total,setTotal] = useState({
        total_item:0,
        total_page:1,
        page_size:5,
        page_index:1

    })
    
    function getAllProduct({ id_category, sortOder, sort_col, pageIndex }: { id_category?: number; sortOder?: string; sort_col?: string; pageIndex?: number }) {
        setLstProduct([]);
        try {
            axios
                .get("http://127.0.0.1:8000/api/products", { params: { page: pageIndex || total.page_index, page_size: total.page_size, id_category: id_category, sort_order: sortOder, sort_col } })
                .then((res) => {
                    if (res.data.status === 200) {
                       setTotal({ ...total, page_index: pageIndex || total.page_index, total_page: res.data.data.total_pages, total_item: res.data.data.total_items });
                        setLstProduct(res.data.data.items);
                    } else {
                        alert("Sign up error, please try again!");
                    }
                   
                })
                .catch((error) => {
                    alert("Sign up error, please try again!");
                });
        } catch (e) {
            console.log(e);
        } finally {
         
        }

    }
    function getAllCategory() {

        axios.get("http://127.0.0.1:8000/api/categories")
            .then((res) => {
                if (res.data.status === 200) {
                    console.log(res.data.data)
                    setLstCategory(res.data.data)
                } else {
                    alert("Sign up error, please try again!")
                }
            })
            .catch((error) => {
                console.error("Error in sign up", error);
            });
    }
    const dfData = {
        name: "",
        price: 0,
        quantity: 0,
        description: "",
        origin: "",
        discount: 0,
        status: false,
        category_id: 1,
    }

    const [editData, setEditdata] = useState(dfData);

    const cancelProcess = () => {
        setIsEdit(false);
        setEditdata(dfData);
    }
    const [dataInsert, setInsert] = useState(dfData);
    const [dataProduct, setDataProduct] = useState([])
    const [dataCategory, setDataCategory] = useState<any>([])

    const token: string = Cookies.get('token_cua_Ngoc') || "";
    // const fetchDataProduct = async () => {
    //     const productsRes = await axios.get("http://127.0.0.1:8000/api/products");
    //     setDataProduct(productsRes.data.data.items);
    // }

    const fetchCategory = async () => {
        const categoryRes = await axios.get("http://127.0.0.1:8000/api/categories");
        setDataCategory(categoryRes.data.data);
    }

    const createProduct = () => {
        axios.post("http://127.0.0.1:8000/api/products", dataInsert
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                alert(res.data.message);
                getAllProduct({})
                // fetchDataProduct();
                // router.push('/shop.tsx')
            }).catch((error) => {
                alert(error.response.data.error);
            })
    }
    const deleteProduct = (id: number) => {
        if (window.confirm("")) {
            axios.delete(`http://127.0.0.1:8000/api/products/${id}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
                .then((res) => {
                    alert(res.data.message);
                    getAllProduct({})
                }).catch((error) => {
                    alert(error.response.data.error);
                })
        }
    }
    const handleEditData = (id: number) => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}`)
            .then((res) => {
                setEditdata(res.data.data);
                setIsEdit(true);
            })

    }
    const updateProduct = () => {
        axios.put(`http://127.0.0.1:8000/api/products/${editData.id}`, editData
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                alert(res.data.message);
                getAllProduct({})
            }).catch((error) => {
                alert(error.response.data.error);
            })
    }

    useEffect(() => {
        getAllProduct({})
        getAllCategory()
        fetchCategory()
        axios.post("http://127.0.0.1:8000/api/auth/check-auth",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                if (!res.data.data) {
                    router.push('/login')
                }
            }).catch((err) => {
                alert("vui lòng đăng nhập")
            })
    }, [])

    const handleEdit = (item: any) => {
        setIsEdit(true);
        setEditdata(item);
    }
   const onNextPage=() => {
        if (total.page_index < total.total_page) {
           
            const newPageIndex = total.page_index + 1;
           setTotal({ ...total, page_index: newPageIndex });
            setTimeout(() => {
                getAllProduct({ id_category: selectCategory ?? undefined, pageIndex: newPageIndex });
            }, 300);
        }
    }
   const onPrevPage=() => {
        if (total.page_index  > 1) {
         
            const newPageIndex = total.page_index  - 1;
            setTotal({ ...total, page_index : newPageIndex });
            setTimeout(() => {
                getAllProduct({ id_category: selectCategory ?? undefined, pageIndex: newPageIndex });
            }, 300);
        }
    }
    return (
        <>
            <div className="container">

                <div className="content">
                    <div className="content-sub">
                        <div className="one"><h2><i className="fa-solid fa-house"></i> Trang chủ admin</h2></div>
                        <div className="two" onClick={() => setOpen(true)}>+ Add</div>
                    </div>

                    {isEdit && editData && (

                        <div className="content-form-1">
                            <h2>Edit Product</h2>
                            <div className="form-sub">
                                <label >Name Product</label>
                                <input type="text" placeholder="Enter name" onChange={(e) => setEditdata({ ...editData, name: e.target.value })} value={editData.name} />
                            </div>
                            <div className="form-sub">
                                <label >Price</label>
                                <input type="text" placeholder="Enter price" onChange={(e) => setEditdata({ ...editData, price: Number(e.target.value) })} value={editData.price} />
                            </div>
                            <div className="form-sub">
                                <label >Quantity</label>
                                <input type="text" placeholder="Enter quantity" onChange={(e) => setEditdata({ ...editData, quantity: Number(e.target.value) })} value={editData.quantity} />
                            </div>
                            <div className="form-sub">
                                <label >Origin</label>
                                <input type="text" placeholder="Enter quantity" onChange={(e) => setEditdata({ ...editData, origin: e.target.value })} value={editData.origin} />
                            </div>
                            <div className="form-1">
                                <label >Status</label>
                                <input type="checkbox" name="interests" value="sports" onChange={(e) => setEditdata({ ...editData, status: e.target.checked })} checked={editData.status} />
                            </div>
                            <div className="form-sub">
                                <label >Discount</label>
                                <input type="text" placeholder="" onChange={(e) => setEditdata({ ...editData, discount: Number(e.target.value) })} value={editData.discount} />
                            </div>
                            <div className="form-sub">
                                <label >Description</label>
                                <input type="text" placeholder="" onChange={(e) => setEditdata({ ...editData, description: e.target.value })} value={editData.description} />
                            </div>
                            <div className="form-1">
                                <label >Category</label>
                                <select defaultValue={0} onChange={(e) => setEditdata({ ...editData, category_id: Number(e.target.value) })} value={editData.category_id}>
                                    <option value={0}>Choose category</option>
                                    {
                                        dataCategory.map((item: any) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="update">
                                <button type="button" className="btn-update" onClick={() => updateProduct()}><i className="fa-regular fa-floppy-disk"></i></button>
                                <button type="button" className="btn-cancel" onClick={cancelProcess}><i className="fa-solid fa-xmark"></i></button>
                            </div>

                        </div>
                    )}

                    {
                        openView && (<div className="content-form">
                            <h2>Manager Product</h2>
                            <div className="form-sub">
                                <label >Name Product</label>
                                <input type="text" placeholder="Enter name" onChange={(e) => setInsert({ ...dataInsert, name: e.target.value })} value={dataInsert.name} />
                            </div>

                            <div className="form-sub">
                                <label >Price</label>
                                <input type="number" placeholder="Enter price" onChange={(e) => setInsert({ ...dataInsert, price: Number(e.target.value) })} value={dataInsert.price} />
                            </div>
                            <div className="form-sub">
                                <label >Quantity</label>
                                <input type="text" placeholder="Enter quantity" onChange={(e) => setInsert({ ...dataInsert, quantity: Number(e.target.value) })} value={dataInsert.quantity} />
                            </div>
                            <div className="form-sub">
                                <label >Origin</label>
                                <input type="text" placeholder="Enter quantity" onChange={(e) => setInsert({ ...dataInsert, origin: e.target.value })} value={dataInsert.origin} />
                            </div>
                            <div className="form-sub">
                                <label >Discount</label>
                                <input
                                    type="number"
                                    placeholder="Enter discount"
                                    onChange={(e) =>
                                        setInsert({ ...dataInsert, discount: Number(e.target.value) / 100 })
                                    }
                                    value={dataInsert.discount * 100}
                                />

                            </div>
                            <div className="form-sub">
                                <label >Description</label>
                                <input type="text" placeholder="Enter description" onChange={(e) => setInsert({ ...dataInsert, description: e.target.value })} value={dataInsert.description} />
                            </div>
                            <div className="form-1">
                                <label >Status</label>
                                <input type="checkbox" checked={dataInsert.status} onChange={(e) => setInsert({ ...dataInsert, status: e.target.checked })} />
                            </div>
                            <div className="form-1">
                                <label >Category</label>
                                <select onChange={(e) => setInsert({ ...dataInsert, category_id: Number(e.target.value) })} value={dataInsert.category_id}>
                                    {dataCategory && dataCategory.map((item: any) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn" onClick={createProduct}><i className="fa-regular fa-floppy-disk"></i></button>
                            <button type="button" className="btn-2" onClick={() => setOpen(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>)
                    }

                </div>
                <div className="search-list">
                    <div className="search-name">
                        <input type="text" placeholder="Tìm kiếm danh sách theo tên" />
                        <button className="search-quantity">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>

                    </div>

            <div className="pagination">
                <button onClick={onPrevPage}><i className="pagination-one fa-solid fa-angle-left"></i></button>
                <span>{total.page_index + '/' + total.total_page }</span>
                <button onClick={onNextPage}><i className="pagination-one fa-solid fa-angle-right"></i></button>
            </div>

                </div>
                <div className="content-table">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Origin</th>
                                <th>Discount</th>
                                <th>Description</th>
                                <th>Action</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lstProduct.length > 0 && lstProduct?.map((item: any) => (
                                <tr key={item.id}>

                                    <td>{item.name}</td>
                                    <td>{item.status ? "Open" : "Hide"}</td>
                                    <td>{item.price}</td>
                                    <td></td>
                                    <td>{item.quantity}</td>
                                    <td>{item.origin}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <button type="button" className="btn-update" onClick={() => handleEditData(item.id)}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        
                                    </td>
                                    <td>
                                       <button type="button" className="btn-delete" onClick={() => deleteProduct(item.id)}>
                                            <i className="fa-solid fa-delete-left"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!lstProduct && (
                                <tr>
                                    <td>No product</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             
            </div>
        </>
    )
}