import { useGetCategoriesQuery } from "../../redux/api/categoryApi";

const CategoriesPage = () => {
    const { data, isLoading, error } =
        useGetCategoriesQuery();

    if (isLoading) return <h2>Loading...</h2>;

    if (error) return <h2>Error loading categories</h2>;

    return (
        <div className="max-w-7xl mx-auto p-5">
            <h1 className="text-3xl font-bold mb-6">
                Categories
            </h1>

            <div className="grid md:grid-cols-4 gap-4">
                {data?.categories?.map((category) => (
                    <div
                        key={category._id}
                        className="border rounded p-4 shadow"
                    >
                        <h3 className="font-semibold">
                            {category.name}
                        </h3>

                        <p>{category.slug}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;