import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    useGetCategoriesQuery,
    useUpdateCategoryMutation,
} from "../../redux/api/categoryApi";

const EditCategoryPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { data } = useGetCategoriesQuery();

    const [updateCategory] =
        useUpdateCategoryMutation();

    const [name, setName] = useState("");

    useEffect(() => {
        const category =
            data?.categories?.find(
                (cat) => cat._id === id
            );

        if (category) {
            setName(category.name);
        }
    }, [data, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateCategory({
                id,
                data: {
                    name,
                },
            }).unwrap();

            toast.success(
                "Category Updated Successfully"
            );

            navigate("/admin/categories");
        } catch (error) {
            toast.error(
                error?.data?.message ||
                "Update Failed"
            );
        }
    };

    return (
        <div className="max-w-xl mx-auto p-5">
            <h1 className="text-3xl font-bold mb-6">
                Edit Category
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Category Name"
                    className="
          w-full
          border
          p-3
          rounded
          "
                    required
                />

                <button
                    type="submit"
                    className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded
          "
                >
                    Update Category
                </button>
            </form>
        </div>
    );
};

export default EditCategoryPage;