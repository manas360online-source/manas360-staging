
import React, { useState, useEffect } from 'react';
import { shopService, Product } from '../utils/shopService';

interface ShopProductDetailProps {
  productId: string;
}

export const ShopProductDetail: React.FC<ShopProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const p = shopService.getProductById(productId);
    if (p) {
      setProduct(p);
      setActiveImage(p.image);
    }
  }, [productId]);

  const handleAddToCart = (isBuyNow = false) => {
    if (product) {
      shopService.addToCart(product, qty);
      if (isBuyNow) {
        window.location.hash = '#/cart';
      } else {
        alert(`${qty} x ${product.name} added to cart!`);
      }
    }
  };

  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] pt-24 pb-12 px-6 transition-colors duration-500">
      <div className="max-w-[1100px] mx-auto">
        <button onClick={() => window.location.hash = '#/shop'} className="mb-8 text-[#0A3A78] dark:text-sky-400 font-bold hover:underline">← Back to Shop</button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-[32px] overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${activeImage === img ? 'border-[#1FA2DE]' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
              {/* Fake Video Thumbnail */}
              <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl cursor-pointer hover:bg-slate-200">
                ▶️
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="mb-4">
              <span className="bg-blue-50 dark:bg-sky-900/30 text-[#0A3A78] dark:text-sky-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
            </div>
            <h1 className="font-serif text-[2.5rem] text-[#0A3A78] dark:text-white font-bold leading-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-slate-500 dark:text-slate-400">{product.rating} ({product.reviews} reviews)</span>
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-bold">• In Stock</span>
              ) : (
                <span className="text-red-500 font-bold">• Out of Stock</span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">{product.fullDesc}</p>

            {/* Price & Actions */}
            <div className="bg-white dark:bg-[#111827] p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-bold text-[#1A1A1A] dark:text-white">₹{product.price}</span>
                {product.comparePrice && <span className="text-xl text-slate-400 line-through mb-1">₹{product.comparePrice}</span>}
              </div>

              {product.stock > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 gap-4">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-xl font-bold text-[#0A3A78] dark:text-sky-400">−</button>
                      <span className="font-bold text-lg dark:text-white w-4 text-center">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="text-xl font-bold text-[#0A3A78] dark:text-sky-400">+</button>
                    </div>
                    <span className="text-xs text-slate-400">Select Quantity</span>
                  </div>

                  {/* Bulk Discount Table */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm">
                    <p className="font-bold mb-2 text-[#0A3A78] dark:text-sky-300">Bulk Savings:</p>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Buy 2: <span className="text-green-600 font-bold">5% Off</span></span>
                      <span>Buy 3: <span className="text-green-600 font-bold">12% Off</span></span>
                      <span>Buy 4+: <span className="text-green-600 font-bold">15% Off</span></span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => handleAddToCart(false)} className="flex-1 py-4 rounded-full border-2 border-[#1FA2DE] text-[#1FA2DE] font-bold hover:bg-[#1FA2DE] hover:text-white transition-all">Add to Cart</button>
                    <button onClick={() => handleAddToCart(true)} className="flex-1 py-4 rounded-full bg-[#0A3A78] text-white font-bold hover:bg-[#0A4E89] shadow-lg transition-all">Buy Now</button>
                  </div>
                </div>
              ) : (
                <button disabled className="w-full py-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold cursor-not-allowed">Out of Stock</button>
              )}
            </div>

            {/* Specs */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="font-serif text-xl font-bold text-[#0A3A78] dark:text-white mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{spec.key}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
