import { Link } from "react-router-dom";
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag
} from "lucide-react";

import toast from "react-hot-toast";

import {
    useGetCartQuery,
    useRemoveFromCartMutation,
    useUpdateCartMutation,
    useClearCartMutation,
} from "../../redux/api/cartApi";

const CartPage = () => {

    const { data, isLoading } =
        useGetCartQuery();

    const [removeFromCart] =
        useRemoveFromCartMutation();

    const [updateCart] =
        useUpdateCartMutation();

    const [clearCart] =
        useClearCartMutation();

    const cart =
        data?.cart;

    const items =
        cart?.items || [];

    const total =
        cart?.totalAmount || 0;

    const removeItem = async (productId) => {

        try {

            await removeFromCart(productId).unwrap();

            toast.success("Removed");

        } catch {

            toast.error("Failed");

        }

    };

    const changeQty = async (
        productId,
        quantity
    ) => {

        if (quantity < 1) return;

        try {

            await updateCart({
                productId,
                quantity,
            }).unwrap();

        } catch (err) {

            toast.error(
                err?.data?.message ||
                "Failed"
            );

        }

    };

    const clear = async () => {

        if (
            !window.confirm(
                "Clear cart?"
            )
        )
            return;

        await clearCart().unwrap();

        toast.success(
            "Cart Cleared"
        );

    };

    if (isLoading) {

        return (
            <div className="max-w-7xl mx-auto py-20 text-center">

                Loading...

            </div>
        );

    }

    if (items.length === 0) {

        return (

            <div className="max-w-4xl mx-auto py-24 text-center">

                <ShoppingBag
                    className="mx-auto mb-6 text-gray-400"
                    size={80}
                />

                <h1 className="text-3xl font-bold">

                    Your Cart is Empty

                </h1>

                <p className="text-gray-500 mt-3">

                    Start shopping now.

                </p>

                <Link
                    to="/products"
                    className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-lg"
                >
                    Continue Shopping
                </Link>

            </div>

        );

    }

    return (

        <div className="max-w-7xl mx-auto px-4 py-12">

            <h1 className="text-4xl font-bold mb-10">

                Shopping Cart

            </h1>

            <div className="grid lg:grid-cols-3 gap-10">

                <div className="lg:col-span-2 space-y-6">

                    {

                        items.map(item => {

                            const product =
                                item.product;

                            const price =
                                product.discountPrice > 0
                                    ? product.discountPrice
                                    : product.price;

                            return (

                                <div
                                    key={product._id}
                                    className="border rounded-xl p-5 flex gap-5"
                                >

                                    <img
                                        src={
                                            product.images?.[0]?.url ||
                                            "https://placehold.co/200x200?text=No+Image"
                                        }
                                        className="w-28 h-28 rounded-lg object-cover"
                                        alt={product.name}
                                    />

                                    <div className="flex-1">

                                        <h2 className="font-semibold text-lg">

                                            {product.name}

                                        </h2>

                                        <p className="text-gray-500">

                                            ₹{price}

                                        </p>

                                        <div className="flex items-center gap-3 mt-5">

                                            <button
                                                onClick={() =>
                                                    changeQty(
                                                        product._id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="border rounded p-2"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span>

                                                {item.quantity}

                                            </span>

                                            <button
                                                onClick={() =>
                                                    changeQty(
                                                        product._id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="border rounded p-2"
                                            >
                                                <Plus size={16} />
                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        onClick={() =>
                                            removeItem(product._id)
                                        }
                                    >
                                        <Trash2 className="text-red-500" />
                                    </button>

                                </div>

                            );

                        })

                    }

                </div>

                <div>

                    <div className="border rounded-xl p-6 sticky top-24">

                        <h2 className="text-2xl font-bold">

                            Order Summary

                        </h2>

                        <div className="flex justify-between mt-6">

                            <span>

                                Total

                            </span>

                            <span className="font-bold">

                                ₹{total}

                            </span>

                        </div>

                        <Link
                            to="/checkout"
                            className="block mt-8 text-center bg-black text-white py-3 rounded-lg"
                        >
                            Proceed To Checkout
                        </Link>

                        <button
                            onClick={clear}
                            className="w-full mt-3 border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50"
                        >
                            Clear Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default CartPage;