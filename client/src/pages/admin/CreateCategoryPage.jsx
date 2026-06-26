import { useState } from "react";
import toast from "react-hot-toast";

import {
    useCreateCategoryMutation,
} from "../../redux/api/categoryApi";

const CreateCategoryPage = () => {
    const [name, setName] =
        useState("");

    const [createCategory] =
        useCreateCategoryMutation();

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        try {
            await createCategory({
                name,
            }).unwrap();

            toast.success(
                "Category Created"
            );

            setName("");
        } catch (error) {
            toast.error(
                error?.data?.message
            );
        }
    };

    return (
        <div className="max-w-xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-5">
                Create Category
            </h1>

            <form
                onSubmit={handleSubmit}
            >
                <input
                    value={name}
                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }
                    placeholder="Category Name"
                    className="
          border
          p-3
          w-full
          "
                />

                <button
                    className="
          mt-4
          bg-green-600
          text-white
          px-5
          py-3
          rounded
          "
                >
                    Create
                </button>
            </form>
        </div>
    );
};

export default CreateCategoryPage;