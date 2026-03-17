// // services/categoryService.js

// // Use env variable if available, otherwise fallback to default
// const API_BASE_URL =
//   process.env.REACT_APP_API_BASE_URL || "https://api.minutos.in/api";
// //api.minutos.in/api/category/categories
// export const categoryService = {
//   // ✅ Get all categories (simple list)
//   getCategories: async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/category/categories`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data.categories,
//         count: data.count,
//         pagination: data.pagination,
//         message: data.message,
//       };
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   },

//   // ✅ Get categories with subcategories (nested response)
//   getCategoriesWithSubcategories: async () => {
//     try {
//       const response = await fetch(
//         `https://api.minutos.in/api/subcategory/categories-with-subcategories`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data.categories, // nested categories + subcategories
//         count: data.count,
//         message: data.message,
//       };
//     } catch (error) {
//       console.error("Error fetching categories with subcategories:", error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   },
// };

// export default categoryService;
