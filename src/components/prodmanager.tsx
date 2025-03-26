import axios from 'axios';
import { use, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AdminOrders() {
  const token = Cookies.get("token_cms");
  const [users, setUsers] = useState<any>([]);
  const [orders, setOrders] = useState<any>([]);
  function getAllCart() {
    axios.get('http://127.0.0.1:8000/api/carts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setOrders(res.data.data);
    })
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

  const deleteOrder = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/carts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      getAllCart();
    })
  };
  useEffect(() => {
    getAllCart();
    getAllUser();
  }, []);
 function getUserName(id: number) {
  const user = users.find((user: any) => user.id === id);
  return user ? user.name : '';
 }
  return (
    <div className="container">
      <div className="orderList">
        <h3>Danh sách Đơn hàng</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr key={order.id}>
                <td>{getUserName(order.user_id)}</td>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>{formatCurrency(order.price * order.quantity)}</td>
                <td>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="deleteButton">
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
