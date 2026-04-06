// Cart state management using sessionStorage
// Key: squirrel_made_cart

export interface CartItem {
    id: number;
    name: string;
    price: number; // USD float, e.g. 21.00
    image: string;
    quantity: number;
    catalogObjectId?: string; // Square Catalog Object ID for tax/catalog linking
    type: 'bottle' | 'bag';  // Item type for shipping tier logic
}

const CART_KEY = 'squirrel_made_cart';

export function getCart(): CartItem[] {
    try {
        const raw = sessionStorage.getItem(CART_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
}

function saveCart(items: CartItem[]): void {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, 'quantity'>): CartItem[] {
    const cart = getCart();
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
    return cart;
}

export function removeFromCart(id: number): CartItem[] {
    const cart = getCart().filter((c) => c.id !== id);
    saveCart(cart);
    return cart;
}

export function updateQuantity(id: number, qty: number): CartItem[] {
    const cart = getCart();
    if (qty <= 0) return removeFromCart(id);
    const item = cart.find((c) => c.id === id);
    if (item) item.quantity = qty;
    saveCart(cart);
    return cart;
}

export function clearCart(): void {
    sessionStorage.removeItem(CART_KEY);
}

export function getCartCount(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
