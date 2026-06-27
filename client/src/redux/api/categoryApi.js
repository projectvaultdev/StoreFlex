import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===========================
    // Get All Categories
    // ===========================
    getCategories: builder.query({
      query: () => "/categories",
      transformResponse: (response) => ({
        categories:
          response?.categories ||
          response?.data?.categories ||
          response?.data ||
          [],
      }),
      providesTags: ["Category"],
    }),

    // ===========================
    // Get Single Category
    // ===========================
    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      transformResponse: (response) => ({
        category:
          response?.category || response?.data?.category || response?.data,
      }),
      providesTags: ["Category"],
    }),

    // ===========================
    // Create Category
    // ===========================
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ===========================
    // Update Category
    // ===========================
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ===========================
    // Delete Category
    // ===========================
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    // Products By Category
    getCategoryProducts: builder.query({
      query: (id) => `/products/category/${id}`,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryProductsQuery,
} = categoryApi;
