import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    useGetProductsQuery,
    useDeleteProductMutation,
} from "../../redux/api/productApi";

const ProductsAdmin = () => {
    const { data } =
        useGetProductsQuery();
    const [deleteProduct] =
        useDeleteProductMutation();

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Delete Product?"
            )
        ) {
            return;
        }

        try {
            await deleteProduct(id).unwrap();

            toast.success(
                "Product Deleted"
            );
        } catch (error) {
            toast.error(
                error?.data?.message
            );
        }
    };

    return (
        <div className="p-5">

            <h1 className="text-3xl font-bold mb-5">
                Products
            </h1>

            <Link
                to="/admin/products/create"
                className="
  inline-block
  mb-5
  bg-green-600
  text-white
  px-5
  py-3
  rounded
  "
            >
                Add Product
            </Link>

            {data?.products?.map(
                (product) => (
                    <div
                        key={product._id}
                        className="
            border
            p-4
            mb-3
            "
                    >
                        <h3>
                            {product.name}
                        </h3>

                        <p>
                            ₹{product.price}
                        </p>

                        <div className="flex gap-3 mt-3">

                            <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="
    bg-blue-600
    text-white
    px-3
    py-2
    rounded
    "
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() =>
                                    handleDelete(product._id)
                                }
                                className="
    bg-red-600
    text-white
    px-3
    py-2
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

export default ProductsAdmin;