import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",

      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Cart"],
    }),

    updateCart: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/cart/${id}`,
        method: "PUT",
        body: { quantity },
      }),

      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
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
} = cartApi;
