import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProductCard from "../../components/product/ProductCard";

import {
  useGetProductsQuery,
} from "../../redux/api/productApi";

import {
  useGetCategoriesQuery,
} from "../../redux/api/categoryApi";

const HomePage = () => {

  // Redux
  const user = useSelector(
    (state) => state.auth.user
  );

  // Hooks hamesha top par
  const {
    data: productsData,
    isLoading: productsLoading,
  } = useGetProductsQuery();

  const {
    data: categoriesData,
  } = useGetCategoriesQuery();

  const products =
    productsData?.data?.products || [];
  const categories = categoriesData?.categories || [];
  console.log("product=> ", productsData);
  // Hooks ke baad redirect
  if (
    user &&
    (
      user.role === "admin" ||
      user.role === "super_admin"
    )
  ) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      {/* Hero */}

      <section className="bg-gradient-to-r from-gray-100 to-gray-200">

        <div className="max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-2xl">

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Discover Premium Fashion & Lifestyle Products
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Explore trending collections,
              latest arrivals and best deals
              at one place.
            </p>

            <Link
              to="/products"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg"
            >
              Shop Now
            </Link>

          </div>

        </div>

      </section>

      {/* Categories */}

      <section className="py-16 bg-white">

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl font-bold mb-8">
            Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {categories.map((category) => (

              <div
                key={category._id}
                className="border rounded-lg p-6 text-center hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">
                  {category.name}
                </h3>
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Products */}

      <section className="py-16 bg-gray-50">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold">
              Latest Products
            </h2>

            <Link
              to="/products"
              className="text-blue-600"
            >
              View All
            </Link>

          </div>

          {productsLoading ? (
            <h2>Loading...</h2>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {products
                .slice(0, 8)
                .map((product) => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                ))}

            </div>

          )}

        </div>

      </section>

      {/* Why Choose Us */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-xl mb-3">
                Fast Delivery
              </h3>

              <p className="text-gray-600">
                Quick and reliable shipping across India.
              </p>
            </div>

            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-xl mb-3">
                Secure Payments
              </h3>

              <p className="text-gray-600">
                Safe and trusted payment options.
              </p>
            </div>

            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-xl mb-3">
                Quality Products
              </h3>

              <p className="text-gray-600">
                Handpicked premium quality products.
              </p>
            </div>

          </div>

        </div>

      </section>

    </>
  );
};

export default HomePage;