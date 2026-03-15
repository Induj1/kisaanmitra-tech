
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, ShoppingCart, Package } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: {
    name: string;
    location: string;
  };
  image?: string;
  category: string;
  onBuy: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  seller,
  image,
  category,
  onBuy
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-gray-100">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <Package size={48} className="text-gray-400" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-primary">{category}</Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="flex items-center">
          <Tag size={14} className="mr-1" />
          <span>{price} credits</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Seller: {seller.name}</p>
          <p className="text-xs text-gray-500">Location: {seller.location}</p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full flex items-center justify-center" 
          onClick={() => onBuy(id)}
        >
          <ShoppingCart size={16} className="mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
