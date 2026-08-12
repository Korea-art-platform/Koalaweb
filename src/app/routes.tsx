import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";

import ProtectedRoute from "@/app/components/routers/ProtectedRoute";
import AccountLayout from "@/app/components/layouts/AccountLayout";

/*
 * 첫 화면에 필요한 것만 같이 내려받고, 나머지는 그 경로에 들어갈 때 받는다.
 *
 * 예전에는 어드민 17개 화면까지 한 덩어리에 들어 있어, 작품만 구경하러 온
 * 방문자도 상품 등록 폼과 CSV 업로드 코드를 전부 내려받았다.
 *
 * 즉시 로딩(eager)에 두는 기준은 "첫 방문에서 바로 갈 수 있는 곳"이다.
 * 지연 로딩으로 옮기면 그 경로로 이동할 때 잠깐 로딩 표시가 뜬다.
 */

// ── 즉시 로딩 — 둘러보기 흐름 ──────────────────────────────
import Home from "@/app/pages/Home";
import SmartStore from "@/app/pages/product/SmartStore";
import ArtDetail from "@/app/pages/product/ArtDetail";
import ProductDetail from "@/app/pages/product/Detail";
import ArtistLab from "@/app/pages/Artist/ArtistLab";
import ArtistDetail from "@/app/pages/Artist/ArtistDetail";
import Auth from "@/app/pages/auth/Auth";
import NotFound from "@/app/pages/NotFound";

// ── 지연 로딩 ─────────────────────────────────────────────
const Search = lazy(() => import("@/app/pages/Search"));
const ArtistWorks = lazy(() => import("@/app/pages/Artist/ArtistWorks"));
const Product360View = lazy(() => import("@/app/pages/product/View360"));
const ARView = lazy(() => import("@/app/pages/later/ARView"));
const ResellMarket = lazy(() => import("@/app/pages/later/ResellMarket"));

const ForgotPassword = lazy(() => import("@/app/pages/auth/ForgotPassword"));
const Onboarding = lazy(() => import("@/app/pages/auth/Onboarding"));
const OAuth2Callback = lazy(() => import("@/app/pages/auth/OAuth2Callback"));

const Terms = lazy(() => import("@/app/pages/legal/Terms"));
const Privacy = lazy(() => import("@/app/pages/legal/Privacy"));
const Cookies = lazy(() => import("@/app/pages/legal/Cookies"));
const YouthProtection = lazy(() => import("@/app/pages/legal/YouthProtection"));
const AccountDeletion = lazy(() => import("@/app/pages/legal/AccountDeletion"));

const Notice = lazy(() => import("@/app/pages/Notice"));
const NoticeDetail = lazy(() => import("@/app/pages/NoticeDetail"));

const FAQ = lazy(() => import("@/app/pages/support/FAQ"));
const Shipping = lazy(() => import("@/app/pages/support/Shipping"));
const Contact = lazy(() => import("@/app/pages/support/Contact"));
const Help = lazy(() => import("@/app/pages/support/Help"));
const Returns = lazy(() => import("@/app/pages/support/Returns"));

const Cart = lazy(() => import("@/app/pages/order/Cart"));
const Checkout = lazy(() => import("@/app/pages/order/Checkout"));
const OrderConfirmation = lazy(() => import("@/app/pages/order/Confirmation"));
const CheckoutSuccess = lazy(() => import("@/app/pages/order/Success"));

const PaymentPage = lazy(() => import("@/app/pages/payment/PaymentPage"));
const PaymentSuccess = lazy(() => import("@/app/pages/payment/Success"));
const PaymentFail = lazy(() => import("@/app/pages/payment/Fail"));

const Account = lazy(() => import("@/app/pages/account/index"));
const AccountOrders = lazy(() => import("@/app/pages/account/AccountOrders"));
const AccountAddresses = lazy(() => import("@/app/pages/account/AccountAddresses"));
const AccountPaymentMethods = lazy(() => import("@/app/pages/account/PaymentMethods"));
const AccountWishlist = lazy(() => import("@/app/pages/account/AccountWishlist"));
const AccountInquiry = lazy(() => import("@/app/pages/account/AccountInquiry"));
const AccountSettings = lazy(() => import("@/app/pages/account/AccountSettings"));
const OrderDetail = lazy(() => import("@/app/pages/account/OrderDetail"));

