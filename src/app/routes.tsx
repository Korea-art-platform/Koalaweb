import { Outlet, Route, Routes } from "react-router";

import ProtectedRoute from "@/app/components/routers/ProtectedRoute";
import AccountLayout from "@/app/components/layouts/AccountLayout";

// 약관 · 법적 고지
import Terms from "@/app/pages/legal/Terms";
import Privacy from "@/app/pages/legal/Privacy";
import Cookies from "@/app/pages/legal/Cookies";

// 고객 지원
import FAQ from "@/app/pages/support/FAQ";
import Shipping from "@/app/pages/support/Shipping";
import Contact from "@/app/pages/support/Contact";
import Help from "@/app/pages/support/Help";
import Returns from "@/app/pages/support/Returns";

// 공지사항
import Notice from "@/app/pages/Notice";

// 404
import NotFound from "@/app/pages/NotFound";

// 루트 페이지
import About from "@/app/pages/About";
import Home from "@/app/pages/Home";
import Search from "@/app/pages/Search";
import SmartStore from "@/app/pages/product/SmartStore";
import ARView from "@/app/pages/later/ARView";
import ResellMarket from "@/app/pages/later/ResellMarket";

// 아티스트
import ArtistLab from "@/app/pages/Artist/ArtistLab";
import ArtistDetail from "@/app/pages/Artist/ArtistDetail";
import ArtistWorks from "@/app/pages/Artist/ArtistWorks";

// 상품
import ProductDetail from "@/app/pages/product/Detail";
import ArtDetail from "@/app/pages/product/ArtDetail";
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
import PaymentPage from "@/app/pages/payment/PaymentPage";
import PaymentSuccess from "@/app/pages/payment/Success";
import PaymentFail from "@/app/pages/payment/Fail";

// 마이페이지
import Account from "@/app/pages/account/index";
import AccountOrders from "@/app/pages/account/AccountOrders";
import AccountAddresses from "@/app/pages/account/AccountAddresses";
import AccountPaymentMethods from "@/app/pages/account/PaymentMethods";
import AccountWishlist from "@/app/pages/account/AccountWishlist";
import AccountSettings from "@/app/pages/account/AccountSettings";
import OrderDetail from "@/app/pages/account/OrderDetail";

//관리자
import { AdminAuthProvider } from '@/app/context/AdminAuthContext';
import AdminRoute from '@/app/components/routers/AdminRoute';
import AdminLogin from '@/app/pages/Admin/AdminLogin';
import AdminDashboard from '@/app/pages/Admin/AdminDashboard';
import AdminOrderList from '@/app/pages/Admin/orders/AdminOrderList';
import AdminOrderDetail from '@/app/pages/Admin/orders/AdminOrderDetail';
import AdminProductList from '@/app/pages/Admin/products/AdminProductList';
import AdminProductDetail from '@/app/pages/Admin/products/AdminProductDetail';
import AdminArtistList from '@/app/pages/Admin/artists/AdminArtistList';
import AdminArtistDetail from '@/app/pages/Admin/artists/AdminArtistDetail';
import AdminReviewList from '@/app/pages/Admin/reviews/AdminReviewList';
import AdminBannerList from '@/app/pages/Admin/banners/AdminBannerList';
import AdminUserList from '@/app/pages/Admin/users/AdminUserList';


export function AppRoutes() {
  return (
    <Routes>
      {/* ── 🟢 누구나 접근 가능한 영역 ──────────────────────────────────────── */}
      
      {/* 메인 */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/about" element={<About/>}/>

      {/* 스토어 */}
      <Route path="/smart-store" element={<SmartStore />} />
      <Route path="/store" element={<SmartStore />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/art/:id" element={<ArtDetail />} />
      <Route path="/product/:id/360" element={<Product360View />} />
      <Route path="/ar-view" element={<ARView />} />
      <Route path="/resell" element={<ResellMarket />} />

      {/* 아티스트 */}
      <Route path="/artist-lab" element={<ArtistLab />} />
      <Route path="/artist/:id" element={<ArtistDetail />} />
      <Route path="/artist/:id/works" element={<ArtistWorks />} />

      {/* 인증 */}
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />

      {/* 약관 · 법적 고지 */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />

      {/* 공지사항 */}
      <Route path="/notice" element={<Notice />} />

      {/* 고객 지원 */}
      <Route path="/faq" element={<FAQ />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/returns" element={<Returns />} />

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
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />

        {/* 📦 마이페이지 그룹 (AccountLayout 안에서 렌더링됨) */}
        <Route element={<AccountLayout />}>
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<AccountOrders />} />
          <Route path="/account/orders/:orderNo" element={<OrderDetail />} />
          <Route path="/account/addresses" element={<AccountAddresses />} />
          <Route path="/account/payment-methods" element={<AccountPaymentMethods />} />
          <Route path="/account/wishlist" element={<AccountWishlist />} />
          <Route path="/account/settings" element={<AccountSettings />} />
        </Route>

      </Route>
      {/* ───────────────────────────────────────────────────────────────── */}

      {/* ── 🔑 어드민 구역 ───────────────────────────────────────────── */}
      <Route element={<AdminAuthProvider><Outlet /></AdminAuthProvider>}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrderList />} />
          <Route path="/admin/orders/:orderNo" element={<AdminOrderDetail />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/products/:skuCode" element={<AdminProductDetail />} />
          <Route path="/admin/artists" element={<AdminArtistList />} />
          <Route path="/admin/artists/:artistCode" element={<AdminArtistDetail />} />
          <Route path="/admin/reviews" element={<AdminReviewList />} />
          <Route path="/admin/banners" element={<AdminBannerList />} />
          <Route path="/admin/users" element={<AdminUserList />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}