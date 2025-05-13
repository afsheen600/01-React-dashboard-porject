import React, { useState, useEffect } from "react";
import {
  IconButton,
  Typography,
  Grid,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Swal from "sweetalert2";

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

interface AddFormProps {
  open: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSave: (product: Omit<Product, "id">) => Promise<void>;
  loading: boolean;
}

const AddForm: React.FC<AddFormProps> = ({
  open,
  onClose,
  productToEdit,
  onSave,
  loading,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setCategory(productToEdit.category);
    } else {
      resetForm();
    }
  }, [productToEdit, open]);

  const resetForm = () => {
    setName("");
    setPrice(0);
    setCategory("");
  };

  const handleSubmit = async () => {
    if (!name || !category || price <= 0) {
      Swal.fire("Error!", "Please fill all fields correctly", "error");
      return;
    }

    const productData = {
      name,
      price,
      category,
      date: productToEdit?.date || new Date().toISOString(),
    };

    try {
      await onSave(productData);
      Swal.fire(
        "Success!",
        `Product ${productToEdit ? "updated" : "added"} successfully!`,
        "success"
      );
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire("Error!", "Failed to save product", "error");
    }
  };

  const categories = [
    { value: "Mobile", label: "Mobile" },
    { value: "Laptop", label: "Laptop" },
    // Add more categories as needed
  ];

  return (
    <Box sx={{ position: "relative", px: 1 }}>
      <Typography variant="h6">
        {productToEdit ? "Edit Product" : "Add Product"}
      </Typography>
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={onClose}
        disabled={loading}
      >
        <CloseIcon />
      </IconButton>

      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            fullWidth
            size="small"
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price"
            type="number"
            variant="outlined"
            value={price}
            fullWidth
            size="small"
            onChange={(e) => setPrice(Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
            required
            disabled={loading}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Category"
            variant="outlined"
            value={category}
            fullWidth
            size="small"
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={loading}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Box textAlign="center">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : productToEdit ? "Update" : "Submit"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddForm;
