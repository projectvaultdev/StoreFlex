import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/validationSchemas";
import { useLoginMutation } from "../../redux/api/authApi";
import { setCredentials } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginUser, { isLoading }] =
    useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data).unwrap();

      dispatch(
        setCredentials({
          user: res.user,
          accessToken: res.accessToken,
        })
      );

      toast.success("Login Successful");
      console.log("Login Response:", res);
      console.log("User Object:", res.user);
      console.log("User Role:", res.user.role);

      if (
        res.user.role === "admin" ||
        res.user.role === "super_admin"
      ) {
        console.log("Admin detected, navigating to /admin");
        navigate("/admin");
      } else {
        console.log("User detected, navigating to /");
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border rounded p-3"
            />

            <p className="text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full border rounded p-3"
            />

            <p className="text-red-500 text-sm">
              {errors.password?.message}
            </p>
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            {isLoading ? "Please Wait..." : "Login"}
          </button>

        </form>

        <p className="mt-5 text-center">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 ml-2"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default LoginPage;