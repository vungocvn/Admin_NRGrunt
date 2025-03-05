import axios from "axios"
import { useMemo, useState } from "react"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
export default function Management() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [role, setROLE] = useState("");

    const getUsers = () => {
        axios.get('http://127.0.0.1:8000/api/users',
            { headers: { Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}` } })
            .then((res) => {
                setUsers(res.data.data)
            }).catch(() => {
                router.push('/admin')
            })
    }

    const changeRole = (id: number) => {
        axios.put(
            `http://127.0.0.1:8000/api/users/${id}/role`,
            { role: role },
            { headers: { Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}` } }
        )
            .then(() => {
                alert("change role success");
                getUsers()
            }).catch((error) => {
                alert(error.response.data.error);
            })
    }

    useMemo(() => {
        axios.post('http://127.0.0.1:8000/api/auth/check-auth',
            {},
            { headers: { Authorization: `Bearer ${Cookies.get('token_cua_Ngoc')}` } }
        )
            .then((res) => {
                if (res.data.data.role !== "CEO") {
                    alert("you cannot access this page")
                    setTimeout(() => {
                        router.push('/admin')
                    }, 1000)
                } else {
                    getUsers()
                }
            }).catch((err) => {
                alert(err.response.data.error)
                router.push('/admin')
            })

    }, [router])
    return (
        <div className="table-container">
            <table id="userTable">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.email}</td>
                                <td><img src={user.avatar} alt="avatar" /></td>
                                <td>{user.name}</td>
                                <td>
                                    <select onChange={(e) => setROLE(e.target.value)}>
                                        <option value={user.role} disabled selected>
                                            {user.role}
                                        </option>
                                        <option value="Admin" >Admin</option>
                                        <option value="Customer" >Customer</option>
                                    </select>
                                    <button className="edit-btn" onClick={() => changeRole(user.id)}>Save</button>
                                </td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    {user.status === 1 && (<button className="edit-btn"> Actived </button>)}
                                    {user.status === 0 && (<button className="delete-btn"> No active </button>)}
                                    {user.status === 2 && (<button className="delete-btn">Blocked </button>)}
                                </td>
                            </tr>
                        ))

                    }
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5}>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}