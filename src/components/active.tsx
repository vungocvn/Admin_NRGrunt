import axios from "axios";
import Cookies from "js-cookie";
import { useMemo, useState } from "react";
export default function Active() {
    const [ss, setSS] = useState<any>([]);
    const token = Cookies.get('token_cua_Ngoc') || "";

    const activeUser = () => {
        axios.post("http://127.0.0.1:8000/api/users/active/send-mail",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                alert(res.data.message)
            })
            .catch((error) => {
                alert(error.response.data.error)
            })
    }


    useMemo(() => {
        axios.get("http://127.0.0.1:8000/api/auth/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setSS(response.data.data);
            })
            .catch(error => {
                console.error("Loi khi lay thong tin profile:", error);
            });
    }, [token]);

    return (
        <>
            <div className="Active">
                <h2>Active</h2>
                {
                    ss.status === 0 && (
                        <div className="active-cover">
                            <label>Send email</label>
                            <input type="text" value={ss.email} placeholder="Email" disabled />
                            <button type="submit" className="btn1" onClick={() => activeUser()}>Active email</button>
                        </div>
                    )
                }

                {ss.status === 1 && (
                    <p>Your account has been activated!</p>
                )}

                {/* <div className="active-cover">
                     <label>New password</label>
                     <input type="password" name="" id="" placeholder="Password" />
                </div>
                <div className="active-cover">
                     <label>Cofirm password</label>
                     <input type="password" name="" id="" placeholder="Password" />
                </div> */}
                {/* <button type="submit" className="save">Save <i className="fa-regular fa-floppy-disk"></i></button> */}
            </div>
        </>
    )
}