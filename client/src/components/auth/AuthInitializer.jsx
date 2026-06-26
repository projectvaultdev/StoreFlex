import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setCredentials,
    setAuthLoading,
    setAuthError,
} from "../../redux/slices/authSlice";
import { useGetMeQuery } from "../../redux/api/authApi";

const AuthInitializer = () => {
    const dispatch = useDispatch();
    const currentAccessToken = useSelector(
        (state) => state.auth.accessToken
    );

    const {
        data,
        isSuccess,
        isLoading,
        isError,
        error,
    } = useGetMeQuery();

    useEffect(() => {
        // While loading, keep authLoading=true
        if (isLoading) {
            console.log("AuthInitializer: Fetching user from /auth/me...");
            dispatch(setAuthLoading(true));
            return;
        }

        // If success, set user and mark as loaded
        if (isSuccess && data?.user) {
            console.log(
                "AuthInitializer: User restored from /auth/me",
                data.user
            );
            dispatch(
                setCredentials({
                    user: data.user,
                    accessToken: currentAccessToken || null,
                })
            );
            dispatch(setAuthLoading(false));
            return;
        }

        // If error, clear loading and set error
        if (isError) {
            console.log("AuthInitializer: Failed to fetch user", error);
            dispatch(setAuthError(error?.data?.message || "Auth failed"));
            dispatch(setAuthLoading(false));
            return;
        }
    }, [isLoading, isSuccess, isError, data, error, dispatch, currentAccessToken]);

    return null;
};

export default AuthInitializer;