import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { logout } from "@/untils/auth";
const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const menuContainerRef = useRef(null);

    const menuItems = [
        { key: "index", icon: "fa-solid fa-house", label: "Trang quản lý ", href: "/admin" },
        { key: "user", icon: "fas fa-user", label: "Tài khoản", href: "/manager" },
        { key: "forgot", icon: "fas fa-key", label: "Đổi mật khẩu", href: "/forgot" },
        { key: "category", icon: "fas fa-list", label: "Danh sách", href: "/list" },
        { key: "product", icon: "fas fa-cogs", label: "Đơn hàng", href: "/managerprod" },
        { key: "invoice", icon: "fas fa-file-invoice", label: "Hóa đơn", href: "/invoice" },
    ];

    // Dùng [...menuItems] để không mutate mảng gốc
    const activeItem =
        [...menuItems]
            .sort((a, b) => b.href.length - a.href.length)
            .find((item) => router.pathname.startsWith(item.href))?.key || "index";

    const activeIndex = menuItems.findIndex((item) => item.key === activeItem);
    const ITEM_HEIGHT = 44;

    const handleNavigate = (item) => {
        if (router.pathname !== item.href) {
            router.push(item.href);
        }
    };

    useEffect(() => {
        const start = () => setLoading(true);
        const end = () => setLoading(false);

        router.events.on("routeChangeStart", start);
        router.events.on("routeChangeComplete", end);
        router.events.on("routeChangeError", end);

        return () => {
            router.events.off("routeChangeStart", start);
            router.events.off("routeChangeComplete", end);
            router.events.off("routeChangeError", end);
        };
    }, [router]);

    return (
        <>
            {/* Topbar */}
            <div className="w-full bg-[#f7f7f7] h-14 flex items-center justify-between px-4 shadow-sm fixed top-0 left-0 z-50">
                {/* Left: Toggle + Logo */}
                <div className="flex items-center gap-3">
                    {/* Nút toggle */}
                    <button onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i className="fas fa-bars text-2xl text-gray-700"></i>
                    </button>

                    {/* Logo NRGrunt: icon + chữ có màu thương hiệu */}
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <span className="text-[#01ab78]">NRGrunt</span>
                    </div>
                </div>
                {/* Center: Search */}
                {/* <div className="flex items-center bg-white px-3 py-1 rounded-md shadow-sm w-[300px]">
                    <i className="fas fa-search text-gray-400 mr-2"></i>
                    <input
                        type="text"
                        placeholder="Nhập từ khóa cần tìm..."
                        className="w-full outline-none bg-transparent text-sm text-gray-700"
                    />
                </div> */}

                {/* Right: Action Icons */}
                <div className="flex items-center gap-4 text-gray-600 text-lg">
                    <i className="fas fa-copy hover:text-blue-500 cursor-pointer"></i>
                    <i className="fas fa-file-download hover:text-yellow-500 cursor-pointer"></i>
                    <i className="fas fa-bell hover:text-red-500 cursor-pointer"></i>
                </div>
            </div>

            {/* Loading spinner */}
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="flex pt-14">
                <div
                    className={`bg-[#01ab78] text-white transition-all duration-300 min-h-screen fixed z-40 ${isCollapsed ? "w-20" : "w-64"
                        } rounded-tr-3xl shadow-lg flex flex-col relative`}
                >
                    {/* Avatar + Info */}
                    <div className="flex items-center mb-4 px-3 pt-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shrink-0">
                            <img
                                src="http://127.0.0.1:8000/storage/images/IMG_0993.JPG"
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {!isCollapsed && (
                            <div className="ml-3 flex flex-1 items-center justify-between">
                                <div>
                                    <p className="font-semibold leading-none">Vũ Thị Ngọc</p>
                                    <p className="text-sm text-white/80">Administrator</p>
                                </div>
                                <button
                                    className="ml-4 text-white hover:text-red-300 transition"
                                    title="Đăng xuất"
                                    onClick={() => logout(router)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-log-out"
                                    >
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Menu */}
                    <div className="relative flex-1 px-2" ref={menuContainerRef}>
                        {/* Highlight hình chữ nhật khi mở rộng */}
                        {!isCollapsed && (
                            <div
                                className="absolute h-10 bg-white transition-all duration-300 z-0"
                                style={{
                                    top: `${activeIndex * ITEM_HEIGHT}px`,
                                    left: 0,
                                    right: "20px",
                                    borderTopRightRadius: "9999px",
                                    borderBottomRightRadius: "9999px",
                                }}
                            />
                        )}

                        {/* Highlight hình tròn khi thu nhỏ */}
                        {isCollapsed && (
                            <div
                                className="absolute w-10 h-10 bg-white rounded-full transition-all duration-300 z-0"
                                style={{
                                    top: `${activeIndex * ITEM_HEIGHT + (ITEM_HEIGHT - 40) / 2}px`,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                }}
                            />
                        )}

                        <ul className="space-y-1 relative z-10">
                            {menuItems.map((item) => {
                                const isActive = activeItem === item.key;

                                return (
                                    <li key={item.key}>
                                        <div
                                            className={`h-10 rounded-full cursor-pointer transition-all relative ${isCollapsed
                                                ? "flex items-center justify-center"
                                                : "flex items-center gap-3 px-4"
                                                } ${isActive ? "text-[#01ab78]" : "text-white"}`}
                                            onClick={() => handleNavigate(item)}
                                        >
                                            <i className={`${item.icon} text-lg z-10`}></i>
                                            {!isCollapsed && (
                                                <span className="font-medium">{item.label}</span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>


                    {!isCollapsed && (
                        <div className="text-center text-sm py-4 bg-[#019a6c]">
                            © 2025 NRGrunt Shop
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
