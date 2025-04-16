import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const logout = async (router: any) => {
    const confirmLogout = window.confirm("do you want to log out?");
    if (!confirmLogout) return;

    const token = Cookies.get('token_cms') || "";

    try {
        await axios.post("http://127.0.0.1:8000/api/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error("failed logout", err);
    }
   
    Cookies.remove('token_cms');
    toast.success("logout successfully!");
    setTimeout(() => {
        router.push('/login');
    }, 1000);
};
