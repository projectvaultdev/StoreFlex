import { useSelector } from "react-redux";

const ProfilePage = () => {
    const user = useSelector(
        (state) => state.auth.user
    );

    return (
        <>
            <div className="max-w-5xl mx-auto px-4 py-10">

                <h1 className="text-3xl font-bold mb-8">
                    My Profile
                </h1>

                <div className="bg-white shadow rounded-lg p-8">

                    <div className="flex items-center gap-6 mb-8">

                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                            {user?.name?.charAt(0)}
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {user?.name}
                            </h2>

                            <p className="text-gray-600">
                                {user?.email}
                            </p>

                            <span className="inline-block mt-2 bg-gray-100 px-3 py-1 rounded text-sm">
                                {user?.role}
                            </span>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="font-medium">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={user?.name || ""}
                                disabled
                                className="w-full border rounded p-3 mt-2"
                            />
                        </div>

                        <div>
                            <label className="font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full border rounded p-3 mt-2"
                            />
                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default ProfilePage;