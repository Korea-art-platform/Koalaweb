import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";

import ProtectedRoute from "@/app/components/routers/ProtectedRoute";
import AccountLayout from "@/app/components/layouts/AccountLayout";

import Home from "@/app/pages/Home";
import GuestOrderLookup from '@/app/pages/order/GuestOrderLookup';
const SmartStore = lazy(() => import("@/app/pages/product/SmartStore"));
const ArtDetail = lazy(() => import("@/app/pages/product/ArtDetail"));
const ProductDetail = lazy(() => import("@/app/pages/product/Detail"));
const ArtistLab = lazy(() => import("@/app/pages/Artist/ArtistLab"));
const ArtistDetail = lazy(() => import("@/app/pages/Artist/ArtistDetail"));
const Auth = lazy(() => import("@/app/pages/auth/Auth"));
const NotFound = lazy(() => import("@/app/pages/NotFound"));

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
const Stores = lazy(() => import("@/app/pages/Stores"));
const Exhibition = lazy(() => import("@/app/pages/Exhibition"));
const About = lazy(() => import("@/app/pages/About"));

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
const AdminStoreList = lazy(() => import("@/app/pages/Admin/stores/AdminStoreList"));
const AdminExhibition = lazy(() => import("@/app/pages/Admin/exhibition/AdminExhibition"));
const AdminInquiryList = lazy(() => import("@/app/pages/Admin/inquiries/AdminInquiryList"));
const AdminInquiryDetail = lazy(() => import("@/app/pages/Admin/inquiries/AdminInquiryDetail"));
const AdminSettlementList = lazy(() => import("@/app/pages/Admin/settlements/AdminSettlementList"));
const AdminMaintenance = lazy(() => import("@/app/pages/Admin/maintenance/AdminMaintenance"));

function RouteFallback() {
  return <div className="min-h-screen" />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/smart-store" element={<SmartStore />} />
        <Route path="/store" element={<SmartStore />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/art/:id" element={<ArtDetail />} />
        <Route path="/product/:id/360" element={<Product360View />} />
        <Route path="/ar-view" element={<ARView />} />
        <Route path="/resell" element={<ResellMarket />} />
        <Route path="/artist-lab" element={<ArtistLab />} />
        <Route path="/artist/:id" element={<ArtistDetail />} />
        <Route path="/artist/:id/works" element={<ArtistWorks />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/youth-protection" element={<YouthProtection />} />
        <Route path="/account-deletion" element={<AccountDeletion />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/:noticeCode" element={<NoticeDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/exhibition" element={<Exhibition />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/returns" element={<Returns />} />
        {/* 비회원도 살 수 있어야 하는 자리. 로그인 뒤로 숨기면 계정을 만들지
            않고는 결제할 수 없다. 장바구니는 회원만 쓰므로 그대로 둔다. */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/confirm" element={<OrderConfirmation />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
        <Route path="/order-lookup" element={<GuestOrderLookup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/cart" element={<Cart />} />
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
            <Route path="/admin/stores" element={<AdminStoreList />} />
            <Route path="/admin/exhibition" element={<AdminExhibition />} />
            <Route path="/admin/inquiries" element={<AdminInquiryList />} />
            <Route path="/admin/inquiries/:inquiryCode" element={<AdminInquiryDetail />} />
            <Route path="/admin/settlements" element={<AdminSettlementList />} />
            <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
