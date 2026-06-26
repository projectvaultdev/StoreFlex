import { useState } from "react";
import { FiSearch, FiTrash2, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useGetMeQuery } from "../../redux/api/authApi";
import {
    useGetUsersQuery,
    useCreateStaffMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "../../redux/api/userApi";

const StaffAdmin = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [limit] = useState(10);
    const { data: meData } = useGetMeQuery();
    const currentUserRole = meData?.user?.role;

    // Only fetch staff/manager/admin records depending on current user's visibility
    const roleFilter = ""; // allow filtering via UI later

    const { data, isLoading, isError } = useGetUsersQuery({
        page,
        limit,
        search,
        role: roleFilter,
    });

    const [createStaff] = useCreateStaffMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });

    const allowedRolesForCurrent = () => {
        if (currentUserRole === "super_admin") return ["admin", "manager", "staff"];
        if (currentUserRole === "admin") return ["manager", "staff"];
        return [];
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createStaff(form).unwrap();
            toast.success("Staff created");
            setForm({ name: "", email: "", password: "", role: "" });
        } catch (err) {
            toast.error(err?.data?.message || "Failed to create staff");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return;
        try {
            await deleteUser(id).unwrap();
            toast.success("User deleted");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete user");
        }
    };

    const handleSearch = (e) => {
        const v = e.target.value;
        setSearchInput(v);
        setPage(1);
        setSearch(v);
    };

    if (isLoading) return <div className="p-5">Loading...</div>;
    if (isError) return <div className="p-5 text-red-600">Error loading staff</div>;

    const users = data?.users || [];
    const pagination = data?.pagination || {};

    return (
        <div className="p-5 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Staff Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        value={searchInput}
                        onChange={handleSearch}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border rounded"
                    />
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleCreate} className="flex gap-2">
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="px-3 py-2 border rounded w-1/4" />
                        <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="px-3 py-2 border rounded w-1/4" />
                        <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className="px-3 py-2 border rounded w-1/6" />
                        <select required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2 border rounded w-1/6">
                            <option value="">Select Role</option>
                            {allowedRolesForCurrent().map(r => (
                                <option key={r} value={r}>{r.toUpperCase()}</option>
                            ))}
                        </select>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Role</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{u.name}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4">{u.role}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button onClick={() => alert('Edit user - use update form')} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 /></button>
                                        <button onClick={() => handleDelete(u._id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.pages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 border rounded">Prev</button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pn => (
                        <button key={pn} onClick={() => setPage(pn)} className={`px-3 py-1 border rounded ${pn === page ? 'bg-blue-600 text-white' : ''}`}>{pn}</button>
                    ))}
                    <button onClick={() => setPage(Math.min(pagination.pages, page + 1))} className="px-3 py-1 border rounded">Next</button>
                </div>
            )}
        </div>
    );
};

export default StaffAdmin;
