import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
interface Props {
  invoice: any;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditInvoiceModal({ invoice, onClose, onUpdated }: Props) {
  const token = Cookies.get("token_cms");

  const [name, setName] = useState(invoice.receiver_name || invoice.user?.name || '');
  const [phone, setPhone] = useState(invoice.receiver_phone || invoice.user?.phone || '');
  const [address, setAddress] = useState(invoice.receiver_address || invoice.user?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !phone || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  
    setLoading(true);
  
    try {
      await axios.put(`http://127.0.0.1:8000/api/orders/${invoice.id}`, {
        receiver_name: name,
        receiver_phone: phone,
        receiver_address: address,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      toast.success("Invoice updated successfully!");
      setTimeout(() => {
        onUpdated();  
        onClose();    
      }, 300);
    } catch (error) {
      toast.error("Error updating invoice!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ color: "#01ab78", marginBottom: "16px", textAlign: "center" }}>
          Sửa thông tin hóa đơn
        </h3>

        <div className="modal-field">
          <label>Tên khách hàng</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên khách hàng"
          />
        </div>

        <div className="modal-field">
          <label>Số điện thoại</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="modal-field">
          <label>Địa chỉ</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>Huỷ</button>
          <button onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
