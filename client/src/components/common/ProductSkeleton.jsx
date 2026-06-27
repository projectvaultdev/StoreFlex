const ProductSkeleton = () => {
    return (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-64 bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-4 space-y-4">
                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4" />

                {/* Category */}
                <div className="h-3 bg-gray-200 rounded w-1/2" />

                {/* Price section */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>

                {/* Rating and stock */}
                <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                    <div className="h-8 bg-gray-200 rounded flex-1" />
                    <div className="h-8 bg-gray-200 rounded w-10" />
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
