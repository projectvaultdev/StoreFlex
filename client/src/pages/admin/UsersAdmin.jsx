import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-hot-toast";
import {
  FiAlertTriangle,
  FiEdit2,
  FiLock,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUnlock,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { useGetMeQuery } from "../../redux/api/authApi";
import {
  useBlockUserMutation,
  useCreateStaffMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUnblockUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApi";

const addStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["manager", "staff", "admin"], {
    required_error: "Please select a role",
  }),
});

const editUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  role: z.enum(["user", "manager", "staff", "admin"], {
    required_error: "Please select a role",
  }),
});

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

const UsersAdmin = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockActionType, setBlockActionType] = useState("block");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: meData } = useGetMeQuery();
  const currentUserRole = meData?.user?.role;

  const { data, isLoading, isError, refetch, isFetching } = useGetUsersQuery({
    page,
    limit: 10,
    search,
    role: roleFilter,
  });

  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [createStaff] = useCreateStaffMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const addStaffForm = useForm({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: currentUserRole === "super_admin" ? "admin" : "staff",
    },
  });

  const editUserForm = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setPage(1);
    setSearch(value);
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Users refreshed");
    } catch {
      toast.error("Failed to refresh users");
    }
  };

  const canCreateUser = currentUserRole === "super_admin" || currentUserRole === "admin";

  const canManageUser = (user) => {
    if (currentUserRole === "super_admin") return true;
    if (currentUserRole === "admin") {
      return user?.role !== "super_admin" && user?.role !== "admin";
    }
    return false;
  };

  const createRoleOptions =
    currentUserRole === "super_admin" ? ["admin", "manager", "staff"] : ["manager", "staff"];

  const editRoleOptions =
    currentUserRole === "super_admin"
      ? ["user", "manager", "staff", "admin"]
      : ["user", "manager", "staff"];

  const openAddModal = () => {
    addStaffForm.reset({
      name: "",
      email: "",
      password: "",
      role: currentUserRole === "super_admin" ? "admin" : "staff",
    });
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    if (!canManageUser(user) || user?.role === "super_admin") return;
    editUserForm.reset({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
    setSelectedUser(user);
    setShowEditModal(true);
    setMenuOpenId(null);
  };

  const openDeleteModal = (user) => {
    if (!canManageUser(user) || user?.role === "super_admin") return;
    setSelectedUser(user);
    setShowDeleteModal(true);
    setMenuOpenId(null);
  };

  const openBlockModal = (user) => {
    if (!canManageUser(user) || user?.role === "super_admin") return;
    setSelectedUser(user);
    setBlockActionType(user.isBlocked ? "unblock" : "block");
    setShowBlockModal(true);
    setMenuOpenId(null);
  };

  const handleAddStaff = async (values) => {
    try {
      setIsSubmitting(true);
      await createStaff(values).unwrap();
      toast.success("Staff account created successfully");
      setShowAddModal(false);
      addStaffForm.reset();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create staff account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (values) => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      await updateUser({ id: selectedUser._id, data: values }).unwrap();
      toast.success("User updated successfully");
      setShowEditModal(false);
      setSelectedUser(null);
      editUserForm.reset();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      await deleteUser(selectedUser._id).unwrap();
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      if (blockActionType === "block") {
        await blockUser(selectedUser._id).unwrap();
        toast.success("User blocked successfully");
      } else {
        await unblockUser(selectedUser._id).unwrap();
        toast.success("User unblocked successfully");
      }
      setShowBlockModal(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (user) => {
    setMenuOpenId(null);
    toast.error(
      "Reset password endpoint is not wired in the current RTK Query layer. Add a dedicated mutation in client/src/redux/api/userApi.js to enable this action.",
    );
    setSelectedUser(user);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-700";
      case "admin":
        return "bg-blue-100 text-blue-700";
      case "manager":
        return "bg-purple-100 text-purple-700";
      case "staff":
        return "bg-amber-100 text-amber-700";
      case "user":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusColor = (isBlocked) =>
    isBlocked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700";

  const users = data?.users || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.pages || 1;

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => !user.isBlocked).length;
    const blocked = users.filter((user) => user.isBlocked).length;
    const staff = users.filter((user) => ["admin", "manager", "staff"].includes(user.role)).length;

    return { total, active, blocked, staff };
  }, [users]);

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "active") return !user.isBlocked;
    if (statusFilter === "blocked") return user.isBlocked;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Skeleton width={220} height={30} />
                <Skeleton width={180} height={18} className="mt-2" />
              </div>
              <Skeleton width={130} height={42} />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} height={90} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Skeleton width={240} height={24} />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} height={60} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FiAlertTriangle size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Unable to load users</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please refresh the page or try again in a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                Admin Panel
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Users Management
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage staff accounts, roles, access, and user activity from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <FiRefreshCw className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
              {canCreateUser && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <FiPlus />
                  Add Staff
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Total Users</p>
                <FiUsers className="text-slate-500" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Active Users</p>
                <FiUserCheck className="text-emerald-500" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.active}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Blocked Users</p>
                <FiLock className="text-red-500" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.blocked}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Staff Accounts</p>
                <FiShield className="text-blue-500" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stats.staff}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-sm">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearch}
                placeholder="Search by name or email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none ring-0 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                {currentUserRole === "super_admin" && <option value="admin">Admin</option>}
                {currentUserRole === "super_admin" && (
                  <option value="super_admin">Super Admin</option>
                )}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
            <span>
              Showing {filteredUsers.length} of {pagination.total || 0} users
            </span>
            {isFetching && <span className="text-blue-600">Refreshing...</span>}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                          {user.role?.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(user.isBlocked)}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {canManageUser(user) ? (
                          <div className="relative mx-auto inline-block">
                            <button
                              type="button"
                              onClick={() => setMenuOpenId(menuOpenId === user._id ? null : user._id)}
                              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <FiMoreVertical />
                            </button>
                            {menuOpenId === user._id && (
                              <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(user)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <FiEdit2 />
                                  Edit User
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openBlockModal(user)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  {user.isBlocked ? <FiUnlock /> : <FiLock />}
                                  {user.isBlocked ? "Unblock User" : "Block User"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResetPassword(user)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <FiShield />
                                  Reset Password
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(user)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  <FiTrash2 />
                                  Delete User
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">View Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-sm text-slate-500">
                      No users match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role?.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(user.isBlocked)}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                    {canManageUser(user) ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          onClick={() => openBlockModal(user)}
                          className={`rounded-lg p-2 ${user.isBlocked ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                        >
                          {user.isBlocked ? <FiUnlock /> : <FiLock />}
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(user)}
                          className="rounded-lg bg-red-50 p-2 text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">View Only</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No users match the current filters.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${page === pageNumber
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <Modal title="Add Staff Account" onClose={() => setShowAddModal(false)}>
          <form onSubmit={addStaffForm.handleSubmit(handleAddStaff)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                {...addStaffForm.register("name")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="Enter full name"
              />
              {addStaffForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">{addStaffForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                {...addStaffForm.register("email")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="Enter email"
              />
              {addStaffForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{addStaffForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                {...addStaffForm.register("password")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                placeholder="Create a temporary password"
              />
              {addStaffForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">{addStaffForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select
                {...addStaffForm.register("role")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {createRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && selectedUser && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <form onSubmit={editUserForm.handleSubmit(handleEditUser)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                {...editUserForm.register("name")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
              {editUserForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">{editUserForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                {...editUserForm.register("email")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
              {editUserForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{editUserForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select
                {...editUserForm.register("role")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {editRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && selectedUser && (
        <Modal title="Delete User" onClose={() => setShowDeleteModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              This will permanently remove <span className="font-semibold text-slate-900">{selectedUser.name}</span> from the system. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showBlockModal && selectedUser && (
        <Modal title={blockActionType === "block" ? "Block User" : "Unblock User"} onClose={() => setShowBlockModal(false)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {blockActionType === "block"
                ? `Are you sure you want to block ${selectedUser.name}?`
                : `Are you sure you want to unblock ${selectedUser.name}?`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockToggle}
                disabled={isSubmitting}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${blockActionType === "block"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isSubmitting ? "Processing..." : blockActionType === "block" ? "Block User" : "Unblock User"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersAdmin;