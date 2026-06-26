import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/validationSchemas";
import { useRegisterMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [registerUser, { isLoading }] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data).unwrap();

      toast.success(
        res.message || "Registration successful"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">

      <h2 className="text-2xl font-bold mb-5">
        Register
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="border w-full p-2"
        />

        <p>{errors.name?.message}</p>

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="border w-full p-2"
        />

        <p>{errors.email?.message}</p>

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="border w-full p-2"
        />

        <p>{errors.password?.message}</p>

        <button
          disabled={isLoading}
          className="bg-black text-white px-4 py-2"
        >
          {isLoading
            ? "Loading..."
            : "Register"}
        </button>

      </form>

      <Link to="/login">
        Already have account?
      </Link>

    </div>
  );
};

export default RegisterPage;