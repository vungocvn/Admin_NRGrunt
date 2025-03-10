import axios from "axios";
import Link from "next/link";
import { useMemo, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Login() {
    interface dataLogin {
        email: string;
        password: string;
        role : string
    }
    const router = useRouter();
    const dfLogin: dataLogin = {
        email: "",
        password: "",
        role : "Admin"
    }
    const [login, setLogin] = useState<dataLogin>(dfLogin)
    const handleLogin = () => {
       axios.post("http://127.0.0.1:8000/api/auth/login", login)
            .then((res) => {
                if (res.data.status === 200) {
                    const access_token: string = res.data.data.access_token
                    Cookies.set('token_cua_Ngoc', access_token, { expires: 1 })
                    if(res.data.data.role === "CEO"){
                        router.push('/manager')
                        return alert('login success')
                    }
                    if(res.data.data.role === "Admin"){
                        router.push('/admin')
                        return alert('login success')
                    } 
                    return alert('not permission')
                }
                else if (res.data.status === 403) {
                    alert(res.data.message)
                } else {
                    alert("login thất bại")
                }
            }).catch((error) => {
                if (error.response.status === 403) {
                    alert(error.response.data.error)
                } else {
                    alert("login thất bại")

                }
            })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLogin({
            ...login,
            [name]: value
        });
    };

    useMemo(() => {
        const token: string = Cookies.get('token_cua_Ngoc') || "";
        axios.post("http://127.0.0.1:8000/api/auth/check-auth", 
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                if (res.data.data) {
                    if(res.data.data.role === "CEO"){
                        router.push('/manage')
                        return alert('you are CEO')
                    }
                    if(res.data.data.role === "Admin"){
                        router.push('/admin')
                        return alert('you are Admin')
                    } 
                    return alert("not permission")
                } else {
                    alert("vui lòng đăng nhập")
                }
            }).catch(() => {
                alert("vui lòng đăng nhập")
            })
    }, [router])
    return (
        <> 
          <div className="login-container">
                <div className="login-image"> </div>
              <div className="login-form">
                    <h2>Login</h2>
                    <div className="form-name">
                        <label>Email</label>
                        <input type="email" placeholder="Enter email" value={login.email}
                            onChange={handleChange} name="email" />
                    </div>
                    <div className="form-name">
                        <label>Password</label>
                        <input type="password" placeholder="Enter passwword" value={login.password}
                            onChange={handleChange} name="password" />
                    </div>
                    <button type="submit" className="button-login" onClick={() => {
                        handleLogin()
                    }}>Sign in</button>
                    <p>{"Don't have an account?"} <Link href="./register" className="i">Sign up</Link></p>
                </div>

          </div>
        
        </>
    )
}