import { baseApi } from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => "/address",
      providesTags: ["Address"],
    }),

    addAddress: builder.mutation({
      query: (data) => ({
        url: "/address",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