// 어드민 — 방문자에게는 한 줄도 내려가지 않는다
const AdminAuthProvider = lazy(() =>
  import("@/app/context/AdminAuthContext").then((m) => ({ default: m.AdminAuthProvider }))
);
const AdminRoute = lazy(() => import("@/app/components/routers/AdminRoute"));
const AdminLogin = lazy(() => import("@/app/pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/app/pages/Admin/AdminDashboard"));
const AdminOrderList = lazy(() => import("@/app/pages/Admin/orders/AdminOrderList"));
const AdminOrderDetail = lazy(() => import("@/app/pages/Admin/orders/AdminOrderDetail"));
const AdminProductList = lazy(() => import("@/app/pages/Admin/products/AdminProductList"));
const AdminProductDetail = lazy(() => import("@/app/pages/Admin/products/AdminProductDetail"));
const AdminCategoryList = lazy(() => import("@/app/pages/Admin/categories/AdminCategoryList"));
const AdminArtistList = lazy(() => import("@/app/pages/Admin/artists/AdminArtistList"));
const AdminArtistDetail = lazy(() => import("@/app/pages/Admin/artists/AdminArtistDetail"));
const AdminReviewList = lazy(() => import("@/app/pages/Admin/reviews/AdminReviewList"));
const AdminBannerList = lazy(() => import("@/app/pages/Admin/banners/AdminBannerList"));
const AdminUserList = lazy(() => import("@/app/pages/Admin/users/AdminUserList"));
const AdminUserDetail = lazy(() => import("@/app/pages/Admin/users/AdminUserDetail"));
const AdminReturnList = lazy(() => import("@/app/pages/Admin/returns/AdminReturnList"));
const AdminReturnDetail = lazy(() => import("@/app/pages/Admin/returns/AdminReturnDetail"));
const AdminNoticeList = lazy(() => import("@/app/pages/Admin/notices/AdminNoticeList"));
const AdminInquiryList = lazy(() => import("@/app/pages/Admin/inquiries/AdminInquiryList"));
const AdminInquiryDetail = lazy(() => import("@/app/pages/Admin/inquiries/AdminInquiryDetail"));

/** 화면이 도착하기를 기다리는 동안 — 스피너 대신 빈 공간을 둔다 */
function RouteFallback() {
  return <div className="min-h-screen" />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* ── 누구나 접근 가능 ────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />

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
        <Route path="/youth-protection" element={<YouthProtection />} />
        <Route path="/account-deletion" element={<AccountDeletion />} />

        {/* 공지사항 */}
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:noticeCode" element={<NoticeDetail />} />

        {/* 고객 지원 */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/returns" element={<Returns />} />

        {/* ── 로그인 필수 ─────────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/confirm" element={<OrderConfirmation />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />

          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />

          {/* 마이페이지 — AccountLayout 안에서 렌더링 */}
          <Route element={<AccountLayout />}>
            <Route path="/account" element={<Account />} />
            <Route path="/account/orders" element={<AccountOrders />} />
            <Route path="/account/orders/:orderNo" element={<OrderDetail />} />
            <Route path="/account/addresses" element={<AccountAddresses />} />
            <Route path="/account/payment-methods" element={<AccountPaymentMethods />} />
            <Route path="/account/wishlist" element={<AccountWishlist />} />
            <Route path="/account/inquiry" element={<AccountInquiry />} />
            <Route path="/account/settings" element={<AccountSettings />} />
          </Route>
        </Route>

        {/* ── 어드민 ──────────────────────────────────────── */}
        <Route element={<AdminAuthProvider><Outlet /></AdminAuthProvider>}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrderList />} />
            <Route path="/admin/orders/:orderNo" element={<AdminOrderDetail />} />
            <Route path="/admin/products" element={<AdminProductList />} />
            <Route path="/admin/products/:skuCode" element={<AdminProductDetail />} />
            <Route path="/admin/categories" element={<AdminCategoryList />} />
            <Route path="/admin/artists" element={<AdminArtistList />} />
            <Route path="/admin/artists/:artistCode" element={<AdminArtistDetail />} />
            <Route path="/admin/reviews" element={<AdminReviewList />} />
            <Route path="/admin/banners" element={<AdminBannerList />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetail />} />
            <Route path="/admin/returns" element={<AdminReturnList />} />
            <Route path="/admin/returns/:returnNo" element={<AdminReturnDetail />} />
            <Route path="/admin/notices" element={<AdminNoticeList />} />
            <Route path="/admin/inquiries" element={<AdminInquiryList />} />
            <Route path="/admin/inquiries/:inquiryCode" element={<AdminInquiryDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
