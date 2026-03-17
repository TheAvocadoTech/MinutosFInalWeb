// import React, { useState, useEffect, useRef } from "react";
// import {
//   FaRegUser,
//   FaShoppingCart,
//   FaSearch,
//   FaTimes,
//   FaSpinner,
//   FaChevronDown,
//   FaHome,
//   FaList,
//   FaPlus,
//   FaMinus,
//   FaTrash,
//   FaMapMarkerAlt,
//   FaSignOutAlt,
//   FaUserCircle,
// } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { locationService } from "../service/locationService";
// import { categoryService } from "../service/categoryService";
// import {
//   fetchCartAsync,
//   updateCartItemAsync,
//   removeFromCartAsync,
// } from "../store/cartSlice";
// import { logout } from "../store/authSlice"; // ← import logout action

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);
//   const cartItems = useSelector((state) => state.cart.cartItems);
//   const cartLoading = useSelector((state) => state.cart.loading);
//   const [selectedSlot, setSelectedSlot] = useState("Instant Delivery");

//   // ── Separate dropdown state + refs for desktop and mobile ──
//   const [isDesktopProfileOpen, setIsDesktopProfileOpen] = useState(false);
//   const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
//   const desktopProfileRef = useRef(null);
//   const mobileProfileRef = useRef(null);

//   // Close desktop dropdown on outside click
//   // Using "click" not "mousedown" so button's onClick fires before this listener closes it
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         desktopProfileRef.current &&
//         !desktopProfileRef.current.contains(e.target)
//       ) {
//         setIsDesktopProfileOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Close mobile dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         mobileProfileRef.current &&
//         !mobileProfileRef.current.contains(e.target)
//       ) {
//         setIsMobileProfileOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     setIsDesktopProfileOpen(false);
//     setIsMobileProfileOpen(false);
//     navigate("/");
//   };
//   // ────────────────────────────────────────────────────────────

//   const cartTotal = cartItems.reduce(
//     (total, item) => total + (item.price || 0) * (item.quantity || 0),
//     0,
//   );

//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isLocationPopup, setIsLocationPopup] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);
//   const [categoriesError, setCategoriesError] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(() => {
//     try {
//       return (
//         locationService.getSavedLocation() ||
//         "Mumbai Central, Mumbai, Maharashtra"
//       );
//     } catch {
//       return "Mumbai Central, Mumbai, Maharashtra";
//     }
//   });
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [updatingItems, setUpdatingItems] = useState(new Set());

//   const detectLocationManually = async () => {
//     try {
//       setLocationLoading(true);
//       const result = await locationService.getUserLocationWithAddress();
//       if (result.success && result.location) {
//         const locationString =
//           result.location.address?.formatted ||
//           result.location.address?.full ||
//           "Current Location";
//         setSelectedLocation(locationString);
//         locationService.saveLocationToStorage(locationString);
//         setIsLocationPopup(false);
//       } else {
//         alert(
//           "Unable to detect your location. Please enter manually or check permissions.",
//         );
//       }
//     } catch (error) {
//       console.error("Manual location detection error:", error);
//       alert("Location detection failed. Please enter your address manually.");
//     } finally {
//       setLocationLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.userId) {
//       dispatch(fetchCartAsync(user.userId));
//     }
//   }, [dispatch, user]);

