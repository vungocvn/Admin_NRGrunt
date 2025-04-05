import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AdminOrders() {
  const token = Cookies.get("token_cms");
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getAllOrders = (status: string = 'all') => {
    const params: any = {};
    if (status === 'done') params.is_paid = 1;
    else if (status === 'confirm') params.is_paid = 0;

    axios.get('http://127.0.0.1:8000/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
      params: params
    }).then((res) => {
      setOrders(res.data.data);
    }).catch((err) => {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    });
  };

  const getAllUser = () => {
    axios.get('http://127.0.0.1:8000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setUsers(res.data.data);
    });
  };

  const formatCurrency = (amount: any, currency = 'VND', locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const deleteOrder = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      getAllOrders(filterStatus);
    }).catch(() => {
      alert("Không thể xoá đơn hàng.");
    });
  };

  const updateStatus = (id: number, newStatus: string) => {
    const is_paid = newStatus === 'done' ? 1 : 0;
    axios.put(`http://127.0.0.1:8000/api/orders/${id}`, {
      is_paid,
      role: 'Admin',
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      getAllOrders(filterStatus);
    }).catch((err) => {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái đơn hàng.");
    });
  };

  useEffect(() => {
    getAllOrders(filterStatus);
    getAllUser();
  }, [filterStatus]);

  const getUserName = (id: number) => {
    const user = users.find((user: any) => user.id === id);
    return user ? user.name : '';
  };

  return (
    <div className="container">
      <div className="orderList">
        <h3>Danh sách Đơn hàng</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 8 }}>Lọc theo trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="confirm">Xác nhận đơn</option>
            <option value="done">Đã hoàn thành</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_code}</td>
                <td>{getUserName(order.user_id)}</td>
                <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                <td>{formatCurrency(order.final_total)}</td>
                <td>
                  <select
                    value={order.is_paid ? 'done' : 'confirm'}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="confirm">Xác nhận đơn</option>
                    <option value="done">Đã hoàn thành</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => {
                      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá đơn hàng này không?");
                      if (confirmDelete) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="deleteButton" >
                    Xoá
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
