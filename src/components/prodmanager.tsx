import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
}

interface Order {
  id: number;
  order_code: string;
  user_id: number;
  created_at: string;
  final_total: number;
  is_paid: number;
  is_canceled: number;
}

export default function AdminOrders() {
  const token = Cookies.get('token_cms');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.warning('You must log in to access this page.');
      router.push('/login');
    }
  }, []);

  const getAllOrders = (status: string = 'all') => {
    const params: any = {};
    if (status === 'done') {
      params.is_paid = 1;
      params.is_canceled = 0;
    } else if (status === 'confirm') {
      params.is_paid = 0;
      params.is_canceled = 0;
    } else if (status === 'cancel') {
      params.is_canceled = 1;
    }
    axios
      .get('http://127.0.0.1:8000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch(() => {
        console.error('error get order');
      });
  };

  const getAllUser = () => {
    axios
      .get('http://127.0.0.1:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.data);
      });
  };

  const formatCurrency = (amount: number, currency = 'VND', locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const deleteOrder = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success('Xoá đơn hàng thành công!');
        getAllOrders(filterStatus);
      })
      .catch(() => {
        toast.error('Lỗi khi xoá đơn hàng!');
      });
  };

  const updateStatus = (id: number, statusValue: string) => {
    const data =
      statusValue === 'done'
        ? { is_paid: 1, is_canceled: 0 }
        : statusValue === 'cancel'
        ? { is_paid: 0, is_canceled: 1 }
        : { is_paid: 0, is_canceled: 0 };

    axios
      .put(`http://127.0.0.1:8000/api/orders/${id}`, { ...data, role: 'Admin' }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success('Cập nhật trạng thái thành công!');
        setTimeout(() => {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === id ? { ...order, is_paid: data.is_paid, is_canceled: data.is_canceled } : order
            )
          );
        }, 300);
      })
      .catch(() => {
        toast.error('Lỗi khi cập nhật trạng thái.');
      });
  };

  useEffect(() => {
    getAllOrders(filterStatus);
    getAllUser();
  }, [filterStatus]);

  const getUserName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : '';
  };

  const getStatusBadge = (order: Order) => {
    if (order.is_canceled) return <span className="status canceled">Đã huỷ</span>;
    if (order.is_paid) return <span className="status done">Hoàn thành</span>;
    return <span className="status confirm">Xác nhận</span>;
  };

  const handleOpenConfirmModal = (order: Order) => {
    setOrderToDelete(order);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOrderToDelete(null);
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      handleCloseConfirmModal();
    }
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
            <option value="cancel">Đã huỷ</option>
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
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_code}</td>
                <td>{getUserName(order.user_id)}</td>
                <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                <td>{formatCurrency(order.final_total)}</td>
                <td>{getStatusBadge(order)}</td>
                <td>
                  <select
                    value={order.is_canceled ? 'cancel' : order.is_paid ? 'done' : 'confirm'}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="confirm">Xác nhận đơn</option>
                    <option value="done">Đã hoàn thành</option>
                    <option value="cancel">Đã huỷ</option>
                  </select>
                  <button onClick={() => handleOpenConfirmModal(order)} className="deleteButton">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && orderToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Bạn có chắc chắn muốn xoá đơn hàng <strong>{orderToDelete.order_code}</strong> không?</p>
            <div className="modal-actions">
              <button onClick={handleCloseConfirmModal} className="cancel">Huỷ</button>
              <button onClick={handleConfirmDelete} className="confirm">Xoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
