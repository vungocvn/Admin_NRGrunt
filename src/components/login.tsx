import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for Toastify

export default function Login() {
    interface dataLogin {
        email: string;
        password: string;
        role: string;
    }
    const router = useRouter();
    const dfLogin: dataLogin = {
        email: "",
        password: "",
        role: "Admin"
    };
    const [login, setLogin] = useState<dataLogin>(dfLogin);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    // Hàm login
    const handleLogin = () => {
        axios.post("http://127.0.0.1:8000/api/auth/login", login)
            .then((res) => {
                if (res.data.status === 200) {
                    const access_token: string = res.data.data.access_token;
                    Cookies.set('token_cms', access_token, { expires: 1 });
                    toast.success('login successfully!'); 
                    setTimeout(() => {
                        if (res.data.data.role === "Admin") {
                            router.push('/admin');
                            setIsAuthenticated(true);
                            return;
                        }
                        toast.error('Not permission');
                    }, 2000);
                } else if (res.data.status === 403) {
                    toast.error(res.data.message);
                } else {
                    toast.error("Incorrect login information, please log in again.");
                }
            }).catch((error) => {
                if (error.response.status === 403) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("Incorrect login information, please log in again.");
                }
            });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogin({
            ...login,
            [name]: value
        });
    };

    // Kiểm tra token khi người dùng đã đăng nhập
    useEffect(() => {
        const token: string = Cookies.get('token_cms') || "";
        if (token && !isAuthenticated) {  // Kiểm tra token và trạng thái xác thực
            axios.post("http://127.0.0.1:8000/api/auth/check-auth", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.data.data) {
                        // if (res.data.data.role === "CEO") {
                        //     router.push('/manager');
                        //     toast.success('You are CEO');
                        //     setIsAuthenticated(true);
                        //     return;
                        // }
                        if (res.data.data.role === "Admin") {
                            router.push('/admin');
                            toast.success('You are Admin');
                            setIsAuthenticated(true);
                            return;
                        }
                        toast.error("Not permission");
                    } else {
                        toast.error("Please login");
                    }
                }).catch(() => {
                    toast.error("Please login");
                });
        }
    }, [router, isAuthenticated]); 

    return (
        <>
          <div className="login-container">
            <div className="login-image"> </div>
            <div className="login-form">
              <h2>Login</h2>
      
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin(); 
                }}
              >
                <div className="form-name">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={login.email}
                    onChange={handleChange}
                    name="email"
                    required
                  />
                </div>
      
                <div className="form-name">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={login.password}
                    onChange={handleChange}
                    name="password"
                    required
                  />
                </div>
      
                <button type="submit" className="button-login">
                  Sign in
                </button>
              </form>
      
              <p>
                {"Don't have an account?"}{" "}
                <Link href="./register" className="i">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={5000} />
        </>
      );
      
}
