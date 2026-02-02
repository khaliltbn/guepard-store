import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    showCount?: boolean;
    totalRatings?: number;
}

export const StarRating = ({
    rating,
    maxRating = 5,
    size = "md",
    interactive = false,
    onRatingChange,
    showCount = false,
    totalRatings = 0,
}: StarRatingProps) => {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
                {Array.from({ length: maxRating }).map((_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= Math.round(rating);
                    const isPartiallyFilled = !isFilled && starValue === Math.ceil(rating) && rating % 1 !== 0;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleClick(starValue)}
                            disabled={!interactive}
                            className={cn(
                                "transition-transform",
                                interactive && "cursor-pointer hover:scale-110",
                                !interactive && "cursor-default"
                            )}
                        >
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    "transition-colors",
                                    isFilled && "fill-yellow-400 text-yellow-400",
                                    isPartiallyFilled && "fill-yellow-400/50 text-yellow-400",
                                    !isFilled && !isPartiallyFilled && "text-muted-foreground/40"
                                )}
                            />
                        </button>
                    );
                })}
            </div>
            {showCount && totalRatings > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                    ({totalRatings})
                </span>
            )}
            {showCount && totalRatings === 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                    (No ratings)
                </span>
            )}
        </div>
    );
};