//   useEffect(() => {
//     const detectLocation = async () => {
//       try {
//         setLocationLoading(true);
//         const result = await locationService.getUserLocationWithAddress();
//         if (result.success && result.location) {
//           const locationString =
//             result.location.address?.formatted ||
//             result.location.address?.full ||
//             "Current Location";
//           setSelectedLocation(locationString);
//           locationService.saveLocationToStorage(locationString);
//         } else {
//           const savedLocation = locationService.getSavedLocation();
//           if (savedLocation) setSelectedLocation(savedLocation);
//         }
//       } catch (error) {
//         const savedLocation = locationService.getSavedLocation();
//         if (savedLocation) setSelectedLocation(savedLocation);
//       } finally {
//         setLocationLoading(false);
//       }
//     };
//     detectLocation();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       setCategoriesLoading(true);
//       setCategoriesError(null);
//       try {
//         const result = await categoryService.getCategories();
//         if (result.success) setCategories(result.data);
//         else setCategoriesError(result.error || "Failed to fetch categories");
//       } catch {
//         setCategoriesError("Network error occurred");
//       } finally {
//         setCategoriesLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleIncreaseQuantity = async (item) => {
//     if (!user?.userId) return;
//     const itemId = item.productId || item._id;
//     if (updatingItems.has(itemId)) return;
//     setUpdatingItems((prev) => new Set(prev).add(itemId));
//     try {
//       await dispatch(
//         updateCartItemAsync({
//           userId: user.userId,
//           productId: itemId,
//           quantity: item.quantity + 1,
//         }),
//       ).unwrap();
//     } catch (error) {
//       alert("Failed to update quantity");
//       dispatch(fetchCartAsync(user.userId));
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };

//   const handleDecreaseQuantity = async (item) => {
//     if (!user?.userId) return;
//     const itemId = item.productId || item._id;
//     if (updatingItems.has(itemId)) return;
//     if (item.quantity <= 1) {
//       handleRemoveItem(item);
//       return;
//     }
//     setUpdatingItems((prev) => new Set(prev).add(itemId));
//     try {
//       await dispatch(
//         updateCartItemAsync({
//           userId: user.userId,
//           productId: itemId,
//           quantity: item.quantity - 1,
//         }),
//       ).unwrap();
//     } catch (error) {
//       alert("Failed to update quantity");
//       dispatch(fetchCartAsync(user.userId));
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };

//   const handleRemoveItem = async (item) => {
//     if (!user?.userId) return;
//     const itemId = item.productId || item._id;
//     setUpdatingItems((prev) => new Set(prev).add(itemId));
//     try {
//       await dispatch(
//         removeFromCartAsync({ userId: user.userId, productId: itemId }),
//       ).unwrap();
//       dispatch(fetchCartAsync(user.userId));
//     } catch (error) {
//       alert("Failed to remove item");
//     } finally {
//       setUpdatingItems((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };

//   // Dropdowns are inlined directly in JSX below (no inner components)
//   // so that refs stay stable across re-renders.

