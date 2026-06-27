import { Trash2, ShoppingCart, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
    useGetWishlistQuery,
    useRemoveFromWishlistMutation,
} from "../../redux/api/wishlistApi";

import {
    useAddToCartMutation,
} from "../../redux/api/cartApi";

const WishlistPage = () => {

    const {
        data,
        isLoading,
    } = useGetWishlistQuery();

    const [removeWishlist] =
        useRemoveFromWishlistMutation();

    const [addToCart] =
        useAddToCartMutation();

    const products =
        data?.wishlist?.products || [];

    const removeHandler = async (id) => {

        try {

            await removeWishlist(id).unwrap();

            toast.success("Removed");

        } catch {

            toast.error("Failed");

        }

    };

    const cartHandler = async (id) => {

        try {

            await addToCart({
                productId: id,
                quantity: 1,
            }).unwrap();

            toast.success("Added To Cart");

        } catch {

            toast.error("Failed");

        }

    };

    if (isLoading)
        return (
            <div className="max-w-7xl mx-auto py-20 text-center">
                Loading...
            </div>
        );

    if (!products.length)
        return (

            <div className="max-w-5xl mx-auto py-24 text-center">

                <Heart
                    className="mx-auto mb-5 text-red-500"
                    size={70}
                />

                <h2 className="text-3xl font-bold">
                    Wishlist Empty
                </h2>

                <p className="text-gray-500 mt-3">
                    Save your favourite products here.
                </p>

                <Link
                    to="/products"
                    className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-lg"
                >
                    Continue Shopping
                </Link>

            </div>

        );

    return (

        <div className="max-w-7xl mx-auto px-5 py-10">

            <h1 className="text-4xl font-bold mb-10">
                My Wishlist
            </h1>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">

                {products.map((product) => (

                    <div
                        key={product._id}
                        className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                    >

                        <Link to={`/products/${product._id}`}>

                            <img
                                src={
                                    product.images?.[0]?.url ||
                                    "https://placehold.co/400x400?text=No+Image"
                                }
                                alt={product.name}
                                className="h-64 w-full object-cover"
                            />

                        </Link>

                        <div className="p-4">

                            <h2 className="font-semibold line-clamp-2">
                                {product.name}
                            </h2>

                            <p className="text-xl font-bold mt-3">

                                ₹
                                {product.discountPrice || product.price}

                            </p>

                            <div className="flex gap-2 mt-5">

                                <button

                                    onClick={() =>
                                        cartHandler(product._id)
                                    }

                                    className="flex-1 bg-black text-white py-2 rounded-lg flex justify-center items-center gap-2"

                                >

                                    <ShoppingCart size={18} />

                                    Add

                                </button>

                                <button

                                    onClick={() =>
                                        removeHandler(product._id)
                                    }

                                    className="w-12 border rounded-lg flex items-center justify-center"

                                >

                                    <Trash2 size={18} />

                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default WishlistPage;