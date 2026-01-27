import { Product } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Star } from "lucide-react";
import { ReviewDialog } from "@/components/ReviewDialog";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAdminActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  showAdminActions = false,
  onEdit,
  onDelete 
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <div className="aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 font-heading">{product.name}</CardTitle>
          <Badge variant={product.stock > 0 ? "default" : "secondary"} className="whitespace-nowrap">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </div>
        {product.category && (
          <Badge variant="outline" className="w-fit">
            {product.category.name}
          </Badge>
        )}
        <CardDescription className="line-clamp-2 h-[40px]">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary font-heading">
            ${product.price.toFixed(2)}
          </p>
          {product.averageRating !== null && product.averageRating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {product.averageRating.toFixed(1)}
              </span>
              {product.reviewCount !== undefined && product.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex-col">
        {!showAdminActions && onAddToCart && (
          <>
            <Button 
              className="w-full" 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <ReviewDialog product={product} />
          </>
        )}
        
        {showAdminActions && (
          <>
            <Button variant="outline" className="flex-1" onClick={() => onEdit?.(product)}>
              Edit
            </Button>
            <Button variant="destructive" className="flex-1" onClick={() => onDelete?.(product)}>
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};