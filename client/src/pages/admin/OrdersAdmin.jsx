import { useGetAllOrdersQuery } from "../../redux/api/orderApi";

const OrdersAdmin = () => {
    const { data, isLoading } =
        useGetAllOrdersQuery();

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-6">
                Orders Management
            </h1>

            <div className="space-y-4">
                {data?.orders?.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded p-4"
                    >
                        <p>
                            <strong>Order ID:</strong>{" "}
                            {order._id}
                        </p>

                        <p>
                            <strong>Customer:</strong>{" "}
                            {order.user?.name}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {order.user?.email}
                        </p>

                        <p>
                            <strong>Amount:</strong> ₹
                            {order.totalAmount}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {order.orderStatus}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersAdmin;