import { useState } from "react";
import toast from "react-hot-toast";

import {
    useAddAddressMutation,
    useGetAddressesQuery,
} from "../../redux/api/addressApi";

import {
    usePlaceOrderMutation,
} from "../../redux/api/orderApi";

const CheckoutPage = () => {
    const [selectedAddress, setSelectedAddress] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
    });

    const { data } = useGetAddressesQuery();

    const [addAddress] =
        useAddAddressMutation();

    const [placeOrder] =
        usePlaceOrderMutation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleAddAddress =
        async (e) => {
            e.preventDefault();

            try {
                const res =
                    await addAddress(
                        formData
                    ).unwrap();

                toast.success(
                    "Address Added"
                );

                setSelectedAddress(
                    res.address._id
                );
            } catch (error) {
                toast.error(
                    error?.data?.message
                );
            }
        };

    const handlePlaceOrder =
        async () => {
            if (!selectedAddress) {
                return toast.error(
                    "Select Address"
                );
            }

            try {
                await placeOrder({
                    addressId:
                        selectedAddress,

                    paymentMethod:
                        "COD",
                }).unwrap();

                toast.success(
                    "Order Placed"
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
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-10">

                {/* Address Form */}

                <div>

                    <h2 className="text-xl font-semibold mb-4">
                        Add Address
                    </h2>

                    <form
                        onSubmit={
                            handleAddAddress
                        }
                        className="space-y-3"
                    >
                        <input
                            name="fullName"
                            placeholder="Full Name"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <input
                            name="phone"
                            placeholder="Phone"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <input
                            name="addressLine1"
                            placeholder="Address Line 1"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <input
                            name="addressLine2"
                            placeholder="Address Line 2"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <input
                            name="city"
                            placeholder="City"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <input
                            name="state"
                            placeholder="State"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <input
                            name="postalCode"
                            placeholder="Pincode"
                            className="border p-2 w-full"
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            className="
              bg-black
              text-white
              px-4
              py-2
              rounded
              "
                        >
                            Save Address
                        </button>

                    </form>

                </div>

                {/* Existing Addresses */}

                <div>

                    <h2 className="text-xl font-semibold mb-4">
                        Select Address
                    </h2>

                    {data?.addresses?.map(
                        (address) => (
                            <div
                                key={address._id}
                                className="
                border
                p-4
                mb-3
                rounded
                "
                            >
                                <input
                                    type="radio"
                                    checked={
                                        selectedAddress ===
                                        address._id
                                    }
                                    onChange={() =>
                                        setSelectedAddress(
                                            address._id
                                        )
                                    }
                                />

                                <span className="ml-3">
                                    {address.fullName}
                                </span>

                                <p>
                                    {
                                        address.addressLine1
                                    }
                                </p>

                                <p>
                                    {address.city}
                                </p>
                            </div>
                        )
                    )}

                    <button
                        onClick={
                            handlePlaceOrder
                        }
                        className="
            mt-5
            bg-green-600
            text-white
            px-6
            py-3
            rounded
            "
                    >
                        Place Order (COD)
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CheckoutPage;