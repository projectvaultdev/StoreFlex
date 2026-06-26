import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-20">

      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            StoreFlex
          </h2>

          <p className="text-gray-400">
            Premium shopping experience
            built with MERN Stack.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Shop
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">

            <Link to="/">
              Home
            </Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/categories">
              Categories
            </Link>

          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Support
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">

            <Link to="/contact">
              Contact Us
            </Link>

            <Link to="/faq">
              FAQs
            </Link>

            <Link to="/privacy">
              Privacy Policy
            </Link>

          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Contact
          </h3>

          <div className="text-gray-400 space-y-2">

            <p>
              support@storeflex.com
            </p>

            <p>
              +91 9876543210
            </p>

            <p>
              India
            </p>

          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-4 text-gray-500">

        © {new Date().getFullYear()}
        {" "}
        StoreFlex. All Rights Reserved.

      </div>

    </footer>
  );
};

export default Footer;