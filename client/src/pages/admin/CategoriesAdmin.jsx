import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    useGetCategoriesQuery,
    useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";

const CategoriesAdmin = () => {
    const { data, isLoading } =
        useGetCategoriesQuery();

    const [deleteCategory] =
        useDeleteCategoryMutation();

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Delete Category?"
            )
        ) {
            return;
        }

        try {
            await deleteCategory(id).unwrap();

            toast.success(
                "Category Deleted"
            );
        } catch (error) {
            toast.error(
                error?.data?.message
            );
        }
    };

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="p-5">

            <div className="flex justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Categories
                </h1>

                <Link
                    to="/admin/categories/create"
                    className="
          bg-green-600
          text-white
          px-4
          py-2
          rounded
          "
                >
                    Add Category
                </Link>

            </div>

            {data?.categories?.map(
                (category) => (
                    <div
                        key={category._id}
                        className="
            border
            p-4
            rounded
            mb-3
            "
                    >
                        <h3 className="font-semibold">
                            {category.name}
                        </h3>

                        <p>
                            {category.slug}
                        </p>

                        <div className="flex gap-3 mt-3">

                            <Link
                                to={`/admin/categories/edit/${category._id}`}
                                className="
                bg-blue-600
                text-white
                px-3
                py-1
                rounded
                "
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() =>
                                    handleDelete(
                                        category._id
                                    )
                                }
                                className="
                bg-red-600
                text-white
                px-3
                py-1
                rounded
                "
                            >
                                Delete
                            </button>

                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default CategoriesAdmin;