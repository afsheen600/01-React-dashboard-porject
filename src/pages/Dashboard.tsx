import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Stack,
  LinearProgress,
} from "@mui/material";
import ChartBar from "../charts/ChartBar";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccordionDash from "../pages/AccordionDash";
import CountUp from "react-countup";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ProductTable from "./Products/ProductTable";
import Swal from "sweetalert2";

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
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
      }));
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

  const handleSaveProduct = async (productData: Omit<Product, "id">) => {
    setLoading(true);
    try {
      if (editingProduct?.id) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          name: productData.name,
          price: productData.price,
          category: productData.category,
          date: productData.date,
        });
        Swal.fire("Success!", "Product updated successfully", "success");
      } else {
        await addDoc(collection(db, "products"), {
          name: productData.name,
          price: productData.price,
          category: productData.category,
          date: productData.date || new Date().toISOString(),
        });
        Swal.fire("Success!", "Product added successfully", "success");
      }
      await fetchProducts();
      setEditingProduct(null);
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
        confirmButtonColor: "#1976d2",
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
    <Box sx={{ backgroundColor: theme.palette.background.default, p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Cards Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8} lg={8}>
            <Stack
              spacing={3}
              direction={isMobile ? "column" : "row"}
              sx={{ height: "100%" }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: isMobile ? 160 : 180,
                  background:
                    "linear-gradient(135deg,rgb(116, 157, 191),rgb(98, 150, 162))",
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "center" : "flex-start",
                    justifyContent: "center",
                    height: "100%",
                    px: 3,
                    py: isMobile ? 2 : 3,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      p: 1,
                      mb: 1,
                      display: "inline-flex",
                    }}
                  >
                    <CreditCardIcon fontSize="medium" sx={{ color: "white" }} />
                  </Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="div"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    $<CountUp delay={0.4} end={500} duration={0.6} />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Total Earning
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  width: "100%",
                  height: isMobile ? 160 : 180,
                  background:
                    "linear-gradient(135deg,rgb(116, 155, 117),rgb(145, 174, 111))",
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMobile ? "center" : "flex-start",
                    justifyContent: "center",
                    height: "100%",
                    px: 3,
                    py: isMobile ? 2 : 3,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "50%",
                      p: 1,
                      mb: 1,
                      display: "inline-flex",
                    }}
                  >
                    <ShoppingBagIcon
                      fontSize="medium"
                      sx={{ color: "white" }}
                    />
                  </Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="div"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    $<CountUp delay={0.4} end={900} duration={0.6} />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <Stack spacing={3}>
              <Card
                sx={{
                  height: isMobile ? 160 : 180,
                  background:
                    "linear-gradient(135deg,rgb(203, 167, 113),rgb(232, 209, 141))",
                  boxShadow: theme.shadows[4],
                }}
              >
                <CardContent>
                  <Stack spacing={2} direction={"row"} alignItems="center">
                    <Box
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50%",
                        p: 1,
                        display: "inline-flex",
                      }}
                    >
                      <StorefrontIcon sx={{ color: "white" }} />
                    </Box>
                    <Box>
                      <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ color: "white", fontWeight: 600 }}
                      >
                        $213k
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: isMobile ? "0.875rem" : "1rem",
                        }}
                      >
                        Total Income
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section - Chart and Accordion */}
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8} lg={8}>
              <Card
                sx={{
                  height: isMobile ? 400 : 500,
                  boxShadow: theme.shadows[4],
                }}
              >
                <CardContent sx={{ height: "100%" }}>
                  <ChartBar />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Card
                sx={{
                  height: isMobile ? 400 : 500,
                  backgroundColor: "lightblue",
                  boxShadow: theme.shadows[4],
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, color: "white", fontWeight: 600 }}
                  >
                    Popular Products
                  </Typography>
                  <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <AccordionDash />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Product Table Section */}
        <Box>
          <Card sx={{ boxShadow: theme.shadows[4] }}>
            <CardContent>
              {loading && <LinearProgress />}
              <ProductTable
                title="Product Inventory"
                products={products}
                loading={loading}
                editingProduct={editingProduct}
                onEdit={setEditingProduct}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
                onRefresh={fetchProducts}
                categories={[
                  { value: "Mobile", label: "Mobile" },
                  { value: "Laptop", label: "Laptop" },
                  { value: "Tablet", label: "Tablet" },
                  { value: "Accessories", label: "Accessories" },
                ]}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
