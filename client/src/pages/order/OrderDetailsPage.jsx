import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import {
    useGetOrderQuery,
    useCancelOrderMutation,
} from "../../redux/api/orderApi";

const OrderDetailsPage = () => {
    const { id } = useParams();

    const {
        data,
        isLoading,
    } = useGetOrderQuery(id);

    const [
        cancelOrder,
    ] = useCancelOrderMutation();

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    const order = data?.order;

    const handleCancel = async () => {
        try {
            await cancelOrder(
                order._id
            ).unwrap();

            toast.success(
                "Order Cancelled"
            );
        } catch (error) {
            toast.error(
                error?.data?.message
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-8">
                Order Details
            </h1>

            <div className="border rounded p-5">

                <p>
                    Order ID:
                    {order._id}
                </p>

                <p>
                    Amount:
                    ₹{order.totalAmount}
                </p>

                <p>
                    Status:
                    {order.orderStatus}
                </p>

                <h3 className="mt-5 font-bold">
                    Products
                </h3>

                {order.orderItems.map(
                    (item) => (
                        <div
                            key={item._id}
                            className="border-b py-3"
                        >
                            <p>
                                {
                                    item.product
                                        ?.name
                                }
                            </p>

                            <p>
                                Qty:
                                {item.quantity}
                            </p>

                            <p>
                                ₹{item.price}
                            </p>
                        </div>
                    )
                )}

                {order.orderStatus !==
                    "SHIPPED" &&
                    order.orderStatus !==
                    "DELIVERED" &&
                    order.orderStatus !==
                    "CANCELLED" && (
                        <button
                            onClick={
                                handleCancel
                            }
                            className="
              mt-5
              bg-red-600
              text-white
              px-5
              py-2
              rounded
              "
                        >
                            Cancel Order
                        </button>
                    )}

            </div>

        </div>
    );
};

export default OrderDetailsPage;