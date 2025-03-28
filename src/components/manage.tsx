import axios from "axios";
import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { api } from "../config/apiUrl";

export default function Management() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [role, setROLE] = useState(""); // Cần phải khởi tạo role đúng
    const [editingUser, setEditingUser] = useState(null); // Trạng thái người dùng đang chỉnh sửa
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const getUsers = () => {
        axios
            .get(`${api.getUsers}`, {
                headers: { Authorization: `Bearer ${Cookies.get("token_cms")}` },
            })
            .then((res) => {
                setUsers(res.data.data);
            })
            .catch(() => {
                router.push("/admin");
            });
    };

    const changeRole = (id: number) => {
        if (!role) {
            alert("Please select a role.");
            return;
        }

        axios
            .put(
                `${api.changeUserRole}/${id}/role`,
                { role: role },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token_cms")}`,
                    },
                }
            )
            .then(() => {
                alert("Change role success");
                getUsers(); // Lấy lại danh sách người dùng sau khi thay đổi
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    };

    const saveUserChanges = (id: number) => {
        axios
            .put(
                `${api.updateUser}/${id}`,
                {
                    name: userName,
                    email: userEmail,
                    role: role,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token_cms")}`,
                    },
                }
            )
            .then(() => {
                alert("User updated successfully!");
                getUsers(); // Lấy lại danh sách người dùng sau khi thay đổi
                setEditingUser(null); // Đóng form chỉnh sửa
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    };

    const cancelEdit = () => {
        setEditingUser(null); // Đóng form chỉnh sửa
    };

    useMemo(() => {
        axios
            .post(
                "http://127.0.0.1:8000/api/auth/check-auth",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token_cms")}`,
                    },
                }
            )
            .then((res) => {
                if (res.data.data.role !== "Admin") {
                    alert("You cannot access this page.");
                    setTimeout(() => {
                        router.push("/admin");
                    }, 1000);
                } else {
                    getUsers();
                }
            })
            .catch((err) => {
                alert(err.response.data.error);
                router.push("/admin");
            });
    }, [router]);

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
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>
                                <img src={user.avatar} alt="avatar" />
                            </td>
                            <td>{user.name}</td>
                            <td>
                                <select
                                    onChange={(e) => setROLE(e.target.value)}
                                    defaultValue={user.role}
                                >
                                    <option value={user.role} disabled>
                                        {user.role}
                                    </option>
                                    <option value="Admin">Admin</option>
                                    <option value="Customer">Customer</option>
                                </select>
                                <button
                                    className="edit-btn"
                                    onClick={() => changeRole(user.id)}
                                >
                                    Save
                                </button>
                            </td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditingUser(user); // Mở form chỉnh sửa
                                        setUserName(user.name);
                                        setUserEmail(user.email);
                                    }}
                                >
                                    Edit
                                </button>
                                {user.status === 1 && (
                                    <button className="edit-btn">Active</button>
                                )}
                                {user.status === 0 && (
                                    <button className="delete-btn">No active</button>
                                )}
                                {user.status === 2 && (
                                    <button className="delete-btn">Blocked</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5}>No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Form Edit User */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
                        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveUserChanges(editingUser.id);
                            }}
                        >
                            <label className="block text-sm mb-1">Tên:</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-3"
                            />

                            <label className="block text-sm mb-1">Email:</label>
                            <input
                                type="email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-3"
                            />

                            <label className="block text-sm mb-1">Vai trò:</label>
                            <select
                                value={role}
                                onChange={(e) => setROLE(e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Customer">Customer</option>
                            </select>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
