import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Forgot() {
    const [email, sEtEmail] = useState("")
    const requestForgotPassword = () => {
        axios.post("http://127.0.0.1:8000/api/auth/request-forgot-password", {email: email})
            .then((res) => {
                alert(res.data.message)
                toast.success("Check your email to reset password")
                sEtEmail("");
            })
            .catch((error) => {
                alert(error.response.data.error)
                toast.error("An error occurred while sending the email.")
            })
    }
    return (
        <>
        <div className="forgot-cover-1">
            <h2>Forgot password</h2>
            <div className="forgot-cover">
                <label>Send email</label>
                <input type="text" onChange={(e) => sEtEmail(e.target.value)} value={email} placeholder="Email" />
                <button type="submit" onClick={()=>{
                    requestForgotPassword()
                }} className="btn11">Send email</button>
            </div>
            <ToastContainer position="top-right" autoClose={2500} />
        </div>
        </>
    )
}