import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const image =
        product?.images?.[0]?.url ||
        "https://via.placeholder.com/400x400";

    return (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">

            <Link to={`/products/${product._id}`}>

                <img
                    src={image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                />

            </Link>

            <div className="p-4">

                <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">

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

                <p className="text-sm text-gray-500 mt-2">
                    Stock: {product.stock}
                </p>

            </div>
        </div>
    );
};

export default ProductCard;