import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    getDashboardStats: builder.query({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    getDashboardMonthlySales: builder.query({
      query: () => ({
        url: "/admin/dashboard/monthly-sales",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    getDashboardTopProducts: builder.query({
      query: () => ({
        url: "/admin/dashboard/top-products",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    getDashboardRecentOrders: builder.query({
      query: () => ({
        url: "/admin/dashboard/recent-orders",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetDashboardStatsQuery,
  useGetDashboardMonthlySalesQuery,
  useGetDashboardTopProductsQuery,
  useGetDashboardRecentOrdersQuery,
} = dashboardApi;
