// // Complete cartService.js file
// const API_BASE_URL = "https://api.minutos.in"; // Adjust if needed

// const cartService = {
//   // ✅ Get cart - supports the URL pattern your frontend uses
//   getCart: async (userId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch cart");
//       }

//       const data = await response.json();
//       return data; // Backend now returns { items: [...], subTotal, grandTotal }
//     } catch (error) {
//       console.error("Cart fetch error:", error);
//       throw error;
//     }
//   },

//   // ✅ Add to cart - handles both new items and quantity updates
//   addToCart: async (userId, productId, quantity) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId,
//           productId,
//           quantity,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to add to cart");
//       }

//       const data = await response.json();
//       return data; // Returns { items: [...], subTotal, grandTotal }
//     } catch (error) {
//       console.error("Cart add error:", error);
//       throw error;
//     }
//   },

//   // ✅ Update cart item quantity - FIXED to use correct endpoint
//   updateCartItem: async (userId, productId, quantity, cartItemId = null) => {
//     try {
//       console.log("Updating cart item:", { userId, productId, quantity }); // Debug log

//       const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId,
//           productId,
//           quantity: parseInt(quantity), // Ensure it's a number
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Update failed:", errorData);
//         throw new Error(errorData.message || "Failed to update cart item");
//       }

//       const data = await response.json();
//       console.log("Update success:", data); // Debug log
//       return data; // Returns { items: [...], subTotal, grandTotal }
//     } catch (error) {
//       console.error("Cart update error:", error);
//       throw error;
//     }
//   },

//   // ✅ Remove from cart
//   removeFromCart: async (userId, productId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/cart/remove`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId,
//           productId,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to remove from cart");
//       }

//       const data = await response.json();
//       return data; // Returns { items: [...], subTotal, grandTotal }
//     } catch (error) {
//       console.error("Cart remove error:", error);
//       throw error;
//     }
//   },
// };

// export { cartService };
