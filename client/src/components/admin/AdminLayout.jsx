import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex">

            <AdminSidebar />

            <div className="flex-1 bg-gray-100 min-h-screen">

                <AdminHeader />

                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
};

export default AdminLayout;