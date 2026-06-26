import { Link } from "react-router-dom";
import {
    useGetMyOrdersQuery,
} from "../../redux/api/orderApi";

const MyOrdersPage = () => {
    const {
        data,
        isLoading,
    } = useGetMyOrdersQuery();

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="max-w-6xl mx-auto p-5">

            <h1 className="text-3xl font-bold mb-8">
                My Orders
            </h1>

            {data?.orders?.length === 0 ? (
                <p>No Orders Found</p>
            ) : (
                data?.orders?.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded p-4 mb-4"
                    >
                        <div className="flex justify-between">

                            <div>
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
                            </div>

                            <Link
                                to={`/orders/${order._id}`}
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                View
                            </Link>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrdersPage;