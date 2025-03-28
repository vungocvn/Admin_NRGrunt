import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const logout = async (router: any) => {
    const token = Cookies.get('token_cms') || "";

    try {
        await axios.post("http://127.0.0.1:8000/api/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error("Lỗi khi gọi logout", err);
    }

    Cookies.remove('token_cms');
    toast.success("Loggout successfully!");
    setTimeout(() => {
        router.push('/login');
    }, 1000);
};
