import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { api } from "../config/apiUrl";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Management() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [role, setROLE] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const token = Cookies.get("token_cms");

    useEffect(() => {
        if (!token) {
            toast.warning("You must log in to access this page.");
            router.push("/login");
        }
    }, []);

    const getUsers = () => {
        axios.get(`${api.getUsers}`, {
            headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
        })
            .then(res => setUsers(res.data.data))
            .catch(() => router.push("/admin"));
    };

    const changeRole = (id: number) => {
        if (!role) return alert("Please select a role.");
        axios.put(`${api.changeUserRole}/${id}/role`, { role }, {
            headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
        })
            .then(() => {
                toast.success("Change role success");
                setTimeout(() => {
                    getUsers();
                }, 500);
            })
            .catch((error) => alert(error.response.data.error));
    };

    const saveUserChanges = (id: number) => {
        const body: any = {
            name: userName,
            email: userEmail,
            role,
        };
        if (userPassword.trim()) {
            body.password = userPassword;
        }

        axios.put(`${api.updateUser}/${id}`, body, {
            headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
        })
            .then(() => {
                toast.success("User updated successfully!", {
                    toastId: `update-${id}-${Date.now()}`
                });
                setTimeout(() => {
                    getUsers();
                    setEditingUser(null);
                    setUserPassword("");
                }, 500);
            })
            .catch((error) => alert(error.response.data.error));
    };

    const createUser = () => {
        axios.post(`${api.createUser}`, {
            name: userName,
            email: userEmail,
            password: userPassword,
            role,
        }, {
            headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
        })
            .then(() => {
                toast.success("User created!");
                setTimeout(() => {
                    setShowCreateModal(false);
                    setUserName("");
                    setUserEmail("");
                    setUserPassword("");
                    setROLE("");
                    getUsers();
                }, 500);
            })
            .catch((error) => alert(error.response.data.error));
    };

    const deleteUser = (id: number) => {
        axios.delete(`${api.deleteUser}/${id}`, {
            headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
        })
            .then(() => {
                toast.success("User deleted!");
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                    getUsers();
                }, 500);
            })
            .catch((error) => alert(error.response.data.error));
    };

    useMemo(() => {
        axios.post(`http://127.0.0.1:8000/api/auth/check-auth`, {}, {
            headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
        })
            .then((res) => {
                if (res.data.data.role !== "Admin") {
                    toast.error("You cannot access this page.");
                    setTimeout(() => router.push("/admin"), 1000);
                } else getUsers();
            })
            .catch((err) => {
                toast.error(err.response.data.error);
                router.push("/admin");
            });
    }, [router]);

    return (
        <div className="management-container" style={{ marginTop: "56px" }}>
            <div className="header">
                <h2>Quản lý người dùng</h2>
                <button className="primary-btn" onClick={() => setShowCreateModal(true)}>+ Thêm người dùng</button>
            </div>

            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td><img src={user.avatar} alt="avatar" className="avatar" /></td>
                                <td>{user.name}</td>
                                <td>******</td>
                                <td>
                                    <select onChange={(e) => setROLE(e.target.value)} defaultValue={user.role}>
                                        <option value={user.role} disabled>{user.role}</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Customer">Customer</option>
                                    </select>
                                    <button className="action-btn" onClick={() => changeRole(user.id)}>Lưu</button>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn" onClick={() => {
                                            setEditingUser(user);
                                            setUserName(user.name);
                                            setUserEmail(user.email);
                                            setUserPassword("");
                                            setROLE(user.role);
                                        }}>Sửa</button>
                                        <button className="danger-btn" onClick={() => {
                                            setUserToDelete(user);
                                            setShowDeleteModal(true);
                                        }}>Xoá</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={6}>Không có người dùng nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingUser && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Chỉnh sửa người dùng</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            saveUserChanges(editingUser.id);
                        }}>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tên" />
                            <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email" />
                            <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Mật khẩu (bỏ trống nếu không đổi)" />
                            <select value={role} onChange={(e) => setROLE(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="Customer">Customer</option>
                            </select>
                            <div className="modal-actions">
                                <button type="button" className="outline-btn" onClick={() => setEditingUser(null)}>Hủy</button>
                                <button type="submit" className="primary-btn">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Thêm người dùng</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            createUser();
                        }}>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tên" />
                            <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email" />
                            <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Mật khẩu" />
                            <select value={role} onChange={(e) => setROLE(e.target.value)}>
                                <option value="">-- Chọn vai trò --</option>
                                <option value="Admin">Admin</option>
                                <option value="Customer">Customer</option>
                            </select>
                            <div className="modal-actions">
                                <button type="button" className="outline-btn" onClick={() => setShowCreateModal(false)}>Hủy</button>
                                <button type="submit" className="primary-btn">Thêm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3 className="text-danger">Xác nhận xoá</h3>
                        <p>Bạn có chắc chắn muốn xoá <strong>{userToDelete?.name}</strong> không?</p>
                        <div className="modal-actions">
                            <button className="outline-btn" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                            <button className="danger-btn" onClick={() => deleteUser(userToDelete.id)}>Xoá</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
