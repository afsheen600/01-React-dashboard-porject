// import React, { useEffect, useState } from "react";
// import { db } from "../firebase-config";
// import { Box, CircularProgress, Alert } from "@mui/material";
// import {
//   collection,
//   getDocs,
//   deleteDoc,
//   doc,
//   addDoc,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import Swal from "sweetalert2";
// import ProductTable from "./Products/ProductTable";
// import useAppStore from "../store/appStore";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   category: string;
//   date: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// interface Category {
//   value: string;
//   label: string;
// }

// const Products: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const setRows = useAppStore((state) => state.setRows);
//   const rows = useAppStore((state) => state.rows);
//   const productCollectionRef = collection(db, "products");

//   const categories: Category[] = [
//     { value: "Mobile", label: "Mobile" },
//     { value: "Laptop", label: "Laptop" },
//   ];

//   const validateProduct = (product: Omit<Product, "id">): string | null => {
//     if (!product.name.trim()) return "Product name is required";
//     if (product.price <= 0) return "Price must be greater than 0";
//     if (!product.category) return "Category is required";
//     return null;
//   };

//   const getProducts = async () => {
//     setError(null);
//     setLoading(true);
//     try {
//       const data = await getDocs(productCollectionRef);
//       const products: Product[] = data.docs.map((doc) => ({
//         ...(doc.data() as Omit<Product, "id">),
//         id: doc.id,
//         date: doc.data().date || new Date().toISOString(),
//       }));
//       setRows(products);
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to load products";
//       setError(errorMessage);
//       Swal.fire("Error!", errorMessage, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProducts();
//   }, []);

//   const handleEdit = (product: Product | null) => {
//     // Allow null to cancel editing
//     setEditingProduct(product);
//   };

//   const handleSaveProduct = async (productData: Omit<Product, "id">) => {
//     // Validate input
//     const validationError = validateProduct(productData);
//     if (validationError) {
//       Swal.fire("Validation Error!", validationError, "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log("Current editing product:", editingProduct); // Debug

//       const productToSave = {
//         ...productData,
//         updatedAt: serverTimestamp(),
//         date: editingProduct?.date || new Date().toISOString(),
//       };

//       if (editingProduct?.id) {
//         console.log("Updating product with ID:", editingProduct.id); // Debug
//         // Create the document reference with the ID
//         const productRef = doc(db, "products", editingProduct.id);
//         // Update the document while preserving the ID
//         await updateDoc(productRef, {
//           ...productToSave,
//           id: editingProduct.id, // Explicitly preserve the ID
//         });
//         Swal.fire("Success!", "Product updated successfully", "success");
//       } else {
//         console.log("Adding new product"); // Debug
//         await addDoc(productCollectionRef, {
//           ...productToSave,
//           createdAt: serverTimestamp(),
//         });
//         Swal.fire("Success!", "Product added successfully", "success");
//       }

//       setEditingProduct(null);
//       await getProducts();
//     } catch (error) {
//       console.error("Error saving product:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to save product";
//       Swal.fire("Error!", errorMessage, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (id: string) => {
//     try {
//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: "This will permanently delete the product!",
//         showCancelButton: true,
//         confirmButtonColor: "#1976d2",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//       });

//       if (result.isConfirmed) {
//         setLoading(true);
//         await deleteDoc(doc(db, "products", id));
//         await getProducts();
//         Swal.fire("Deleted!", "Product has been removed.", "success");
//       }
//     } catch (error) {
//       Swal.fire("Error!", "Failed to delete product", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Box height={50} />
//       <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
//         {loading && (
//           <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
//             <CircularProgress />
//           </Box>
//         )}
//         <ProductTable
//           title="Products List"
//           products={rows}
//           loading={loading}
//           editingProduct={editingProduct}
//           onAdd={handleSaveProduct}
//           onEdit={handleEdit}
//           onSave={handleSaveProduct}
//           onDelete={handleDeleteProduct}
//           categories={categories}
//         />
//       </Box>
//     </>
//   );
// };

// export default Products;

import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { Box, Alert } from "@mui/material";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";
import ProductTable from "./Products/ProductTable";
import useAppStore from "../store/appStore";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Category {
  value: string;
  label: string;
}

const Products: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);
  const productCollectionRef = collection(db, "products");

  const categories: Category[] = [
    { value: "Mobile", label: "Mobile" },
    { value: "Laptop", label: "Laptop" },
    { value: "Tablet", label: "Tablet" },
    { value: "Accessories", label: "Accessories" },
  ];

  const validateProduct = (product: Omit<Product, "id">): string | null => {
    if (!product.name.trim()) return "Product name is required";
    if (product.price <= 0) return "Price must be greater than 0";
    if (!product.category) return "Category is required";
    return null;
  };

  const getProducts = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getDocs(productCollectionRef);
      const products: Product[] = data.docs.map((doc) => ({
        ...(doc.data() as Omit<Product, "id">),
        id: doc.id,
        date: doc.data().date || new Date().toISOString(),
      }));
      setRows(products);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load products";
      setError(errorMessage);
      Swal.fire("Error!", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleEdit = (product: Product | null) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (productData: Omit<Product, "id">) => {
    const validationError = validateProduct(productData);
    if (validationError) {
      Swal.fire("Validation Error!", validationError, "error");
      return;
    }

    setLoading(true);
    try {
      const productToSave = {
        ...productData,
        updatedAt: serverTimestamp(),
        date: editingProduct?.date || new Date().toISOString(),
      };

      if (editingProduct?.id) {
        const productRef = doc(db, "products", editingProduct.id);
        await updateDoc(productRef, productToSave);
        Swal.fire("Success!", "Product updated successfully", "success");
      } else {
        await addDoc(productCollectionRef, {
          ...productToSave,
          createdAt: serverTimestamp(),
        });
        Swal.fire("Success!", "Product added successfully", "success");
      }

      setEditingProduct(null);
      await getProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save product";
      Swal.fire("Error!", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the product!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1976d2",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await deleteDoc(doc(db, "products", id));
        await getProducts();
        Swal.fire("Deleted!", "Product has been removed.", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <ProductTable
        title="Products Management"
        products={rows}
        loading={loading}
        editingProduct={editingProduct}
        onEdit={handleEdit}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        onRefresh={getProducts}
        categories={categories}
      />
    </Box>
  );
};

export default Products;
