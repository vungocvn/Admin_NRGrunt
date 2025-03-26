"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
export default function Update(){
    const [profile, setProfile] = useState<any>(null);
    const [loading , setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token_cms') || ""; 

        if (token) {
            axios.get("http://127.0.0.1:8000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                if(response.data.data === null || !response.data.data) {
                    alert("vui lòng đăng nhập lại")
                    setTimeout(()=>{
                       router.push('/login')
                    },2000)
                    return
                }
                setProfile(response.data.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy thông tin profile:", error);
            });
        } else {
            alert("vui lòng đăng nhập lại")
            setTimeout(()=>{
               router.push('/login')
            },2000)
            return
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name , value} = e.target;
        setProfile({...profile,[name]:value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setProfile({...profile, avatar:e.target.files[0]});
        }
    }
    const handleSubmit = async (e: React.FocusEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = Cookies.get("token_cms") || "";
        if(!token) {
            alert("Please login ")
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("name", profile.name);
        formData.append("email", profile.email);
        if (profile.avatar instanceof File) {
            formData.append("avatar", profile.avatar);
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/update-profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Cập nhật thành công!");
            setProfile(response.data.data);
        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
            alert("Cập nhật thất bại, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
      };
      return (
        <div className="container3">
            <h2>Update profile</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={profile.name} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                </label>
                <label>
                    Avata:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                {profile.avatar && (
                    <img
                        src={profile.avatar instanceof File ? URL.createObjectURL(profile.avatar) : profile.avatar}
                        alt="Avatar"
                        width={100}
                    />
                )}
                <button type="submit" disabled={loading}>
                    {loading ? "Updateting..." : "update"}
                </button>
            </form>
        </div>
    );
}
