import { Star } from "lucide-react";

const Rating = ({ rating = 0, count = 0, size = "md" }) => {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {stars.map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} ${star <= Math.round(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
            {count > 0 && (
                <span className="text-sm text-gray-600 ml-1">
                    ({count})
                </span>
            )}
        </div>
    );
};

export default Rating;
