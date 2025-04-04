import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import EditInvoiceModal from './EditInvoiceModal';

export default function AdminInvoices() {
  const token = Cookies.get("token_cms");
  const [users, setUsers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);

  function getAllBill() {
    axios.get('http://127.0.0.1:8000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      console.log("Invoice data:", res.data.data);
      setInvoices(res.data.data);
    });
  }

  function getAllUser() {
    axios.get('http://127.0.0.1:8000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setUsers(res.data.data);
    });
  }

  function formatCurrency(amount: any, currency = 'VND', locale = 'vi-VN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  function getUserName(id: number) {
    const user = users.find((u: any) => u.id === id);
    return user ? user.name : '';
  }

  const deleteInvoice = (id: number) => {
    if (window.confirm("Bạn chắc chắn muốn xoá hoá đơn này?")) {
      axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        getAllBill();
      }).catch(() => {
        alert("Không thể xoá hoá đơn.");
      });
    }
  };

  useEffect(() => {
    getAllBill();
    getAllUser();
  }, []);

  return (
    <div className="container-pro">
      <div className="invoiceList">
        <h3>Danh sách Hóa đơn</h3>
        <div className="table-wrapper">
          <table className="table invoice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Mã HĐ</th>
                <th>Sản phẩm</th>
                <th style={{ minWidth: 100 }}>SL</th>
                <th>Tổng tiền</th>
                <th>Địa chỉ</th>
                <th>SĐT</th>
                <th colSpan={2}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td className="customer-cell">{invoice.customer_info?.name || getUserName(invoice.user_id)}</td>
                  <td className="code-cell">{invoice.order_code}</td>
                  <td className="product-cell">
                    {Array.isArray(invoice.product_names)
                      ? invoice.product_names.join(', ')
                      : 'Chưa có sản phẩm'}
                  </td>
                  <td className="quantity-cell">{invoice.total_quantity || 0}</td>
                  <td className="price-cell">{formatCurrency(invoice.final_total)}</td>
                  <td className="address-cell">{invoice.customer_info?.address ?? '—'}</td>
                  <td className="phone-cell">{invoice.customer_info?.phone ?? '—'}</td>
                  <td>
                    <button className="editButton" onClick={() => setEditingInvoice(invoice)}>
                      Sửa
                    </button>
                    <button className="deleteButton" onClick={() => deleteInvoice(invoice.id)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onUpdated={() => {
            getAllBill();
            setEditingInvoice(null);
          }}
        />
      )}
    </div>
  );
}
