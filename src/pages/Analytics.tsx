import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import GeoChart from "../charts/GeoChart";
import PieChart from "../charts/PieChart";
import HbarChart from "../charts/HbarChart";
import CountUp from "react-countup";
import ProductTable from "../pages/Products/ProductTable";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

const Analytics: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        category: doc.data().category,
        date: doc.data().date || new Date().toISOString(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire("Error!", "Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const validateProduct = (product: Omit<Product, "id">): string | null => {
    if (!product.name.trim()) return "Product name is required";
    if (product.price <= 0) return "Price must be greater than 0";
    if (!product.category) return "Category is required";
    return null;
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
        await updateDoc(doc(db, "products", editingProduct.id), productToSave);
        Swal.fire("Success!", "Product updated successfully", "success");
      } else {
        await addDoc(collection(db, "products"), {
          ...productToSave,
          createdAt: serverTimestamp(),
        });
        Swal.fire("Success!", "Product added successfully", "success");
      }

      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire("Error!", "Failed to save product", "error");
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
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await deleteDoc(doc(db, "products", id));
        await fetchProducts();
        Swal.fire("Deleted!", "Product has been removed.", "success");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Error!", "Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg,rgb(75, 86, 147),rgb(87, 153, 207))",
              color: "white",
              borderRadius: 3,
              boxShadow: 3,
              height: "80%",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visitors
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                <CountUp delay={0.4} end={3200} duration={0.6} />
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Since Last Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg,rgb(92, 140, 93),rgb(111, 147, 71))",
              color: "white",
              borderRadius: 3,
              boxShadow: 3,
              height: "80%",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                <CountUp delay={0.4} end={1800} duration={0.6} />
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Since Last Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg,rgb(230, 195, 143),rgb(229, 207, 138))",
              color: "white",
              borderRadius: 3,
              boxShadow: 3,
              height: "80%",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orders
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                <CountUp delay={0.4} end={3000} duration={0.5} />
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Since Last Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ height: "80%" }}>
              <PieChart />
            </CardContent>
          </Card>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Geographical Distribution
              </Typography>
              <GeoChart />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Sales by Category
              </Typography>
              <HbarChart />
            </CardContent>
          </Card>
        </Grid>

        {/* Product Table Section */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <ProductTable
                title="Product Analytics"
                products={products}
                loading={loading}
                editingProduct={editingProduct}
                onEdit={setEditingProduct}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
                categories={[
                  { value: "Mobile", label: "Mobile" },
                  { value: "Laptop", label: "Laptop" },
                  { value: "Tablet", label: "Tablet" },
                  { value: "Accessories", label: "Accessories" },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
