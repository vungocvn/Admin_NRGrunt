'use client'
import axios from "axios"
import Link from "next/link"
import {  useEffect, useState } from "react"
import Cookies from "js-cookie"
import router from "next/router"
export default function Menu() {
    const [showMenu, setShowMenu] = useState<boolean>(true);
    const token = Cookies.get('token_cms');

    const checkAuth = () => {
        if (token && token !== "") {
            axios.post("http://127.0.0.1:8000/api/auth/check-auth",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => {
                    console.log("API response:", res.data);

                    if (res.data.status === 200 && (res.data.data.role === "Admin" || res.data.data.role === "CEO")) {
                        setShowMenu(true);
                    } else {
                        alert("you not have permission! pls try login by admin account")
                        setShowMenu(false);
                    }
                })
                .catch(error => {
                    alert(error.response.data.error);
                });
        }
    }
    const logout = () =>{
        console.log("logout");
        const token = Cookies.get('token_cms') || "";

        axios.post("http://127.0.0.1:8000/api/auth/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((res)=>{
            Cookies.remove('token_cms');
            alert("logout thành công")
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        })
    }
    useEffect(() => {
      checkAuth()
    }, [token]);

    console.log("showMenu sau khi gọi setShowMenu:", showMenu);
    return (
        <div className="silder">
            {/* <div className="silder-menu">
                <div className="menu-ul">
                    <ul>
                        {!showMenu ? (
                            <li>
                                <Link href="/login">Login</Link>
                            </li>
                        ) : (
                            <>
                                <li><Link href="/manager">Manager</Link></li>
                                <li><Link href="/authentication">Authenticate</Link></li>
                                <li><Link href="/profile">Profile</Link></li>
                                <li><Link href="/admin">Admin</Link></li>
                               
                            </>
                            
                        )}
                    </ul>
                    <button  onClick={()=>{
                            logout()
                        }}>Logout</button>
                </div>
            </div> */}
        </div>
    )
}