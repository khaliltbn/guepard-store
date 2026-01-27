import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare } from "lucide-react";
import { getReviews, createReview } from "@/services/api";
import { Review, Product } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewDialogProps {
  product: Product;
  trigger?: React.ReactNode;
}

export const ReviewDialog = ({ product, trigger }: ReviewDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', product.id],
    queryFn: () => getReviews(product.id),
    enabled: isOpen,
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: { productId: string; rating: number; comment?: string }) => createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', product.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setRating(0);
      setComment("");
      toast({ title: "Review submitted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    createReviewMutation.mutate({
      productId: product.id,
      rating,
      comment: comment || undefined,
    });
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <MessageSquare className="w-4 h-4" />
      Reviews
      {product.reviewCount !== undefined && product.reviewCount > 0 && (
        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
          {product.reviewCount}
        </span>
      )}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reviews for {product.name}</DialogTitle>
          <DialogDescription>
            {product.averageRating !== null && product.averageRating !== undefined ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{product.averageRating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Based on {product.reviewCount || 0} {product.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            ) : (
              "No reviews yet. Be the first to review!"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <div>
              <Label>Your Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Your Review (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="mt-2"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={rating === 0 || createReviewMutation.isPending}>
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>

          <div className="space-y-4">
            <h3 className="font-semibold">All Reviews ({reviews.length})</h3>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: Review) => (
                  <div key={review.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