//   return (
//     <div className="bg-white sticky top-0 z-50 shadow-sm">
//       {/* Cart Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isCartOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex items-center justify-between p-4 border-b">
//             <h2 className="text-lg font-semibold">
//               Your Cart ({cartItems.length})
//             </h2>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="p-2 rounded-full hover:bg-gray-100"
//             >
//               <FaTimes className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-3">
//             {cartItems.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                 <FaShoppingCart className="w-16 h-16 mb-4 opacity-30" />
//                 <p className="text-lg">Your cart is empty</p>
//                 <p className="text-sm mt-2">Add items to get started</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {cartItems.map((item) => {
//                   const itemId = item.productId || item._id;
//                   const isUpdating = updatingItems.has(itemId);
//                   return (
//                     <div
//                       key={item._id}
//                       className="bg-gray-50 border rounded-lg p-3"
//                     >
//                       <div className="flex items-start space-x-3">
//                         <div className="w-12 h-12 bg-white rounded-md flex-shrink-0">
//                           <img
//                             src={item.images?.[0] || item.image}
//                             alt={item.name}
//                             className="w-full h-full object-contain rounded-md"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h3 className="font-medium text-sm text-gray-900 leading-tight">
//                             {item.name}
//                           </h3>
//                           {item.unit && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               {item.unit}
//                             </p>
//                           )}
//                           <div className="flex items-center justify-between mt-2">
//                             <p className="text-sm font-semibold text-gray-900">
//                               ₹{item.price}
//                             </p>
//                             <div className="flex items-center">
//                               <button
//                                 onClick={() => handleDecreaseQuantity(item)}
//                                 disabled={isUpdating || cartLoading}
//                                 className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-l bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 {item.quantity <= 1 ? (
//                                   <FaTrash className="w-2.5 h-2.5 text-red-500" />
//                                 ) : (
//                                   <FaMinus className="w-2.5 h-2.5 text-gray-600" />
//                                 )}
//                               </button>
//                               <div className="w-10 h-7 flex items-center justify-center bg-white border-t border-b border-gray-300 text-sm font-medium">
//                                 {isUpdating ? (
//                                   <FaSpinner className="w-3 h-3 animate-spin text-gray-400" />
//                                 ) : (
//                                   item.quantity
//                                 )}
//                               </div>
//                               <button
//                                 onClick={() => handleIncreaseQuantity(item)}
//                                 disabled={isUpdating || cartLoading}
//                                 className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-r bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 <FaPlus className="w-2.5 h-2.5 text-green-600" />
//                               </button>
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-between mt-2">
//                             <span className="text-xs font-semibold text-gray-700">
//                               Total: ₹{(item.price || 0) * (item.quantity || 0)}
//                             </span>
//                             <button
//                               onClick={() => handleRemoveItem(item)}
//                               disabled={isUpdating || cartLoading}
//                               className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {cartItems.length > 0 && (
//             <div className="border-t p-4">
//               <div className="flex items-center mb-3 text-green-600">
//                 <span className="text-sm font-medium">
//                   🚚 Delivery in 15 minutes
//                 </span>
//               </div>
//               <div className="mb-4">
//                 <select
//                   value={selectedSlot}
//                   onChange={(e) => setSelectedSlot(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//                 >
//                   <option value="30">Instant Delivery</option>
//                   <option value="30">Within 30 minutes</option>
//                   <option value="60">Within 1 hour</option>
//                   <option value="120">Within 2 hours</option>
//                   <option value="180">Within 3 hours</option>
//                   <option value="later">Schedule for later</option>
//                 </select>
//               </div>
//               <div className="flex justify-between items-center mb-4">
//                 <span className="font-medium">Subtotal:</span>
//                 <span className="font-semibold">₹{cartTotal}</span>
//               </div>
//               <button
//                 onClick={() => {
//                   setIsCartOpen(false);
//                   navigate("/checkout");
//                 }}
//                 disabled={cartLoading}
//                 className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {cartLoading ? "Updating..." : "Proceed to Checkout"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Overlay for Cart */}
//       {isCartOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setIsCartOpen(false)}
//         ></div>
//       )}

