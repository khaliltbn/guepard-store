import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { submitRating } from "@/services/api";
import { Product } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface RatingDialogProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const RatingDialog = ({ product, isOpen, onOpenChange }: RatingDialogProps) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [guestName, setGuestName] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => submitRating(product.id, rating, review || undefined, guestName || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: "Rating submitted!",
                description: "Thank you for your feedback.",
            });
            onOpenChange(false);
            setRating(0);
            setReview("");
            setGuestName("");
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to submit rating. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast({
                title: "Please select a rating",
                description: "Click on the stars to select your rating.",
                variant: "destructive",
            });
            return;
        }
        mutation.mutate();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rate this product</DialogTitle>
                    <DialogDescription>
                        Share your experience with {product.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-2 py-4">
                        <Label className="text-center">Your Rating</Label>
                        <StarRating
                            rating={rating}
                            interactive
                            onRatingChange={setRating}
                            size="lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="guestName">Your Name (optional)</Label>
                        <Input
                            id="guestName"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Anonymous"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="review">Review (optional)</Label>
                        <Textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Tell us what you think about this product..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Submitting..." : "Submit Rating"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
