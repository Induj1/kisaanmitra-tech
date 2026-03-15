
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabaseExt } from '@/integrations/supabase/clientExt';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductForm from '@/components/marketplace/ProductForm';
import CreditPurchaseModal from '@/components/marketplace/CreditPurchaseModal';
import { Package, ShoppingCart, DollarSign, Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Marketplace = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [confirmPurchaseOpen, setConfirmPurchaseOpen] = useState(false);
  const [creditPurchaseOpen, setCreditPurchaseOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
    fetchProducts();
  }, [user, refreshKey]);
  
  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabaseExt
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      setProfile(data);
      
      // Fetch user's listings
      const { data: listingsData, error: listingsError } = await supabaseExt
        .from('marketplace_listings')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
        
      if (listingsError) throw listingsError;
      setMyListings(listingsData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseExt
        .from('marketplace_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch products",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddProduct = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const handleBuyProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setSelectedProduct(product);
    setConfirmPurchaseOpen(true);
  };
  
  const confirmPurchase = async () => {
    if (!selectedProduct || !user) return;
    
    try {
      // First get buyer's credit balance
      const { data: buyerData, error: buyerError } = await supabaseExt
        .from('farmer_profiles')
        .select('credit_score')
        .eq('user_id', user.id)
        .single();
        
      if (buyerError) throw buyerError;
      
      if (buyerData.credit_score < selectedProduct.price) {
        toast({
          variant: "destructive",
          title: "Insufficient Credits",
          description: `You need ${selectedProduct.price} credits to make this purchase. You currently have ${buyerData.credit_score} credits.`,
        });
        setConfirmPurchaseOpen(false);
        return;
      }
      
      // Complete the purchase
      const { error: purchaseError } = await supabaseExt
        .from('marketplace_transactions')
        .insert({
          product_id: selectedProduct.id,
          buyer_id: user.id,
          seller_id: selectedProduct.seller_id,
          amount: selectedProduct.price,
          credits_used: selectedProduct.price,
          status: 'completed',
          product_title: selectedProduct.title
        });
        
      if (purchaseError) throw purchaseError;
      
      // Update product status
      const { error: updateError } = await supabaseExt
        .from('marketplace_listings')
        .update({ status: 'sold' })
        .eq('id', selectedProduct.id);
        
      if (updateError) throw updateError;
      
      // Update buyer credits (deduct used credits)
      const { error: buyerUpdateError } = await supabaseExt
        .from('farmer_profiles')
        .update({ 
          credit_score: buyerData.credit_score - selectedProduct.price 
        })
        .eq('user_id', user.id);
        
      if (buyerUpdateError) throw buyerUpdateError;
      
      // Update seller credits (add earned credits)
      const sellerCredits = await supabaseExt.rpc('increment', { 
        row_id: selectedProduct.seller_id,
        amount: 50 // Seller earns 50 credits per sale
      });
      
      toast({
        title: "Purchase Successful",
        description: `You've purchased ${selectedProduct.title}. Seller details have been shared.`,
      });
      
      setConfirmPurchaseOpen(false);
      setSelectedProduct(null);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase",
      });
    }
  };
  
  const handleSellTabClick = () => {
    const sellTab = document.querySelector('[value="sell"]');
    if (sellTab instanceof HTMLElement) {
      sellTab.click();
    }
  };

  const handleCreditPurchaseSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Farmer's Marketplace</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Buy and sell agricultural products using farm credits
              </p>
            </div>
            
            {user && profile && (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Your Credits</div>
                  <div className="text-xl font-bold text-primary flex items-center gap-1">
                    <Coins size={18} />
                    {profile.credit_score || 0}
                  </div>
                </div>
                
                <Button onClick={() => setCreditPurchaseOpen(true)}>
                  Buy Credits
                </Button>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="browse" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Browse Products
              </TabsTrigger>
              <TabsTrigger value="sell" className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Sell Products
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-64 animate-pulse">
                      <div className="h-full bg-gray-200"></div>
                    </Card>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      seller={{
                        name: product.seller_name,
                        location: product.seller_location
                      }}
                      image={product.image_url}
                      category={product.category}
                      onBuy={handleBuyProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no products listed in the marketplace yet.
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleSellTabClick}>
                      Be the first to sell
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sell">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">List Your Product</h3>
                    <ProductForm onSuccess={handleAddProduct} sellerProfile={profile} />
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Listings</h3>
                    
                    {myListings.length > 0 ? (
                      <div className="space-y-4">
                        {myListings.map((listing) => (
                          <div 
                            key={listing.id} 
                            className="border rounded-md p-4 flex justify-between items-center"
                          >
                            <div>
                              <h4 className="font-medium">{listing.title}</h4>
                              <p className="text-sm text-gray-600">{listing.price} credits</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                listing.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {listing.status}
                              </span>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={listing.status !== 'active'}
                              onClick={async () => {
                                try {
                                  await supabaseExt
                                    .from('marketplace_listings')
                                    .update({ status: 'inactive' })
                                    .eq('id', listing.id);
                                  setRefreshKey(prev => prev + 1);
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">You haven't listed any products yet.</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={confirmPurchaseOpen} onOpenChange={setConfirmPurchaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to purchase this item?
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="py-4">
              <h4 className="font-medium">{selectedProduct.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Price:</span>
                  <span className="flex items-center">
                    <Coins size={16} className="mr-1" />
                    {selectedProduct.price} credits
                  </span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span>Credits available:</span>
                  <span>{profile?.credit_score || 0}</span>
                </div>
                
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Credits after purchase:</span>
                  <span>{(profile?.credit_score || 0) - selectedProduct.price} credits</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                The seller's contact information will be shared with you after the purchase is complete.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPurchaseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPurchase}>
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <CreditPurchaseModal 
        open={creditPurchaseOpen}
        onClose={() => setCreditPurchaseOpen(false)}
        onSuccess={handleCreditPurchaseSuccess}
      />
      
      <Footer />
    </div>
  );
};

export default Marketplace;
