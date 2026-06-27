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
  FiUser,
  FiMail,
  FiKey,
  FiChevronDown,
  FiX,
  FiFilter,
  FiUserPlus,
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6 backdrop-blur-sm">
    <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6 animate-in fade-in zoom-in duration-200">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <FiX size={20} />
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
  const [activeTab, setActiveTab] = useState("users");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockActionType, setBlockActionType] = useState("block");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      toast.success("Users refreshed successfully");
    } catch {
      toast.error("Failed to refresh users");
    }
  };

  const canCreateUser = currentUserRole === "super_admin" || currentUserRole === "admin";

  // Admin can only block/unblock users, not delete or edit
  const canManageUser = (user) => {
    if (currentUserRole === "super_admin") {
      return true; // Super admin can do everything
    }
    if (currentUserRole === "admin") {
      // Admin can only block/unblock, not delete/edit
      return user?.role !== "super_admin" && user?.role !== "admin";
    }
    return false;
  };

  // Check if admin can delete (only super_admin can delete)
  const canDeleteUser = (user) => {
    if (currentUserRole === "super_admin") {
      return user?.role !== "super_admin";
    }
    return false;
  };

  // Check if admin can edit (only super_admin can edit)
  const canEditUser = (user) => {
    if (currentUserRole === "super_admin") {
      return user?.role !== "super_admin";
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
    if (!canEditUser(user) || user?.role === "super_admin") return;
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
    if (!canDeleteUser(user) || user?.role === "super_admin") return;
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
    toast.info(
      "Reset password functionality coming soon. Please use the dedicated password reset flow.",
      { duration: 4000 }
    );
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      admin: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      manager: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
      staff: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
      user: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    };
    return colors[role] || "bg-slate-100 text-slate-700";
  };

  const getRoleIcon = (role) => {
    const icons = {
      super_admin: <FiShield className="mr-1" size={12} />,
      admin: <FiShield className="mr-1" size={12} />,
      manager: <FiUserCheck className="mr-1" size={12} />,
      staff: <FiUsers className="mr-1" size={12} />,
      user: <FiUser className="mr-1" size={12} />,
    };
    return icons[role] || null;
  };

  const getStatusColor = (isBlocked) =>
    isBlocked ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200";

  const users = data?.users || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.pages || 1;

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(searchLower);
      const emailMatch = user.email?.toLowerCase().includes(searchLower);
      if (!nameMatch && !emailMatch) return false;
    }

    // Status filter
    if (statusFilter === "active" && user.isBlocked) return false;
    if (statusFilter === "blocked" && !user.isBlocked) return false;

    return true;
  });

  // Separate users and staff
  const staffRoles = ["admin", "manager", "staff", "super_admin"];
  const staffUsers = filteredUsers.filter((user) => staffRoles.includes(user.role));
  const regularUsers = filteredUsers.filter((user) => !staffRoles.includes(user.role));

  // Get users based on active tab
  const displayedUsers = activeTab === "users" ? regularUsers : staffUsers;

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => !user.isBlocked).length;
    const blocked = users.filter((user) => user.isBlocked).length;
    const staff = users.filter((user) => staffRoles.includes(user.role)).length;
    const regular = users.filter((user) => !staffRoles.includes(user.role)).length;

    return { total, active, blocked, staff, regular };
  }, [users]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
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
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FiAlertTriangle size={28} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Unable to load users</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please refresh the page or try again in a moment.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                  Admin Panel
                </p>
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl flex items-center gap-2">
                <FiUsers className="text-blue-600" />
                Users Management
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage staff accounts, roles, access, and user activity from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FiRefreshCw className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
              {canCreateUser && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                >
                  <FiPlus />
                  Add Staff
                </button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Total Users</p>
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FiUsers className="text-blue-600" size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Active Users</p>
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <FiUserCheck className="text-emerald-600" size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.active}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-red-50 to-red-100/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Blocked Users</p>
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FiLock className="text-red-600" size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.blocked}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Staff Accounts</p>
                <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <FiShield className="text-purple-600" size={16} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.staff}</p>
            </div>
          </div>
        </div>

        {/* Tabs and Table Section */}
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 sm:p-6">
          {/* Tabs */}
          <div className="mb-6 border-b border-slate-200">
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setActiveTab("users");
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
              >
                <FiUser size={16} />
                Users
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === "users"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600"
                  }`}>
                  {stats.regular}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("staff");
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === "staff"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
              >
                <FiUsers size={16} />
                Staff
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === "staff"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600"
                  }`}>
                  {stats.staff}
                </span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-sm">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearch}
                placeholder={`Search by name or email...`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex flex-col gap-3 sm:flex-row">
              <select
                value={roleFilter}
                onChange={(e) => {
                  handleRoleFilter(e.target.value);
                  setActiveTab("users");
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FiFilter />
              Filters
              <FiChevronDown className={`transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="sm:hidden mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <select
                value={roleFilter}
                onChange={(e) => {
                  handleRoleFilter(e.target.value);
                  setActiveTab("users");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
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
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          )}

          {/* Table Info */}
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
            <span className="flex items-center gap-2">
              Showing <span className="font-semibold text-slate-700">{displayedUsers.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{pagination.total || 0}</span> {activeTab}
            </span>
            {isFetching && (
              <span className="flex items-center gap-1 text-blue-600">
                <FiRefreshCw className="animate-spin" size={14} />
                Refreshing...
              </span>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role?.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(user.isBlocked)}`}>
                          {user.isBlocked ? (
                            <FiLock className="mr-1" size={12} />
                          ) : (
                            <FiUserCheck className="mr-1" size={12} />
                          )}
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {canManageUser(user) || canEditUser(user) || canDeleteUser(user) ? (
                          <div className="relative mx-auto inline-block">
                            <button
                              type="button"
                              onClick={() => setMenuOpenId(menuOpenId === user._id ? null : user._id)}
                              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                              <FiMoreVertical />
                            </button>
                            {menuOpenId === user._id && (
                              <div className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Block/Unblock - Available for both admin and super_admin */}
                                {canManageUser(user) && (
                                  <button
                                    type="button"
                                    onClick={() => openBlockModal(user)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    {user.isBlocked ? <FiUnlock /> : <FiLock />}
                                    {user.isBlocked ? "Unblock User" : "Block User"}
                                  </button>
                                )}

                                {/* Edit - Only for super_admin */}
                                {canEditUser(user) && (
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(user)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <FiEdit2 />
                                    Edit User
                                  </button>
                                )}

                                {/* Reset Password - Only for super_admin */}
                                {canEditUser(user) && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetPassword(user)}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <FiKey />
                                    Reset Password
                                  </button>
                                )}

                                {/* Delete - Only for super_admin */}
                                {canDeleteUser(user) && (
                                  <>
                                    <div className="my-1 border-t border-slate-100"></div>
                                    <button
                                      type="button"
                                      onClick={() => openDeleteModal(user)}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <FiTrash2 />
                                      Delete User
                                    </button>
                                  </>
                                )}
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
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FiUsers className="text-slate-300" size={40} />
                        <p className="text-sm text-slate-500">No {activeTab} match the current filters</p>
                        <button
                          onClick={() => {
                            setSearchInput("");
                            setSearch("");
                            setRoleFilter("");
                            setStatusFilter("");
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 lg:hidden">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <div key={user._id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role?.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(user.isBlocked)}`}>
                      {user.isBlocked ? (
                        <FiLock className="mr-1" size={12} />
                      ) : (
                        <FiUserCheck className="mr-1" size={12} />
                      )}
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                    {canManageUser(user) || canEditUser(user) || canDeleteUser(user) ? (
                      <div className="flex items-center gap-2">
                        {canManageUser(user) && (
                          <button
                            type="button"
                            onClick={() => openBlockModal(user)}
                            className={`rounded-lg p-2 transition-colors ${user.isBlocked
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                          >
                            {user.isBlocked ? <FiUnlock size={16} /> : <FiLock size={16} />}
                          </button>
                        )}
                        {canEditUser(user) && (
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}
                        {canDeleteUser(user) && (
                          <button
                            type="button"
                            onClick={() => openDeleteModal(user)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">View Only</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <FiUsers className="mx-auto text-slate-300" size={40} />
                <p className="mt-2 text-sm text-slate-500">No {activeTab} match the current filters</p>
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setRoleFilter("");
                    setStatusFilter("");
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (page <= 3) {
                  pageNumber = index + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = page - 2 + index;
                }
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${page === pageNumber
                      ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="px-2 text-slate-400">...</span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors ${page === totalPages
                      ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals - Keep all modals unchanged */}
      {showAddModal && (
        <Modal title="Add Staff Account" onClose={() => setShowAddModal(false)}>
          <form onSubmit={addStaffForm.handleSubmit(handleAddStaff)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...addStaffForm.register("name")}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter full name"
                />
              </div>
              {addStaffForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">{addStaffForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...addStaffForm.register("email")}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter email"
                />
              </div>
              {addStaffForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{addStaffForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...addStaffForm.register("password")}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Create a temporary password"
                />
              </div>
              {addStaffForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">{addStaffForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
              <select
                {...addStaffForm.register("role")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && selectedUser && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <form onSubmit={editUserForm.handleSubmit(handleEditUser)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...editUserForm.register("name")}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              {editUserForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">{editUserForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...editUserForm.register("email")}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              {editUserForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{editUserForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
              <select
                {...editUserForm.register("role")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && selectedUser && (
        <Modal title="Delete User" onClose={() => setShowDeleteModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="text-red-600" size={20} />
              </div>
              <p className="text-sm text-slate-700">
                This will permanently remove <span className="font-semibold text-slate-900">{selectedUser.name}</span> from the system.
              </p>
            </div>
            <p className="text-sm text-red-600 font-medium">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showBlockModal && selectedUser && (
        <Modal title={blockActionType === "block" ? "Block User" : "Unblock User"} onClose={() => setShowBlockModal(false)}>
          <div className="space-y-4">
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${blockActionType === "block"
              ? "bg-red-50 border-red-200"
              : "bg-emerald-50 border-emerald-200"
              }`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${blockActionType === "block" ? "bg-red-100" : "bg-emerald-100"
                }`}>
                {blockActionType === "block" ? (
                  <FiLock className="text-red-600" size={20} />
                ) : (
                  <FiUnlock className="text-emerald-600" size={20} />
                )}
              </div>
              <p className="text-sm text-slate-700">
                {blockActionType === "block"
                  ? `Are you sure you want to block ${selectedUser.name}?`
                  : `Are you sure you want to unblock ${selectedUser.name}?`}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockToggle}
                disabled={isSubmitting}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${blockActionType === "block"
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  blockActionType === "block" ? "Block User" : "Unblock User"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UsersAdmin;