import { Route, Routes } from "react-router";

// 🌟 1. 방금 만든 공통 라우트/레이아웃 컴포넌트 불러오기
import ProtectedRoute from "@/app/components/routers/ProtectedRoute";
import AccountLayout from "@/app/components/layouts/AccountLayout";

// 루트 페이지
import Home from "@/app/pages/Home";
import Search from "@/app/pages/Search";
import SmartStore from "@/app/pages/product/SmartStore";
import ARView from "@/app/pages/later/ARView";
import ResellMarket from "@/app/pages/later/ResellMarket";

// 아티스트
import ArtistLab from "@/app/pages/Artist/ArtistLab";
import ArtistDetail from "@/app/pages/Artist/ArtistDetail";

// 상품
import ProductDetail from "@/app/pages/product/Detail";
import Product360View from "@/app/pages/product/View360";

// 인증
import Auth from "@/app/pages/auth/Auth";
import ForgotPassword from "@/app/pages/auth/ForgotPassword";
import Onboarding from "@/app/pages/auth/Onboarding";
import OAuth2Callback from "@/app/pages/auth/OAuth2Callback";

// 주문
import Cart from "@/app/pages/order/Cart";
import Checkout from "@/app/pages/order/Checkout";
import OrderConfirmation from "@/app/pages/order/Confirmation";
import CheckoutSuccess from "@/app/pages/order/Success";

// 결제
import PaymentSuccess from "@/app/pages/payment/Success";
import PaymentFail from "@/app/pages/payment/Fail";

// 마이페이지
import Account from "@/app/pages/account/index";
import AccountOrders from "@/app/pages/account/Orders";
import AccountAddresses from "@/app/pages/account/Addresses";
import AccountPaymentMethods from "@/app/pages/account/PaymentMethods";
import AccountWishlist from "@/app/pages/account/Wishlist";
import OrderDetail from "@/app/pages/account/OrderDetail";

export function AppRoutes() {
  return (
    <Routes>
      {/* ── 🟢 누구나 접근 가능한 영역 ──────────────────────────────────────── */}
      
      {/* 메인 */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />

      {/* 스토어 */}
      <Route path="/smart-store" element={<SmartStore />} />
      <Route path="/store" element={<SmartStore />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/product/:id/360" element={<Product360View />} />
      <Route path="/ar-view" element={<ARView />} />
      <Route path="/resell" element={<ResellMarket />} />

      {/* 아티스트 */}
      <Route path="/artist-lab" element={<ArtistLab />} />
      <Route path="/artist/:id" element={<ArtistDetail />} />

      {/* 인증 */}
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />

      {/* ── 🔴 로그인 필수 구역 (ProtectedRoute로 보호됨) ───────────────────────── */}
      <Route element={<ProtectedRoute />}>
        
        {/* 가입 후 온보딩 */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* 장바구니 / 주문 */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/confirm" element={<OrderConfirmation />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />

        {/* 결제 */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />

        {/* 📦 마이페이지 그룹 (AccountLayout 안에서 렌더링됨) */}
        <Route element={<AccountLayout />}>
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<AccountOrders />} />
          <Route path="/account/orders/:orderNo" element={<OrderDetail />} />
          <Route path="/account/addresses" element={<AccountAddresses />} />
          <Route path="/account/payment-methods" element={<AccountPaymentMethods />} /> {/* 오타 수정됨 */}
          <Route path="/account/wishlist" element={<AccountWishlist />} />
        </Route>

      </Route>
      {/* ───────────────────────────────────────────────────────────────── */}

    </Routes>
  );
}