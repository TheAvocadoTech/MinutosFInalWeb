import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PhoneAuth from "./Components/Login/OtpLogin";
import PrivateRoute from "./Components/store/PrivateRoute";
import Profile from "./Components/Profile";
import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/pages/Home";
import FruitsVegetablesComponent from "./Components/shared/SubCategory";
import ProductDetailScreen from "./Components/home/ProductDetail";
import { loginSuccess, logout } from "./Components/store/authSlice";
import { useAppDispatch } from "./Components/hooks/useAppDispatch";
import CheckoutPage from "./Components/cart/Checkout";
import PaymentPage from "./Components/cart/Payment";
import ScrollToTop from "./Components/utils/ScrollTop";
import CategoriesSub from "./Components/home/Category";
import StoreSelector from "./Components/NearByStore/NearByStore";
import PaymentCheckout from "./Components/Payment/Payment";
import ThankYouPage from "./Components/Delievery/OrderDelierery";
import VendorRegistrationForm from "./Components/Vendor/Registration";
import DeliveryRegistration from "./Components/Delievery/DelierveryRegistration";

// ✅ Utility to get JWT expiry
function getTokenExpiry(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // ms
  } catch (err) {
    console.error("Invalid JWT", err);
    return null;
  }
}

export default function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // ✅ Clean unwanted localStorage keys on app start
  useEffect(() => {
    // Remove specific known keys
    localStorage.removeItem("recentLocations");
    localStorage.removeItem("nextauth.message");

    // Remove weird hashed cache keys (usually 32-char hex strings)
    Object.keys(localStorage).forEach((key) => {
      if (/^[a-f0-9]{32}$/.test(key)) {
        localStorage.removeItem(key);
      }
    });

    // Hydrate Redux with valid auth
    const data = localStorage.getItem("auth");
    if (data) {
      const { token, user } = JSON.parse(data);
      if (token && user) {
        const expiry = getTokenExpiry(token);
        if (expiry && expiry > Date.now()) {
          dispatch(loginSuccess({ token, user }));
        } else {
          localStorage.removeItem("auth");
          dispatch(logout());
        }
      }
    }
  }, [dispatch]);

  // ✅ Auto logout when token expires
  useEffect(() => {
    if (token) {
      const expiryTime = getTokenExpiry(token);
      if (!expiryTime || expiryTime < Date.now()) {
        dispatch(logout());
        navigate("/login");
      } else {
        const timeout = expiryTime - Date.now();
        const timer = setTimeout(() => {
          dispatch(logout());
          alert("Session expired. Please login again.");
          navigate("/login");
        }, timeout);

        return () => clearTimeout(timer); // cleanup
      }
    }
  }, [token, dispatch, navigate]);

  return (
    <>
      <ScrollToTop /> {/* ✅ Add ScrollToTop component */}
      <Header />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<PhoneAuth />} />
        Protected Routes
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/subCategory/:categoryName"
          element={<FruitsVegetablesComponent />}
        />
        <Route path="/subcategory" element={<CategoriesSub />} />
        <Route path="/product/:id" element={<ProductDetailScreen />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* <Route path="/payment" element={<PaymentCheckout />} /> */}
        <Route path="/sell" element={<VendorRegistrationForm />} />
        <Route path="/nearByStore" element={<StoreSelector />} />
        {/* <Route path="/delievery" element={<ThankYouPage />} /> */}
        <Route
          path="/delieveryRegistration"
          element={<DeliveryRegistration />}
        />
        {/* Default fallback */}
        // <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
