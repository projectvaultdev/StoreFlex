import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User
    placeOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    getMyOrders: builder.query({
      query: () => "/orders/my-orders",
      providesTags: ["Order"],
    }),

    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/cancel/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    // Admin
    getAllOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),

    updateTracking: builder.mutation({
      query: ({ id, trackingId }) => ({
        url: `/orders/tracking/${id}`,
        method: "PUT",
        body: { trackingId },
      }),
      invalidatesTags: ["Order"],
    }),

    updateShippingStatus: builder.mutation({
      query: ({ id, shippingStatus, message }) => ({
        url: `/orders/shipping-status/${id}`,
        method: "PUT",
        body: {
          shippingStatus,
          message,
        },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,

  // Admin
  useGetAllOrdersQuery,
  useUpdateTrackingMutation,
  useUpdateShippingStatusMutation,
} = orderApi;
