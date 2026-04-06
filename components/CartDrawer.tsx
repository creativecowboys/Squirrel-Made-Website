import React, { useState } from 'react';
import {
    CartItem,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSubtotal,
} from '../src/cart';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    onCartChange: (cart: CartItem[]) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onCartChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotal = getCartSubtotal(cart);

    const handleRemove = (id: number) => {
        onCartChange(removeFromCart(id));
    };

    const handleQuantity = (id: number, qty: number) => {
        onCartChange(updateQuantity(id, qty));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = import.meta.env.VITE_CHECKOUT_API_URL || '/api/checkout';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart.map((item) => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        catalogObjectId: item.catalogObjectId,
                        type: item.type,
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed. Please try again.');
            }

            clearCart();
            onCartChange([]);
            window.location.href = data.checkoutUrl;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#faf8f5] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                aria-label="Shopping cart"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#2c3a2e]/10">
                    <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-[#2c3a2e]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        <h2 className="text-lg font-serif italic text-[#2c3a2e]">Your Cart</h2>
                        {cart.length > 0 && (
                            <span className="text-xs font-semibold bg-[#2c3a2e] text-[#f5f2ed] rounded-full w-5 h-5 flex items-center justify-center">
                                {cart.reduce((sum, i) => sum + i.quantity, 0)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2c3a2e]/8 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#2c3a2e]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-[#2c3a2e]/8 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-[#2c3a2e]/40">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-serif italic text-[#2c3a2e] text-lg">Your cart is empty</p>
                                <p className="text-sm text-[#2c3a2e]/50 mt-1">Add some products to get started.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="mt-2 px-6 py-2.5 bg-[#2c3a2e] text-[#f5f2ed] rounded-full text-sm font-semibold hover:bg-[#4a5d4e] transition-colors"
                            >
                                Browse Products
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4" role="list">
                            {cart.map((item) => (
                                <li key={item.id} className="flex gap-4 bg-white rounded-xl p-4 border border-[#2c3a2e]/8 shadow-sm">
                                    {/* Product image */}
                                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#f5f2ed]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#2c3a2e] leading-tight truncate">{item.name}</p>
                                        <p className="text-sm text-[#2c3a2e]/60 mt-0.5">${item.price.toFixed(2)}</p>

                                        {/* Quantity control */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                                aria-label={`Decrease quantity of ${item.name}`}
                                                className="w-7 h-7 rounded-full bg-[#f5f2ed] border border-[#2c3a2e]/15 flex items-center justify-center hover:bg-[#2c3a2e] hover:text-[#f5f2ed] hover:border-[#2c3a2e] transition-colors text-[#2c3a2e] font-bold text-sm"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center text-sm font-semibold text-[#2c3a2e]">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                                aria-label={`Increase quantity of ${item.name}`}
                                                className="w-7 h-7 rounded-full bg-[#f5f2ed] border border-[#2c3a2e]/15 flex items-center justify-center hover:bg-[#2c3a2e] hover:text-[#f5f2ed] hover:border-[#2c3a2e] transition-colors text-[#2c3a2e] font-bold text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total + remove */}
                                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                                        <p className="text-sm font-bold text-[#2c3a2e]">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            aria-label={`Remove ${item.name}`}
                                            className="text-[#2c3a2e]/30 hover:text-red-500 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer — only shown when cart has items */}
                {cart.length > 0 && (
                    <div className="border-t border-[#2c3a2e]/10 px-6 py-5 space-y-4 bg-white">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#2c3a2e]/60">Subtotal</span>
                            <span className="text-xl font-serif font-bold text-[#2c3a2e]">${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-[#2c3a2e]/40">Taxes & shipping calculated at checkout.</p>

                        {/* Error */}
                        {error && (
                            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        {/* Checkout button */}
                        <button
                            id="checkout-button"
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2c3a2e] text-[#f5f2ed] rounded-full font-semibold text-sm tracking-wide hover:bg-[#4a5d4e] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating checkout…
                                </>
                            ) : (
                                <>
                                    Checkout
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Square badge */}
                        <p className="text-center text-xs text-[#2c3a2e]/30">
                            Secure checkout powered by Square
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
