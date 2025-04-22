import React from "react";
interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ open, onClose, onConfirm }: LogoutModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold text-[#01ab78] mb-3">Xác nhận đăng xuất</h2>
        <p className="text-gray-700">Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#01ab78] text-white rounded hover:opacity-90"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
