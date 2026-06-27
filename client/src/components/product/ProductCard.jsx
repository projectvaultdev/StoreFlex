import { memo } from "react";
import { Link } from "react-router-dom";
import {
    Heart,
    Eye,
    ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";

import Rating from "../common/Rating";

import {
    useAddToCartMutation,
} from "../../redux/api/cartApi";

import {
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetWishlistQuery,
} from "../../redux/api/wishlistApi";

const ProductCard = memo(({ product, onQuickView }) => {

    const [addToCart] =
        useAddToCartMutation();

    const [addWishlist] =
        useAddToWishlistMutation();

    const [removeWishlist] =
        useRemoveFromWishlistMutation();

    const {
        data: wishlistData,
    } = useGetWishlistQuery();

    const image =
        product?.images?.[0]?.url ||
        "https://placehold.co/600x600?text=No+Image";

    const discount =
        product?.discountPrice > 0
            ? Math.round(
                ((product.price -
                    product.discountPrice) /
                    product.price) *
                100
            )
            : 0;

    const isWishlisted =
        wishlistData?.wishlist?.products?.some(
            (item) => item._id === product._id
        );

    const handleAddToCart = async (e) => {

        e.preventDefault();

        try {

            await addToCart({
                productId: product._id,
                quantity: 1,
            }).unwrap();

            toast.success(
                "Added To Cart"
            );

        } catch (error) {

            toast.error(
                error?.data?.message ||
                "Failed"
            );

        }

    };

    const handleWishlist = async (e) => {

        e.preventDefault();

        try {

            if (isWishlisted) {

                await removeWishlist(
                    product._id
                ).unwrap();

                toast.success(
                    "Removed From Wishlist"
                );

            } else {

                await addWishlist(
                    product._id
                ).unwrap();

                toast.success(
                    "Added To Wishlist"
                );

            }

        } catch (error) {

            toast.error(
                error?.data?.message ||
                "Wishlist Error"
            );

        }

    };

    const handleQuickView = (e) => {

        e.preventDefault();

        if (onQuickView) {
            onQuickView(product);
        }

    };

    return (

        <Link to={`/products/${product._id}`}>

            <div
                className="
                bg-white
                rounded-xl
                overflow-hidden
                shadow-sm
                hover:shadow-xl
                transition
                duration-300
                border
                group
                flex
                flex-col
                h-full
            "
            >

                {/* Image */}

                <div className="relative h-64 overflow-hidden bg-gray-100">

                    <img
                        src={image}
                        alt={product.name}
                        className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-110
                        transition
                        duration-500
                    "
                    />

                    {discount > 0 && (

                        <span
                            className="
                            absolute
                            top-3
                            left-3
                            bg-red-600
                            text-white
                            text-xs
                            px-2
                            py-1
                            rounded
                            font-semibold
                        "
                        >

                            -{discount}%

                        </span>

                    )}

                    {/* Icons */}

                    <div
                        className="
                        absolute
                        top-3
                        right-3
                        flex
                        flex-col
                        gap-2
                    "
                    >

                        <button
                            onClick={handleWishlist}
                            className={`
                            p-2
                            rounded-full
                            shadow
                            bg-white
                            transition
                            ${isWishlisted
                                    ? "text-red-600"
                                    : "hover:text-red-600"}
                        `}
                        >

                            <Heart
                                size={18}
                                fill={
                                    isWishlisted
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                        </button>

                        <button
                            onClick={handleQuickView}
                            className="
                            p-2
                            rounded-full
                            bg-white
                            shadow
                            hover:text-blue-600
                        "
                        >

                            <Eye size={18} />

                        </button>

                    </div>

                    {product.stock <= 0 && (

                        <div
                            className="
                            absolute
                            inset-0
                            bg-black/60
                            flex
                            items-center
                            justify-center
                        "
                        >

                            <span className="text-white font-bold">

                                Out Of Stock

                            </span>

                        </div>

                    )}

                </div>

                {/* Content */}

                <div className="p-4 flex flex-col flex-1">

                    <p className="text-xs text-gray-500 uppercase">

                        {product.category?.name}

                    </p>

                    <h2
                        className="
                        font-semibold
                        mt-2
                        line-clamp-2
                        group-hover:text-blue-600
                    "
                    >

                        {product.name}

                    </h2>

                    {product.brand && (

                        <p className="text-sm text-gray-500 mt-1">

                            {product.brand}

                        </p>

                    )}

                    <div className="mt-2">

                        <Rating
                            rating={
                                product.averageRating || 0
                            }
                            count={
                                product.numReviews || 0
                            }
                            size="sm"
                        />

                    </div>

                    <div
                        className="
                        flex
                        items-center
                        gap-2
                        mt-3
                    "
                    >

                        {product.discountPrice > 0 ? (

                            <>

                                <span className="text-xl font-bold text-red-600">

                                    ₹{product.discountPrice}

                                </span>

                                <span className="line-through text-gray-400">

                                    ₹{product.price}

                                </span>

                            </>

                        ) : (

                            <span className="text-xl font-bold">

                                ₹{product.price}

                            </span>

                        )}

                    </div>

                    <div className="mt-2">

                        {product.stock > 0 ? (

                            <span className="text-green-600 text-sm font-medium">

                                {product.stock} In Stock

                            </span>

                        ) : (

                            <span className="text-red-600 text-sm font-medium">

                                Out Of Stock

                            </span>

                        )}

                    </div>

                    <button

                        onClick={handleAddToCart}

                        disabled={
                            product.stock <= 0
                        }

                        className="
                        mt-auto
                        flex
                        justify-center
                        items-center
                        gap-2
                        bg-black
                        text-white
                        py-3
                        rounded-lg
                        mt-5
                        hover:bg-gray-900
                        disabled:bg-gray-400
                    "
                    >

                        <ShoppingCart size={18} />

                        Add To Cart

                    </button>

                </div>

            </div>

        </Link>

    );

});

ProductCard.displayName = "ProductCard";

export default ProductCard;