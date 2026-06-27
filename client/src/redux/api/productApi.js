import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filters, search, sorting, pagination
    getProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.keyword) queryParams.append("keyword", params.keyword);
        if (params.category) queryParams.append("category", params.category);
        if (params.brand) queryParams.append("brand", params.brand);
        if (params.minPrice !== undefined)
          queryParams.append("minPrice", params.minPrice);
        if (params.maxPrice !== undefined)
          queryParams.append("maxPrice", params.maxPrice);
        if (params.minRating !== undefined)
          queryParams.append("minRating", params.minRating);
        if (params.inStock !== undefined)
          queryParams.append("inStock", params.inStock);
        if (params.sort) queryParams.append("sort", params.sort);
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);

        const queryString = queryParams.toString();
        return `/products?${queryString}`;
      },
      providesTags: ["Product"],
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),

    // Get related products
    getRelatedProducts: builder.query({
      query: ({ id, limit = 8, page = 1 }) =>
        `/products/related/${id}?limit=${limit}&page=${page}`,
      providesTags: ["Product"],
    }),

    // Get products by category with filters
    getProductsByCategory: builder.query({
      query: ({ categoryId, ...params }) => {
        const queryParams = new URLSearchParams();

        if (params.keyword) queryParams.append("keyword", params.keyword);
        if (params.brand) queryParams.append("brand", params.brand);
        if (params.minPrice !== undefined)
          queryParams.append("minPrice", params.minPrice);
        if (params.maxPrice !== undefined)
          queryParams.append("maxPrice", params.maxPrice);
        if (params.minRating !== undefined)
          queryParams.append("minRating", params.minRating);
        if (params.sort) queryParams.append("sort", params.sort);
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);

        const queryString = queryParams.toString();
        return `/products/category/${categoryId}?${queryString}`;
      },
      providesTags: ["Product"],
    }),

    // Get featured products
    getFeaturedProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append("limit", params.limit);
        if (params.page) queryParams.append("page", params.page);

        const queryString = queryParams.toString();
        return `/products/featured?${queryString}`;
      },
      providesTags: ["Product"],
    }),

    // Get latest products
    getLatestProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append("limit", params.limit);
        if (params.page) queryParams.append("page", params.page);

        const queryString = queryParams.toString();
        return `/products/latest?${queryString}`;
      },
      providesTags: ["Product"],
    }),

    // Get trending products
    getTrendingProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append("limit", params.limit);
        if (params.page) queryParams.append("page", params.page);

        const queryString = queryParams.toString();
        return `/products/trending?${queryString}`;
      },
      providesTags: ["Product"],
    }),

    // Get top selling products
    getTopSellingProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.limit) queryParams.append("limit", params.limit);
        if (params.page) queryParams.append("page", params.page);

        const queryString = queryParams.toString();
        return `/products/top-selling?${queryString}`;
      },
      providesTags: ["Product"],
    }),

    // Get brands for filters
    getBrands: builder.query({
      query: (categoryId) =>
        categoryId
          ? `/products/filters/brands?category=${categoryId}`
          : "/products/filters/brands",
      providesTags: ["Product"],
    }),

    // Get price range for filters
    getPriceRange: builder.query({
      query: (categoryId) =>
        categoryId
          ? `/products/filters/price-range?category=${categoryId}`
          : "/products/filters/price-range",
      providesTags: ["Product"],
    }),

    // Create product (admin)
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update product (admin)
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete product (admin)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Get reviews for a product
    getProductReviews: builder.query({
      query: (productId) => `/reviews/${productId}`,
      providesTags: ["Review"],
    }),

    // Add review
    addReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    // Get product FAQs
    getProductFAQs: builder.query({
      query: (productId) => `/products/${productId}/faq`,
    }),

    // Add FAQ (admin)
    addFAQ: builder.mutation({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/faq`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update FAQ (admin)
    updateFAQ: builder.mutation({
      query: ({ productId, faqId, data }) => ({
        url: `/products/${productId}/faq/${faqId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete FAQ (admin)
    deleteFAQ: builder.mutation({
      query: ({ productId, faqId }) => ({
        url: `/products/${productId}/faq/${faqId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Report product
    reportProduct: builder.mutation({
      query: ({ productId, reason }) => ({
        url: `/products/${productId}/report`,
        method: "POST",
        body: { reason },
      }),
    }),

    // Get related products (old hook for backward compatibility)
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetProductsByCategoryQuery,
  useGetFeaturedProductsQuery,
  useGetLatestProductsQuery,
  useGetTrendingProductsQuery,
  useGetTopSellingProductsQuery,
  useGetBrandsQuery,
  useGetPriceRangeQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductReviewsQuery,
  useAddReviewMutation,
  useGetProductFAQsQuery,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useReportProductMutation,
  useGetProductQuery, // backward compatibility
} = productApi;
