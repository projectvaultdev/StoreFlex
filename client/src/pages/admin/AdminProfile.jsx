import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useForm } from "react-hook-form";
import {
    useGetMeQuery,
    useUpdateProfileMutation,
} from "../../redux/api/authApi";
import toast from "react-hot-toast";
import {
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaUserShield,
    FaCheckCircle,
    FaEdit,
    FaSave,
    FaTimes,
    FaUser,
    FaShieldAlt,
    FaCamera,
    FaPen,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const AdminProfile = () => {
    const { data, isLoading, refetch } = useGetMeQuery();
    const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm();

    const watchedName = watch("name");
    const watchedPhone = watch("phone");

    useEffect(() => {
        if (data?.user) {
            reset({
                name: data.user.name,
                phone: data.user.phone || "",
            });
        }
    }, [data, reset]);

    const onSubmit = async (formData) => {
        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile Updated Successfully");
            setIsEditing(false);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Profile Update Failed");
        }
    };

    const handleCancel = () => {
        reset({
            name: data?.user?.name,
            phone: data?.user?.phone || "",
        });
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 font-medium">Loading Profile...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const user = data?.user;

    return (
        <AdminLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                                Profile
                            </p>
                        </div>
                        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <FaUserCircle className="text-blue-600" />
                            Admin Profile
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your account information and settings
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${user?.isVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            <FaCheckCircle size={14} />
                            {user?.isVerified ? "Verified" : "Not Verified"}
                        </span>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
                            >
                                <FaEdit size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card - Left */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                            {/* Cover Image */}
                            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                                {/* Camera Icon Overlay */}
                                <button className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-all hover:scale-110">
                                    <FaCamera size={16} />
                                </button>
                            </div>

                            {/* Profile Photo */}
                            <div className="relative px-6">
                                <div className="flex justify-center -mt-12">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user?.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
                                            <FaUserCircle className="text-blue-500" size={64} />
                                        </div>
                                    )}
                                    <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md transition-all hover:scale-110 border-2 border-white">
                                        <FaCamera size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="px-6 pb-6">
                                <div className="text-center mt-3">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {isEditing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input
                                                    {...register("name", {
                                                        required: "Name is required",
                                                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                                                    })}
                                                    className="text-center border-b-2 border-blue-500 focus:outline-none px-2 py-1 bg-transparent text-xl font-bold w-full max-w-xs"
                                                    placeholder="Enter name"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            user?.name
                                        )}
                                    </h2>
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                                    <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-semibold ${user?.role === 'super_admin'
                                            ? 'bg-red-100 text-red-700'
                                            : user?.role === 'admin'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        <FaShieldAlt className="inline mr-1.5" size={12} />
                                        {user?.role?.replace("_", " ").toUpperCase()}
                                    </span>
                                </div>

                                <hr className="my-5 border-gray-200" />

                                {/* Details */}
                                <div className="space-y-3.5">
                                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                            <FaEnvelope size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                                            <FaPhone size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Phone</p>
                                            {isEditing ? (
                                                <input
                                                    {...register("phone")}
                                                    className="w-full text-sm font-medium text-gray-900 border-b-2 border-blue-500 focus:outline-none px-1 py-0.5 bg-transparent"
                                                    placeholder="Add phone number"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user?.phone || "Not Added"}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                                            <FaUserShield size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Role</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user?.role?.replace("_", " ").toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${user?.isVerified
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            <FaCheckCircle size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className={`text-sm font-medium ${user?.isVerified
                                                    ? 'text-green-600'
                                                    : 'text-yellow-600'
                                                }`}>
                                                {user?.isVerified ? "Verified Account" : "Not Verified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Join Date */}
                                <div className="mt-5 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-400 text-center">
                                        Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Form - Right */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FaEdit size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {isEditing ? "Edit Profile" : "Profile Information"}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {isEditing
                                                ? "Update your personal information"
                                                : "View and manage your profile details"}
                                        </p>
                                    </div>
                                </div>
                                {isEditing && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                                        <FaPen size={10} />
                                        Editing
                                    </span>
                                )}
                            </div>

                            {!isEditing ? (
                                // View Mode
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-500 font-medium">Full Name</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">{user?.name}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-500 font-medium">Email</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">{user?.email}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">
                                                {user?.phone || "Not Added"}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs text-gray-500 font-medium">Role</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">
                                                {user?.role?.replace("_", " ").toUpperCase()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                                        >
                                            <FaEdit size={18} />
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Edit Mode
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Name */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                            <FaUser size={14} className="text-blue-600" />
                                            Full Name *
                                        </label>
                                        <input
                                            {...register("name", {
                                                required: "Name is required",
                                                minLength: { value: 2, message: "Name must be at least 2 characters" }
                                            })}
                                            className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                                                <FaTimes size={12} />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email - Read Only */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                            <FaEnvelope size={14} className="text-blue-600" />
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                value={user?.email}
                                                readOnly
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                    Read Only
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Email address cannot be changed
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                            <FaPhone size={14} className="text-blue-600" />
                                            Phone Number
                                        </label>
                                        <input
                                            {...register("phone")}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter your phone number"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Optional - Used for contact purposes
                                        </p>
                                    </div>

                                    {/* Role - Read Only */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                            <FaUserShield size={14} className="text-blue-600" />
                                            Role
                                        </label>
                                        <div className="relative">
                                            <input
                                                value={user?.role?.replace("_", " ").toUpperCase()}
                                                readOnly
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600 cursor-not-allowed"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user?.role === 'super_admin'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {user?.role?.replace("_", " ").toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Role permissions are managed by administrators
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={updating || !isDirty}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updating ? (
                                                <>
                                                    <FiLoader className="animate-spin" size={18} />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave size={18} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                                        >
                                            <FaTimes size={18} />
                                            Cancel
                                        </button>
                                    </div>

                                    {/* Info Note */}
                                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <p className="text-sm text-blue-700 flex items-start gap-2">
                                            <FaShieldAlt className="flex-shrink-0 mt-0.5" size={16} />
                                            <span>Your profile information helps us personalize your admin experience. Keep it updated.</span>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;