//       {/* Location Popup */}
//       {isLocationPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
//             <button
//               onClick={() => setIsLocationPopup(false)}
//               className="absolute top-3 right-3 text-gray-600 hover:text-black"
//             >
//               <FaTimes />
//             </button>
//             <h2 className="text-lg font-semibold mb-4 text-red-600">
//               Choose your location
//             </h2>
//             <p className="text-sm text-gray-600 mb-4">
//               Detect your location or enter manually:
//             </p>
//             <button
//               onClick={detectLocationManually}
//               className="w-full bg-red-600 text-white py-2 rounded-md mb-3 hover:bg-red-700 transition-colors disabled:opacity-50"
//               disabled={locationLoading}
//             >
//               {locationLoading ? (
//                 <span className="flex items-center justify-center">
//                   <FaSpinner className="animate-spin w-4 h-4 mr-2" />
//                   Detecting Location...
//                 </span>
//               ) : (
//                 "Detect Current Location"
//               )}
//             </button>
//             <input
//               type="text"
//               placeholder="Enter area, street name..."
//               value={
//                 selectedLocation === "Mumbai Central, Mumbai, Maharashtra"
//                   ? ""
//                   : selectedLocation
//               }
//               className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//               onChange={(e) => {
//                 setSelectedLocation(
//                   e.target.value || "Mumbai Central, Mumbai, Maharashtra",
//                 );
//                 if (e.target.value) {
//                   locationService.saveLocationToStorage(e.target.value);
//                 }
//               }}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" && e.target.value.trim()) {
//                   setSelectedLocation(e.target.value.trim());
//                   locationService.saveLocationToStorage(e.target.value.trim());
//                   setIsLocationPopup(false);
//                 }
//               }}
//             />
//             <button
//               onClick={() => {
//                 if (
//                   selectedLocation &&
//                   selectedLocation !== "Mumbai Central, Mumbai, Maharashtra"
//                 ) {
//                   locationService.saveLocationToStorage(selectedLocation);
//                   setIsLocationPopup(false);
//                 }
//               }}
//               className="w-full mt-3 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
//             >
//               Save Location
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Header */}
//       <header className="bg-white">
//         {/* Desktop Header */}
//         <div className="hidden md:block">
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex items-center justify-between py-4">
//               <div className="flex items-center gap-6">
//                 <Link to="/" className="flex items-center gap-2">
//                   <img
//                     src="https://www.minutos.in/minitos.png"
//                     alt="Minutos Logo"
//                     className="w-15 h-8 object-contain"
//                   />
//                 </Link>
//                 <div
//                   className="flex items-center cursor-pointer"
//                   onClick={() => setIsLocationPopup(true)}
//                 >
//                   <div className="flex flex-col">
//                     <span className="text-lg font-semibold text-black">
//                       Delivery in 17 minutes
//                     </span>
//                     <div className="flex items-center text-sm text-gray-600">
//                       {locationLoading ? (
//                         <span className="flex items-center">
//                           <FaSpinner className="animate-spin w-3 h-3 mr-1" />
//                           Detecting...
//                         </span>
//                       ) : (
//                         <>
//                           <span className="truncate max-w-[300px]">
//                             {selectedLocation}
//                           </span>
//                           <FaChevronDown className="ml-1 w-3 h-3" />
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex-1 max-w-md mx-8">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaSearch className="h-4 w-4 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder='Search "egg"'
//                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 {user ? (
//                   <div className="relative" ref={desktopProfileRef}>
//                     <button
//                       onClick={() => setIsDesktopProfileOpen((prev) => !prev)}
//                       className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                     >
//                       <FaRegUser className="w-5 h-5 text-gray-700" />
//                     </button>
//                     {isDesktopProfileOpen && (
//                       <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//                         <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//                           <div className="flex items-center gap-2">
//                             <FaUserCircle className="w-5 h-5 text-gray-400" />
//                             <span className="text-xs text-gray-600 truncate">
//                               {user?.name || user?.email || "My Account"}
//                             </span>
//                           </div>
//                         </div>
//                         <Link
//                           to="/profile"
//                           onClick={() => setIsDesktopProfileOpen(false)}
//                           className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                         >
//                           <FaRegUser className="w-4 h-4 text-gray-500" />
//                           My Profile
//                         </Link>
//                         {/* <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
//                         >
//                           <FaSignOutAlt className="w-4 h-4" />
//                           Logout
//                         </button> */}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="text-lg font-medium text-gray-800 hover:text-red-600 transition-colors"
//                   >
//                     Login
//                   </Link>
//                 )}

//                 <button
//                   onClick={() => setIsCartOpen(true)}
//                   className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   <FaShoppingCart className="w-4 h-4" />
//                   <span className="font-medium">{cartItems.length} items</span>
//                   <span className="font-medium">₹{cartTotal}</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Desktop Categories Navigation */}
//           <div className="border-t border-gray-200">
//             <div className="max-w-7xl mx-auto px-4">
//               {categoriesError && !categoriesLoading && (
//                 <div className="text-red-500 p-4">
//                   Failed to load categories.
//                 </div>
//               )}
//               {categoriesLoading ? (
//                 <div className="p-4 text-gray-500">Loading categories...</div>
//               ) : (
//                 <div className="flex items-center gap-6 py-3 overflow-x-auto">
//                   {categories.map((category) => (
//                     <div
//                       key={category.id}
//                       className="cursor-pointer hover:text-red-600 transition-colors whitespace-nowrap text-sm font-medium text-gray-700"
//                       onClick={() =>
//                         navigate(
//                           `/subCategory/${encodeURIComponent(category.name)}`,
//                         )
//                       }
//                     >
//                       {category.name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Header */}
//         <div className="md:hidden">
//           <div className="flex items-center justify-between p-4">
//             <Link to="/" className="flex items-center">
//               <img
//                 src="https://www.minutos.in/minitos.png"
//                 alt="Minutos Logo"
//                 className="h-8 sm:h-10 md:h-12 w-auto object-contain"
//               />
//             </Link>

