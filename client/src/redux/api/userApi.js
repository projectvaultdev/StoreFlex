import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", role = "" } = {}) => {
        let queryString = `/users?page=${page}&limit=${limit}`;
        if (search) queryString += `&search=${encodeURIComponent(search)}`;
        if (role) queryString += `&role=${role}`;
        return queryString;
      },
      providesTags: ["User"],
    }),

    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/block`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    unblockUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/unblock`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // Update user details
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Create staff/manager/admin (admin routes)
    createStaff: builder.mutation({
      query: (data) => ({
        url: `/admin/staff`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateStaffMutation,
} = userApi;
