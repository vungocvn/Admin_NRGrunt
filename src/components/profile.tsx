"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const router = useRouter();

    const logout = () =>{
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
        const token = Cookies.get('token_cms') || "";

        if (token) {
            axios.get("http://127.0.0.1:8000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data.status === 401) {
                        alert("vui lòng đăng nhập lại")
                        setTimeout(() => {
                            router.push('/login')
                        }, 2000)
                        return
                    }else{
                        setProfile(response.data.data);
                    }
                })
                .catch(error => {
                    alert("vui lòng đăng nhập lại")
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                    return
                });
        } else {
            alert("vui lòng đăng nhập lại")
            setTimeout(() => {
                router.push('/login')
            }, 2000)
            return
        }
    }, []);

    return (
        <div className="container-3">
            <>
                {profile ? (
                    <>
                        <p>{profile.name}</p>
                        <p>{profile.email}</p>
                        <img src={profile.avatar} alt="avatar" />
                        <button onClick={()=>{
                            logout()
                        }}> logout  </button>

                    </>
                ) : "Đang tải thông tin..."}
              {/* <div className="form-profile">
                <form action="">
                    <h2>Update Profile</h2>
                    <div className="up-pro">
                        <label htmlFor="">Name</label>
                        <input type="text" name="" id="" />   
                    </div>
                    <div className="up-pro">
                        <label htmlFor="">Email</label>
                        <input type="text" name="" id="" />   
                    </div>
                    <div className="up-pro">
                        <label htmlFor="">Avata</label>
                        <input type="file" name="" id="" /> 
                    </div> 
                    <button type="submit">Update</button>
                </form>
            </div> */}
            </>
        </div>
       
    )
}