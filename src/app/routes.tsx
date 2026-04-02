import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import ArtistLab from "./pages/Artist/ArtistLab";
import SmartStore from "./pages/SmartStore";
import ARView from "./pages/ARView";
import ResellMarket from "./pages/ResellMarket";
import ProductDetail from "./pages/ProductDetail";
import ArtistDetail from "./pages/Artist/ArtistDetail";
import Auth from "./pages/Auth";
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
      <Route path="/account/addresses" element={<AccountAddresses />} />            {/* 배송지 관리 */}
      <Route path="/account/payment-methods" element={<AccountPaymentMethods />} /> {/* 결제 수단 */}
      <Route path="/account/wishlist" element={<AccountWishlist />} />              {/* 위시리스트 */}

    </Routes>
  );
}