//             <div className="flex items-center gap-2">
//               {/* ── UPDATED: mobile dropdown ── */}
//               {user ? (
//                 <div className="relative" ref={mobileProfileRef}>
//                   <button
//                     onClick={() => setIsMobileProfileOpen((prev) => !prev)}
//                     className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                   >
//                     <FaRegUser className="w-4 h-4 text-gray-700" />
//                   </button>
//                   {isMobileProfileOpen && (
//                     <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
//                       <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
//                         <div className="flex items-center gap-2">
//                           <FaUserCircle className="w-5 h-5 text-gray-400" />
//                           <span className="text-xs text-gray-600 truncate">
//                             {user?.name || user?.email || "My Account"}
//                           </span>
//                         </div>
//                       </div>
//                       <Link
//                         to="/profile"
//                         onClick={() => setIsMobileProfileOpen(false)}
//                         className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                       >
//                         <FaRegUser className="w-4 h-4 text-gray-500" />
//                         My Profile
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
//                       >
//                         <FaSignOutAlt className="w-4 h-4" />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link
//                   to="/login"
//                   className="text-sm font-medium text-gray-800 hover:text-red-600 transition-colors px-2"
//                 >
//                   Login
//                 </Link>
//               )}

//               <button
//                 onClick={() => setIsCartOpen(true)}
//                 className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors relative"
//               >
//                 <FaShoppingCart className="w-4 h-4" />
//                 {cartItems.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-white text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
//                     {cartItems.length}
//                   </span>
//                 )}
//                 <span className="text-sm font-medium">₹{cartTotal}</span>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Search Bar */}
//           <div className="px-4 pb-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder='Search "egg"'
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
//               />
//             </div>
//           </div>

//           {/* Mobile Location */}
//           <div
//             className="px-4 pb-3 cursor-pointer"
//             onClick={() => setIsLocationPopup(true)}
//           >
//             <div className="flex items-center gap-2 text-sm">
//               <FaMapMarkerAlt className="text-red-500 w-4 h-4" />
//               {locationLoading ? (
//                 <span className="flex items-center text-gray-600">
//                   <FaSpinner className="animate-spin w-3 h-3 mr-1" />
//                   Detecting location...
//                 </span>
//               ) : (
//                 <>
//                   <span className="text-gray-900 font-medium">
//                     Delivery in 17 min
//                   </span>
//                   <span className="text-gray-600 truncate">
//                     • {selectedLocation}
//                   </span>
//                   <FaChevronDown className="w-3 h-3 text-gray-400" />
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Bottom Navigation */}
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
//           <div className="flex justify-around items-center py-2">
//             <Link
//               to="/"
//               className="flex flex-col items-center justify-center text-gray-700 hover:text-red-600 transition-colors py-2 px-4"
//             >
//               <FaHome className="w-5 h-5 mb-1" />
//               <span className="text-xs">Home</span>
//             </Link>

//             <Link
//               to="/subcategory"
//               className="flex flex-col items-center justify-center text-gray-700 hover:text-red-600 transition-colors py-2 px-4"
//             >
//               <FaList className="w-5 h-5 mb-1" />
//               <span className="text-xs">Categories</span>
//             </Link>

//             <button
//               onClick={() => setIsCartOpen(true)}
//               className="flex flex-col items-center justify-center text-gray-700 hover:text-red-600 transition-colors py-2 px-4 relative"
//             >
//               <FaShoppingCart className="w-5 h-5 mb-1" />
//               {cartItems.length > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
//                   {cartItems.length}
//                 </span>
//               )}
//               <span className="text-xs">₹{cartTotal}</span>
//             </button>
//           </div>
//         </div>
//       </header>
//     </div>
//   );
// };

// export default Header;
