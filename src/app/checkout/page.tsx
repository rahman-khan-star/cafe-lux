"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { DeliveryMethod, PaymentMethod, Address } from "@/types/order";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Banknote,
  MapPin,
  Truck,
  Store,
  ChevronRight,
  ShoppingBag,
  Package,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";

const STEPS = [
  "Customer Info",
  "Delivery Address",
  "Delivery Method",
  "Payment",
  "Review",
  "Place Order",
];

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface NewAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, delivery, tax, total, appliedCoupon, clearCart } = useCart();
  const { user, addresses, addAddress, placeOrder } = useAuth();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: user?.name.split(" ")[0] || "",
    lastName: user?.name.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || ""
  );
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddress>({
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [notes, setNotes] = useState("");

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const builtNewAddress: Address | null = useMemo(() => {
    if (!showNewAddress) return null;
    return {
      id: "new",
      label: newAddress.label || "New Address",
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      isDefault: false,
    };
  }, [showNewAddress, newAddress]);

  const activeAddress = deliveryMethod === "pickup" ? null : showNewAddress ? builtNewAddress : selectedAddress;

  const validateStep = (s: number): boolean => {
    const errs: FormErrors = {};

    if (s === 1) {
      if (!customer.firstName.trim()) errs.firstName = "First name is required";
      if (!customer.lastName.trim()) errs.lastName = "Last name is required";
      if (!customer.email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(customer.email)) errs.email = "Invalid email";
      if (!customer.phone.trim()) errs.phone = "Phone number is required";
      else if (!/^[\d\s\-+()]{7,}$/.test(customer.phone)) errs.phone = "Invalid phone number";
    }

    if (s === 2 && deliveryMethod === "delivery") {
      if (showNewAddress) {
        if (!newAddress.street.trim()) errs.street = "Street address is required";
        if (!newAddress.city.trim()) errs.city = "City is required";
        if (!newAddress.state.trim()) errs.state = "State is required";
        if (!newAddress.zip.trim()) errs.zip = "ZIP code is required";
      } else if (!selectedAddressId) {
        errs.address = "Please select or add a delivery address";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setErrors({});
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));

    if (showNewAddress && builtNewAddress) {
      addAddress({
        label: builtNewAddress.label,
        street: builtNewAddress.street,
        city: builtNewAddress.city,
        state: builtNewAddress.state,
        zip: builtNewAddress.zip,
        isDefault: false,
      });
    }

    const order = placeOrder({
      items: items.map((item) => ({
        foodId: item.food.id,
        name: item.food.name,
        price: item.food.price,
        quantity: item.quantity,
        image: item.food.image,
      })),
      subtotal,
      discount,
      delivery: deliveryMethod === "pickup" ? 0 : delivery,
      tax,
      total: deliveryMethod === "pickup" ? subtotal - discount + tax : total,
      deliveryMethod,
      paymentMethod,
      addressId: activeAddress?.id,
      couponCode: appliedCoupon?.code,
      notes: notes || undefined,
    });

    setPlacedOrderId(order.id);
    clearCart();
    setIsPlacing(false);
    setOrderPlaced(true);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
          <Link
            href="/menu"
            className="inline-flex px-8 py-3 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
          >
            Browse Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="max-w-lg mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
              <p className="text-gray-500 mb-2">
                Thank you for your order. We&apos;re getting it ready for you.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Order ID: <span className="font-mono font-semibold text-gray-700">{placedOrderId}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/dashboard/orders/${placedOrderId}`}
                  className="px-8 py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
                >
                  Track Order
                </Link>
                <Link
                  href="/menu"
                  className="px-8 py-3.5 border border-gray-300 hover:border-[#c8a97e] text-gray-700 hover:text-[#c8a97e] font-semibold text-sm uppercase tracking-widest transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />

      <section className="pt-28 pb-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#c8a97e] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {STEPS.map((label, i) => {
                const num = i + 1;
                const isActive = num === step;
                const isCompleted = num < step;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isActive
                            ? "bg-[#c8a97e] text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : num}
                      </div>
                      <span
                        className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                          isActive ? "text-[#c8a97e]" : isCompleted ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mt-0 sm:-mt-5 ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form Area */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white p-6 md:p-8 shadow-sm"
                >
                  {/* Step 1: Customer Info */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input
                          label="First Name"
                          value={customer.firstName}
                          onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                          error={errors.firstName}
                          placeholder="John"
                        />
                        <Input
                          label="Last Name"
                          value={customer.lastName}
                          onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                          error={errors.lastName}
                          placeholder="Doe"
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          error={errors.email}
                          placeholder="you@example.com"
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          error={errors.phone}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Delivery Address */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                      {errors.address && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-4">
                          {errors.address}
                        </div>
                      )}

                      {deliveryMethod === "pickup" ? (
                        <div className="bg-gray-50 border border-gray-200 p-6 text-center">
                          <Store className="w-12 h-12 text-[#c8a97e] mx-auto mb-3" />
                          <p className="font-semibold text-gray-900">Pickup at Café Lux</p>
                          <p className="text-sm text-gray-500 mt-1">
                            123 Gourmet Street, Culinary District, New York, NY 10001
                          </p>
                          <p className="text-xs text-gray-400 mt-2">Ready in approximately 20-30 minutes</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {addresses.length > 0 && !showNewAddress && (
                            <div className="space-y-3">
                              {addresses.map((addr) => (
                                <label
                                  key={addr.id}
                                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                                    selectedAddressId === addr.id
                                      ? "border-[#c8a97e] bg-[#c8a97e]/5"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => setSelectedAddressId(addr.id)}
                                    className="mt-1 accent-[#c8a97e]"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm text-gray-900">{addr.label}</span>
                                      {addr.isDefault && (
                                        <span className="text-[10px] bg-[#c8a97e]/10 text-[#c8a97e] px-2 py-0.5 font-medium">
                                          DEFAULT
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {addr.street}, {addr.city}, {addr.state} {addr.zip}
                                    </p>
                                  </div>
                                  <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                                </label>
                              ))}
                              <button
                                type="button"
                                onClick={() => setShowNewAddress(true)}
                                className="flex items-center gap-2 text-sm text-[#c8a97e] hover:text-[#b8945c] font-medium transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                Add new address
                              </button>
                            </div>
                          )}

                          {(showNewAddress || addresses.length === 0) && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-gray-900">New Address</h3>
                                {addresses.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowNewAddress(false);
                                      setErrors({});
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    Use saved address
                                  </button>
                                )}
                              </div>
                              <Input
                                label="Label"
                                value={newAddress.label}
                                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                placeholder="e.g. Home, Office"
                              />
                              <Input
                                label="Street Address"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                error={errors.street}
                                placeholder="123 Main Street, Apt 4B"
                              />
                              <div className="grid sm:grid-cols-3 gap-5">
                                <Input
                                  label="City"
                                  value={newAddress.city}
                                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                  error={errors.city}
                                  placeholder="New York"
                                />
                                <Input
                                  label="State"
                                  value={newAddress.state}
                                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                  error={errors.state}
                                  placeholder="NY"
                                />
                                <Input
                                  label="ZIP Code"
                                  value={newAddress.zip}
                                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                  error={errors.zip}
                                  placeholder="10001"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Delivery Method */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Method</h2>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center gap-4 p-5 border cursor-pointer transition-colors ${
                            deliveryMethod === "delivery"
                              ? "border-[#c8a97e] bg-[#c8a97e]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryMethod === "delivery"}
                            onChange={() => setDeliveryMethod("delivery")}
                            className="accent-[#c8a97e]"
                          />
                          <Truck className="w-6 h-6 text-[#c8a97e] shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Delivery</p>
                            <p className="text-sm text-gray-500">Delivered to your address in 30-45 minutes</p>
                          </div>
                          <span className="font-semibold text-sm text-gray-700">${delivery.toFixed(2)}</span>
                        </label>

                        <label
                          className={`flex items-center gap-4 p-5 border cursor-pointer transition-colors ${
                            deliveryMethod === "pickup"
                              ? "border-[#c8a97e] bg-[#c8a97e]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            checked={deliveryMethod === "pickup"}
                            onChange={() => setDeliveryMethod("pickup")}
                            className="accent-[#c8a97e]"
                          />
                          <Store className="w-6 h-6 text-[#c8a97e] shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Pickup</p>
                            <p className="text-sm text-gray-500">Ready for pickup in 20-30 minutes</p>
                          </div>
                          <span className="font-semibold text-sm text-green-600">Free</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Payment Method */}
                  {step === 4 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                      <div className="space-y-3">
                        <label
                          className={`flex items-center gap-4 p-5 border cursor-pointer transition-colors ${
                            paymentMethod === "cod"
                              ? "border-[#c8a97e] bg-[#c8a97e]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                            className="accent-[#c8a97e]"
                          />
                          <Banknote className="w-6 h-6 text-[#c8a97e] shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Cash on Delivery</p>
                            <p className="text-sm text-gray-500">Pay with cash when your order arrives</p>
                          </div>
                        </label>

                        <label
                          className={`flex items-center gap-4 p-5 border cursor-pointer transition-colors ${
                            paymentMethod === "stripe"
                              ? "border-[#c8a97e] bg-[#c8a97e]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "stripe"}
                            onChange={() => setPaymentMethod("stripe")}
                            className="accent-[#c8a97e]"
                          />
                          <CreditCard className="w-6 h-6 text-[#c8a97e] shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Credit / Debit Card</p>
                            <p className="text-sm text-gray-500">Pay securely with Stripe</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">
                              VISA
                            </div>
                            <div className="w-8 h-5 bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">
                              MC
                            </div>
                          </div>
                        </label>
                      </div>

                      {paymentMethod === "stripe" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 p-5 bg-gray-50 border border-gray-200"
                        >
                          <p className="text-sm text-gray-500 mb-4">
                            Stripe integration is being prepared. Card payment will be available soon.
                          </p>
                          <div className="space-y-4">
                            <Input label="Card Number" placeholder="4242 4242 4242 4242" disabled />
                            <div className="grid grid-cols-2 gap-4">
                              <Input label="Expiry" placeholder="MM / YY" disabled />
                              <Input label="CVC" placeholder="123" disabled />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Step 5: Review Order */}
                  {step === 5 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                      {/* Customer Info Summary */}
                      <div className="mb-5">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                          Customer Information
                        </h3>
                        <div className="bg-gray-50 p-4 text-sm text-gray-700">
                          <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                          <p>{customer.email} &middot; {customer.phone}</p>
                        </div>
                      </div>

                      {/* Delivery Info Summary */}
                      <div className="mb-5">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                          {deliveryMethod === "pickup" ? "Pickup" : "Delivery Address"}
                        </h3>
                        <div className="bg-gray-50 p-4 text-sm text-gray-700">
                          {deliveryMethod === "pickup" ? (
                            <p>Pickup at Café Lux &mdash; 123 Gourmet Street, New York, NY 10001</p>
                          ) : activeAddress ? (
                            <p>{activeAddress.street}, {activeAddress.city}, {activeAddress.state} {activeAddress.zip}</p>
                          ) : (
                            <p className="text-red-500">No address selected</p>
                          )}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="mb-5">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                          Payment Method
                        </h3>
                        <div className="bg-gray-50 p-4 text-sm text-gray-700 flex items-center gap-2">
                          {paymentMethod === "cod" ? (
                            <>
                              <Banknote className="w-4 h-4 text-[#c8a97e]" />
                              Cash on Delivery
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 text-[#c8a97e]" />
                              Credit / Debit Card (Stripe)
                            </>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-5">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                          Order Items
                        </h3>
                        <div className="divide-y divide-gray-100 border border-gray-200">
                          {items.map((item) => (
                            <div key={item.food.id} className="flex items-center gap-3 p-4">
                              <div className="relative w-12 h-12 shrink-0 overflow-hidden">
                                <Image
                                  src={item.food.image}
                                  alt={item.food.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">{item.food.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-sm text-gray-900">
                                ${(item.food.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase mb-1.5">
                          Order Notes (optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special instructions..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#c8a97e] resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 6: Place Order */}
                  {step === 6 && (
                    <div className="text-center py-6">
                      <Package className="w-16 h-16 text-[#c8a97e] mx-auto mb-4" />
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Your Order</h2>
                      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        Please review your order details. By placing this order, you agree to our terms
                        and conditions.
                      </p>

                      <div className="bg-gray-50 p-5 text-left max-w-md mx-auto mb-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Items</span>
                          <span className="font-medium text-gray-900">{items.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            {deliveryMethod === "pickup" ? "Delivery" : "Delivery"}
                          </span>
                          <span className="font-medium text-gray-900">
                            {deliveryMethod === "pickup" ? "Free" : `$${delivery.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax</span>
                          <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-[#c8a97e] text-lg">
                            ${(deliveryMethod === "pickup" ? subtotal - discount + tax : total).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 6 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-2 px-8 py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={isPlacing}
                        className="flex items-center gap-2 px-8 py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                      >
                        {isPlacing ? (
                          <span className="animate-pulse">Placing Order...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Place Order
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-sm sticky top-28">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.food.id} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 shrink-0 overflow-hidden">
                        <Image
                          src={item.food.image}
                          alt={item.food.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{item.food.name}</p>
                        <p className="text-[11px] text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-gray-900">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span>
                      {deliveryMethod === "pickup"
                        ? "Free"
                        : `$${delivery.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                      <span>Total</span>
                      <span>
                        $
                        {(
                          deliveryMethod === "pickup"
                            ? subtotal - discount + tax
                            : total
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
