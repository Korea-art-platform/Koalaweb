import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import ArtistLab from "./pages/Artist/ArtistLab";
import SmartStore from "./pages/SmartStore";
import ARView from "./pages/ARView";
import ResellMarket from "./pages/ResellMarket";
import ProductDetail from "./pages/ProductDetail";
import ArtistDetail from "./pages/Artist/ArtistDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Account from "./pages/Account";
import AccountAddresses from "./pages/AccountAddresses";
import AccountPaymentMethods from "./pages/AccountPaymentMethods";
import AccountOrders from "./pages/AccountOrders";
import Product360View from "./pages/Product360View";
import OAuth2Callback from "./pages/OAuth2Callback";
import AccountWishlist from "./pages/AccountWishlist";
import ForgotPassword from "./pages/ForgotPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artist-lab" element={<ArtistLab />} />
      <Route path="/artist/:id" element={<ArtistDetail />} />
      <Route path="/smart-store" element={<SmartStore />} />
      <Route path="/store" element={<SmartStore />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/product/:id/360" element={<Product360View />} />
      <Route path="/ar-view" element={<ARView />} />
      <Route path="/resell" element={<ResellMarket />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/confirm" element={<OrderConfirmation />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/account" element={<Account />} />
      <Route path="/account/addresses" element={<AccountAddresses />} />
      <Route path="/account/payment-methods" element={<AccountPaymentMethods />} />
      <Route path="/account/orders" element={<AccountOrders />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/fail" element={<PaymentFail />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      <Route path="/account/wishlist" element={<AccountWishlist />} />
    </Routes>
  );
}