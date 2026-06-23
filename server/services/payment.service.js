export const createPayment = async ({ amount, provider }) => {
  switch (provider) {
    case "RAZORPAY":
      return {
        orderId: "rzp_mock_12345",
        amount,
      };

    case "STRIPE":
      return {
        sessionId: "stripe_mock_12345",
        amount,
      };

    default:
      throw new Error("Invalid provider");
  }
};
