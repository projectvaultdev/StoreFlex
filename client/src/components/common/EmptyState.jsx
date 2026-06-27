import { Package } from "lucide-react";

const EmptyState = ({
    icon: Icon = Package,
    title = "No items found",
    description = "Try adjusting your filters or search terms",
    action = null,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <Icon className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
};

export default EmptyState;
