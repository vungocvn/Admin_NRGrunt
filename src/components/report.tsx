import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import router from "next/router";

export default function RevenueReport() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("token_cms");
    if (!token) {
        router.push("/login"); 
        return;
      }
    axios.get("http://127.0.0.1:8000/api/sale-reports", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.status === 200) {
          setTotalRevenue(res.data.total_revenue);
          if (res.data.total_orders) {
            setOrderCount(res.data.total_orders);
          }
        }
      })
      .catch(err => {
        console.error("Failed to load revenue", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: any, currency = 'VND', locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };;

  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-[#01ab78] mb-4">
          📊 Tổng Doanh Thu
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <>
            <p className="text-3xl font-bold text-center text-[#01ab78]">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-center text-gray-600 mt-2">
              Tổng số đơn hàng: <span className="font-medium text-black">{orderCount}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}