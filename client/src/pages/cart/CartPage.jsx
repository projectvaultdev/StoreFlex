import { Link } from "react-router-dom";
import {
    useGetCartQuery,
    useRemoveFromCartMutation,
} from "../../redux/api/cartApi";

const CartPage = () => {

    const {
        data,
        isLoading,
    } = useGetCartQuery();

    const [
        removeFromCart,
    ] =
        useRemoveFromCartMutation();

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    const cartItems =
        data?.cart?.items || [];

    const total =
        cartItems.reduce(
            (acc, item) =>
                acc +
                item.price *
                item.quantity,
            0
        );

    return (

        <div className="max-w-5xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            {cartItems.map(
                (item) => (

                    <div
                        key={item._id}
                        className="
            flex
            justify-between
            border-b
            py-4
            "
                    >

                        <div>

                            <h3>
                                {item.product.name}
                            </h3>

                            <p>
                                ₹{item.price}
                            </p>

                            <p>
                                Qty:
                                {item.quantity}
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                removeFromCart(
                                    item._id
                                )
                            }
                            className="
              text-red-500
              "
                        >
                            Remove
                        </button>

                    </div>

                )
            )}

            <div className="mt-8">

                <h2 className="text-2xl font-bold">

                    Total :
                    ₹{total}

                </h2>

            </div>

            <Link
                to="/checkout"
                className="
  inline-block
  mt-4
  bg-green-600
  text-white
  px-5
  py-3
  rounded
  "
            >
                Proceed To Checkout
            </Link>

        </div>

    );
};

export default CartPage;