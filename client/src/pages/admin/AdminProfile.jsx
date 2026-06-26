import { useEffect } from "react";
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
} from "react-icons/fa";

const AdminProfile = () => {
    const { data, isLoading } = useGetMeQuery();

    const [updateProfile, { isLoading: updating }] =
        useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

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

            toast.success(
                "Profile Updated Successfully"
            );
        } catch (err) {
            toast.error(
                err?.data?.message ||
                "Profile Update Failed"
            );
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-10">
                    Loading Profile...
                </div>
            </AdminLayout>
        );
    }

    const user = data?.user;

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Admin Profile
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}

                    <div className="bg-white rounded-xl shadow p-8">

                        <div className="flex flex-col items-center">

                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt=""
                                    className="w-28 h-28 rounded-full object-cover"
                                />
                            ) : (
                                <FaUserCircle
                                    className="text-gray-400"
                                    size={110}
                                />
                            )}

                            <h2 className="text-2xl font-bold mt-5">
                                {user?.name}
                            </h2>

                            <p className="text-gray-500">
                                {user?.email}
                            </p>

                            <span className="mt-4 bg-red-100 text-red-700 px-4 py-1 rounded-full">
                                {user?.role}
                            </span>

                        </div>

                        <hr className="my-8" />

                        <div className="space-y-5">

                            <div className="flex items-center gap-3">

                                <FaEnvelope />

                                <span>{user?.email}</span>

                            </div>

                            <div className="flex items-center gap-3">

                                <FaPhone />

                                <span>
                                    {user?.phone || "Not Added"}
                                </span>

                            </div>

                            <div className="flex items-center gap-3">

                                <FaUserShield />

                                <span>
                                    {user?.role}
                                </span>

                            </div>

                            <div className="flex items-center gap-3">

                                <FaCheckCircle
                                    className={
                                        user?.isVerified
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }
                                />

                                <span>
                                    {user?.isVerified
                                        ? "Verified"
                                        : "Not Verified"}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="lg:col-span-2 bg-white rounded-xl shadow p-8">

                        <h2 className="text-2xl font-bold mb-6">
                            Update Profile
                        </h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >

                            <div>

                                <label className="font-medium">
                                    Full Name
                                </label>

                                <input
                                    {...register("name")}
                                    className="w-full mt-2 border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="font-medium">
                                    Email
                                </label>

                                <input
                                    value={user?.email}
                                    readOnly
                                    className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                                />

                            </div>

                            <div>

                                <label className="font-medium">
                                    Phone
                                </label>

                                <input
                                    {...register("phone")}
                                    className="w-full mt-2 border rounded-lg p-3"
                                />

                            </div>

                            <div>

                                <label className="font-medium">
                                    Role
                                </label>

                                <input
                                    value={user?.role}
                                    readOnly
                                    className="w-full mt-2 border rounded-lg p-3 bg-gray-100"
                                />

                            </div>

                            <button
                                disabled={updating}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                            >
                                {updating
                                    ? "Updating..."
                                    : "Update Profile"}
                            </button>

                        </form>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminProfile;