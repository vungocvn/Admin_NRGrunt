"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Register() {

    const router = useRouter();
    const dfRegister: any = {
        name: "",
        email: "",
        password: ""
    }
    const [register, setRegister] = useState(dfRegister)

    const handleRegister = () => {
        axios.post("http://127.0.0.1:8000/api/users/register", register)
            .then((res) => {
                if (res.data.status === 200 || res.data.status === 201) {
                    const access_token: string = res.data.token;
                    Cookies.set('token_cms', access_token, { expires: 1 });
                    alert("Sign up successfully!")
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000)
                } else {
                    alert("Sign up error, please sign up!")
                }
            }).catch((error) => {
                console.error("error sign up", error);
            });
    }

    useEffect(() => {
        const token = Cookies.get('token_cua_ngoc') || "";

        if (token && token !== "") {
            axios.post("http://127.0.0.1:8000/api/auth/check-auth",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    if (response.data.status === 200) {
                        router.push("/profile")
                    }
                })
                .catch(error => {
                    alert(error)
                });
        }
    }, [router]);

    return (
        <>
            <div className="register-from">
                <h2>Create an Account</h2>
                <div className="register-form-sub">
                    <label><i className="fa-solid fa-user"></i> Name</label>
                    <input 
                        type="text" 
                        placeholder="Enter name" 
                        value={register.name} 
                        onChange={(e) => setRegister({ ...register, name: e.target.value })} 
                        name="name" 
                    />
                </div>
                <div className="register-form-sub">
                    <label><i className="fa-regular fa-envelope"></i>  Email</label>
                    <input 
                        type="text" 
                        placeholder="Enter email" 
                        value={register.email} 
                        onChange={(e) => setRegister({ ...register, email: e.target.value })} 
                        name="email" 
                    />
                </div>
                <div className="register-form-sub">
                    <label> <i className="fa-solid fa-lock"></i> Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={register.password} 
                        onChange={(e) => setRegister({ ...register, password: e.target.value })} 
                        name="password" 
                    />
                </div>
                <button type="submit" className="btn-register" onClick={handleRegister}>Sign up</button>
                <p>Already have Account?  <Link href="./login">Login</Link></p>
            </div>
        </>
    )
}
