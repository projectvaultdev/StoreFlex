import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Get Cart
    // ===========================
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    // ===========================
    // Add To Cart
    // ===========================
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ===========================
    // Update Quantity
    // ===========================
    updateCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "PUT",
        body: {
          productId,
          quantity,
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    // ===========================
    // Remove Item
    // ===========================
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ===========================
    // Clear Cart
    // ===========================
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ===========================
    // Save For Later
    // ===========================
    moveToSaveForLater: builder.mutation({
      query: (productId) => ({
        url: `/cart/save-for-later/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),

    getSaveForLater: builder.query({
      query: () => "/cart/save-for-later",
      providesTags: ["Cart"],
    }),

    removeSaveForLater: builder.mutation({
      query: (productId) => ({
        url: `/cart/save-for-later/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    moveToCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/move-to-cart/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useMoveToSaveForLaterMutation,
  useGetSaveForLaterQuery,
  useRemoveSaveForLaterMutation,
  useMoveToCartMutation,
} = cartApi;
