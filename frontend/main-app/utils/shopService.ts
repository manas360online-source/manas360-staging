
export interface Product {
  id: string;
  name: string;
  category: 'Herbal Supplements' | 'Sound Therapy' | 'Wellness Merchandise';
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  shortDesc: string;
  fullDesc: string;
  specs: { key: string; value: string }[];
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  items: CartItem[];
  tracking?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'ashwagandha-60',
    name: 'Ashwagandha Calm Capsules',
    category: 'Herbal Supplements',
    price: 499,
    comparePrice: 699,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593033538830-4e3a45c36322?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Premium root extract for stress relief and cortisol balance.',
    fullDesc: 'Our organic Ashwagandha helps your body manage stress. Made with KSM-66 extract for highest potency. Supports sleep, anxiety reduction, and muscle recovery.',
    specs: [
      { key: 'Dosage', value: '500mg' },
      { key: 'Count', value: '60 Capsules' },
      { key: 'Type', value: 'Vegetarian' }
    ],
    stock: 50,
    rating: 4.8,
    reviews: 124,
    isNew: true
  },
  {
    id: 'singing-bowl-set',
    name: 'Tibetan Singing Bowl Set',
    category: 'Sound Therapy',
    price: 2499,
    comparePrice: 3500,
    image: 'https://images.unsplash.com/photo-1599573887199-63309a474665?q=80&w=800&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1599573887199-63309a474665?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=800&auto=format&fit=crop'
    ],
    shortDesc: 'Hand-hammered brass bowl for deep meditation.',
    fullDesc: 'Authentic Tibetan singing bowl crafted by artisans. Produces a rich, deep tone perfect for meditation, chakra balancing, and stress reduction.',
    specs: [
      { key: 'Material', value: 'Brass Alloy' },
      { key: 'Diameter', value: '4.5 inches' },
      { key: 'Includes', value: 'Bowl, Cushion, Striker' }
    ],
    stock: 15,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'brahmi-oil',
    name: 'Brahmi Focus Oil',
    category: 'Herbal Supplements',
    price: 399,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5e84e48?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5e84e48?q=80&w=800&auto=format&fit=crop'],
    shortDesc: 'Traditional Ayurvedic oil for memory and concentration.',
    fullDesc: 'Pure Brahmi oil infused with cooling herbs. Massage onto scalp to relieve stress, improve sleep, and boost cognitive function.',
    specs: [
      { key: 'Volume', value: '200ml' },
      { key: 'Base', value: 'Coconut Oil' },
      { key: 'Origin', value: 'Kerala, India' }
    ],
    stock: 100,
    rating: 4.5,
    reviews: 45
  },
  {
    id: 'wellness-journal',
    name: '360° Gratitude Journal',
    category: 'Wellness Merchandise',
    price: 799,
    comparePrice: 999,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'],
    shortDesc: 'Daily prompts for mindfulness and reflection.',
    fullDesc: 'A beautifully designed hardcover journal with daily prompts to help you track your mood, practice gratitude, and set intentions.',
    specs: [
      { key: 'Pages', value: '200' },
      { key: 'Paper', value: '100gsm Acid-Free' },
      { key: 'Binding', value: 'Hardcover' }
    ],
    stock: 200,
    rating: 4.7,
    reviews: 210
  },
  {
    id: 'sleep-mask',
    name: 'Silk Sleep Mask',
    category: 'Wellness Merchandise',
    price: 599,
    image: 'https://images.unsplash.com/photo-1635863152637-2591603d32ce?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1635863152637-2591603d32ce?q=80&w=800&auto=format&fit=crop'],
    shortDesc: '100% Mulberry silk for uninterrupted sleep.',
    fullDesc: 'Block out light completely with our luxurious silk sleep mask. Gentle on skin and eyes, promoting deep REM sleep.',
    specs: [
      { key: 'Material', value: 'Mulberry Silk' },
      { key: 'Size', value: 'Adjustable' },
      { key: 'Washable', value: 'Hand Wash' }
    ],
    stock: 0, // Out of stock demo
    rating: 4.6,
    reviews: 56
  },
  {
    id: 'chimes',
    name: 'Wind Chimes - 432Hz',
    category: 'Sound Therapy',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop'],
    shortDesc: 'Tuned wind chimes for calming ambient sound.',
    fullDesc: 'Precision-tuned wind chimes that resonate at 432Hz, known as the miracle tone for healing and relaxation.',
    specs: [
      { key: 'Material', value: 'Aluminum' },
      { key: 'Tuning', value: '432Hz' },
      { key: 'Length', value: '30 inches' }
    ],
    stock: 25,
    rating: 4.9,
    reviews: 32
  }
];

export const shopService = {
  getProducts: () => PRODUCTS,
  
  getProductById: (id: string) => PRODUCTS.find(p => p.id === id),
  
  getCart: (): CartItem[] => {
    try {
      return JSON.parse(localStorage.getItem('mans360_cart') || '[]');
    } catch { return []; }
  },

  addToCart: (product: Product, qty: number) => {
    const cart = shopService.getCart();
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    localStorage.setItem('mans360_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  },

  removeFromCart: (id: string) => {
    const cart = shopService.getCart().filter(c => c.id !== id);
    localStorage.setItem('mans360_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  },

  updateQuantity: (id: string, qty: number) => {
    const cart = shopService.getCart();
    const item = cart.find(c => c.id === id);
    if (item) {
      item.quantity = qty;
      if (item.quantity <= 0) {
        shopService.removeFromCart(id);
        return;
      }
    }
    localStorage.setItem('mans360_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  },

  clearCart: () => {
    localStorage.removeItem('mans360_cart');
    window.dispatchEvent(new Event('cart-updated'));
  },

  calculateTotals: () => {
    const cart = shopService.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Bulk Discount Logic
    // Qty 2 -> 5%, Qty 3 -> 12%, Qty 4+ -> 15%
    let totalDiscount = 0;
    cart.forEach(item => {
      let rate = 0;
      if (item.quantity >= 4) rate = 0.15;
      else if (item.quantity === 3) rate = 0.12;
      else if (item.quantity === 2) rate = 0.05;
      totalDiscount += (item.price * item.quantity * rate);
    });

    const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 50) : 0;
    const gst = (subtotal - totalDiscount) * 0.18; // 18% GST demo
    const total = (subtotal - totalDiscount) + shipping + gst;

    return { subtotal, discount: totalDiscount, shipping, gst, total };
  },

  // Mock Order History
  getOrders: (): Order[] => {
    try {
      return JSON.parse(localStorage.getItem('mans360_orders') || '[]');
    } catch { return []; }
  },

  placeOrder: (cartItems: CartItem[], total: number) => {
    const orders = shopService.getOrders();
    const newOrder: Order = {
      id: `ORD-20250106-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      status: 'Processing',
      total,
      items: cartItems,
      tracking: 'AWB' + Math.floor(Math.random() * 10000000)
    };
    orders.unshift(newOrder);
    localStorage.setItem('mans360_orders', JSON.stringify(orders));
    shopService.clearCart();
    return newOrder.id;
  }
};
