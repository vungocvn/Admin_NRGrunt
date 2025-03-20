import axios from 'axios';
import Cookies from 'js-cookie'; 
import { useEffect, useState } from 'react';

export default function AdminInvoices() {
  const token = Cookies.get("token_cua_Ngoc"); 
  const [users, setUsers] = useState<any>([]);
  // State để lưu danh sách hóa đơn
  const [invoices, setInvoices] = useState<any[]>([]);

  // Lấy danh sách hóa đơn từ API
  function getAllBill() {
    axios.get('http://127.0.0.1:8000/api/orders', {
      headers: { Authorization: `Bearer ${token}` } 
    })
    .then((res) => {
      setInvoices(res.data.data);
      console.log("jqk",res.data.data)
    });
  }
  function getAllUser() {
    axios.get('http://127.0.0.1:8000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setUsers(res.data.data);
    })
  }
  function formatCurrency(amount: any, currency = 'VND', locale = 'vi-VN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  function getUserName(id: number) {
    const user = users.find((user: any) => user.id === id);
    return user ? user.name : '';
   }

  // Cập nhật trạng thái hóa đơn
  // const updateStatus = (id) => {
  //   setInvoices(invoices.map(invoice => 
  //     invoice.id === id ? { ...invoice, status: 'Đã thanh toán' } : invoice
  //   ));
  // };

  // Xoá hóa đơn
  const deleteInvoice = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      getAllBill();
    })
  };
  useEffect(() => {
    getAllBill();
    getAllUser();

  }, []); // Lấy dữ liệu khi component load

  return (
    <div className="container">
      <div className="header">
        <h1>Quản lý Hóa đơn</h1>
      </div>
      <div className="invoiceList">
        <h3>Danh sách Hóa đơn</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Mã hóa đơn</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{getUserName(invoice.user_id)}</td>
                <td>{invoice.order_code}</td>
                <td>{formatCurrency(invoice.total_price)}</td>
                <td>{invoice.is_canceled==0? "Chưa hoàn thành" : "Đã hoàn thành"}</td>
                <td>{invoice.status}
                  <button 
                    // onClick={() => updatePaidStatus(invoice)} 
                    className="updateButton" > {invoice.is_paid == 1 ? "Đã thanh toán" : "Chưa thanh toán"}
                  </button>
                  <button className='deleteButton' onClick={()=>deleteInvoice(invoice.id)}>Xoá</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
