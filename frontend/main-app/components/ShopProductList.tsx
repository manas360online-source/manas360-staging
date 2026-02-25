
import React, { useState, useEffect } from 'react';
import { shopService, Product } from '../utils/shopService';

export const ShopProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    setProducts(shopService.getProducts());
  }, []);

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    shopService.addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  const navigateToProduct = (id: string) => {
    window.location.hash = `#/shop-product/${id}`;
  };

  const filteredProducts = products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.shortDesc.toLowerCase().includes(search.toLowerCase()))
    .filter(p => !inStockOnly || p.stock > 0)
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0; // featured
    });

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-[#030712] pt-24 pb-12 px-6 transition-colors duration-500">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => window.location.hash = '#/home'} 
          className="mb-8 text-[#0A3A78] dark:text-sky-400 font-bold flex items-center gap-2 hover:underline transition-all"
        >
          <span className="text-xl">←</span> Back to Home
        </button>

        <header className="mb-10 text-center">
          <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] text-[#0A3A78] dark:text-white font-bold mb-4">Wellness Shop</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Curated supplements, therapy tools, and merchandise.</p>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 justify-between items-center sticky top-20 z-40 bg-[#FDFCF8]/90 dark:bg-[#030712]/90 backdrop-blur-md py-4 transition-colors">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'Herbal Supplements', 'Sound Therapy', 'Wellness Merchandise'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${category === cat ? 'bg-[#1FA2DE] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1FA2DE]"
            />
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => navigateToProduct(product.id)}
              className="group bg-white dark:bg-[#111827] rounded-[24px] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-60 overflow-hidden bg-slate-50 dark:bg-slate-900">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-[#0A3A78] text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                )}
                {product.comparePrice && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </span>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center">
                    <span className="bg-slate-800 text-white px-4 py-2 rounded-full font-bold">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">{product.category}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-serif text-xl font-bold text-[#0A3A78] dark:text-white mb-2 leading-tight">{product.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{product.shortDesc}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-[#1A1A1A] dark:text-white block">₹{product.price}</span>
                    {product.comparePrice && (
                      <span className="text-sm text-slate-400 line-through">₹{product.comparePrice}</span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => addToCart(e, product)}
                    disabled={product.stock === 0}
                    className="w-10 h-10 rounded-full bg-[#1FA2DE] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {/* Bulk Hint */}
                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-2 text-center bg-green-50 dark:bg-green-900/20 py-1 rounded">
                  Buy 2+ items & save 5-15%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
