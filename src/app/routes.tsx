import { Route, Routes } from "react-router";
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

      {/* ── 메인 ──────────────────────────────────────── */}
      <Route path="/" element={<Home />} />                          {/* 홈 */}
      <Route path="/search" element={<Search />} />                  {/* 검색 */}

      {/* ── 스토어 ────────────────────────────────────── */}
      <Route path="/smart-store" element={<SmartStore />} />         {/* 상품 목록 */}
      <Route path="/store" element={<SmartStore />} />               {/* 상품 목록 (별칭) */}
      <Route path="/product/:id" element={<ProductDetail />} />      {/* 상품 상세 */}
      <Route path="/product/:id/360" element={<Product360View />} /> {/* 360도 뷰어 */}
      <Route path="/ar-view" element={<ARView />} />                 {/* AR 뷰어 */}
      <Route path="/resell" element={<ResellMarket />} />            {/* 리셀 마켓 */}

      {/* ── 아티스트 ──────────────────────────────────── */}
      <Route path="/artist-lab" element={<ArtistLab />} />           {/* 아티스트 목록 */}
      <Route path="/artist/:id" element={<ArtistDetail />} />        {/* 아티스트 상세 */}

      {/* ── 인증 ──────────────────────────────────────── */}
      <Route path="/login" element={<Auth />} />                     {/* 로그인 */}
      <Route path="/signup" element={<Auth />} />                    {/* 회원가입 (토글) */}
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* 비밀번호 찾기 */}
      <Route path="/onboarding" element={<Onboarding />} />          {/* 온보딩 (가입 후) */}
      <Route path="/oauth2/callback" element={<OAuth2Callback />} /> {/* 소셜 로그인 콜백 */}

      {/* ── 장바구니 / 주문 ───────────────────────────── */}
      <Route path="/cart" element={<Cart />} />                                {/* 장바구니 */}
      <Route path="/checkout" element={<Checkout />} />                        {/* 주문 결제 */}
      <Route path="/checkout/confirm" element={<OrderConfirmation />} />       {/* 주문 확인 */}
      <Route path="/checkout/success" element={<CheckoutSuccess />} />         {/* 주문 완료 */}

      {/* ── 결제 ──────────────────────────────────────── */}
      <Route path="/payment/success" element={<PaymentSuccess />} />  {/* 결제 성공 */}
      <Route path="/payment/fail" element={<PaymentFail />} />        {/* 결제 실패 */}

      {/* ── 마이페이지 ────────────────────────────────── */}
      <Route path="/account" element={<Account />} />                               {/* 프로필 */}
      <Route path="/account/orders" element={<AccountOrders />} />                  {/* 주문 내역 */}
      <Route path="/account/orders/:orderNo" element={<OrderDetail />} />          {/* 주문 상세 */}
      <Route path="/account/addresses" element={<AccountAddresses />} />            {/* 배송지 관리 */}
      <Route path="/account/payment-methods" element={<AccountPaymentMethods />} /> {/* 결제 수단 */}
      <Route path="/account/wishlist" element={<AccountWishlist />} />              {/* 위시리스트 */}

    </Routes>
  );
}
