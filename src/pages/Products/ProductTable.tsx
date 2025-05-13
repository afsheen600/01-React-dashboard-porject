import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Divider,
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  Modal,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
  Grid,
  InputAdornment,
  MenuItem,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Swal from "sweetalert2";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

interface ProductTableProps {
  title?: string;
  products: Product[];
  loading?: boolean;
  editingProduct?: Product | null;
  onAdd?: (product: Omit<Product, "id">) => Promise<void>;
  onEdit: (product: Product | null) => void;
  onSave: (product: Omit<Product, "id">) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
  showActions?: boolean;
  showSearch?: boolean;
  showAddButton?: boolean;
  categories?: { value: string; label: string }[];
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 450,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
};

const defaultCategories = [
  { value: "Mobile", label: "Mobile" },
  { value: "Laptop", label: "Laptop" },
  { value: "Tablet", label: "Tablet" },
  { value: "Accessories", label: "Accessories" },
];

export default function ProductTable({
  title = "Products List",
  products = [],
  loading = false,
  editingProduct,
  onAdd,
  onEdit,
  onSave,
  onDelete,
  onRefresh,
  showActions = true,
  showSearch = true,
  showAddButton = true,
  categories = defaultCategories,
}: ProductTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    category: "",
    date: new Date().toISOString(),
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRows, setFilteredRows] = useState<Product[]>(products);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredRows(products);
  }, [products]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        date: editingProduct.date,
      });
      setFormOpen(true);
    }
  }, [editingProduct]);

  const handleEditClick = (product: Product) => {
    onEdit(product);
  };

  const handleCancelEdit = () => {
    onEdit(null);
    setFormOpen(false);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      await onSave(formData);
      handleCancelEdit();
    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire("Error!", "Failed to save product", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      price: 0,
      category: "",
      date: new Date().toISOString(),
    });
    setFormOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: theme.palette.primary.main,
        cancelButtonColor: theme.palette.error.main,
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed && onDelete) {
        await onDelete(id);
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete product.", "error");
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredRows(products);
      return;
    }
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase()) ||
        product.price.toString().includes(term)
    );
    setFilteredRows(filtered);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (error) {
        Swal.fire("Error!", "Failed to refresh data.", "error");
      }
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        {onRefresh && (
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems="center"
      >
        {showSearch && (
          <TextField
            size="small"
            label="Search Products"
            value={searchTerm}
            sx={{ width: { xs: "100%", sm: 300 } }}
            onChange={(e) => filterData(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box flexGrow={1} />
        {showAddButton && (
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<AddCircleIcon />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            disabled={loading}
          >
            Add Product
          </Button>
        )}
      </Stack>

      {isMobile ? (
        <Stack spacing={2}>
          {filteredRows.length === 0 ? (
            <Typography variant="body1" textAlign="center" py={4}>
              No products found
            </Typography>
          ) : (
            filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Card key={row.id} variant="outlined">
                  <CardContent
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {row.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${row.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {row.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(row.date).toLocaleDateString()}
                    </Typography>
                    {showActions && (
                      <Stack
                        direction="row"
                        spacing={1}
                        mt={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditClick(row)}>
                            <EditIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteClick(row.id || "")}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </Stack>
      ) : (
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                {showActions && (
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 5 : 4} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>${row.price.toFixed(2)}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>
                        {new Date(row.date).toLocaleDateString()}
                      </TableCell>
                      {showActions && (
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEditClick(row)}>
                                <EditIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDeleteClick(row.id || "")}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />

      <Modal open={formOpen} onClose={handleCancelEdit}>
        <Box sx={modalStyle}>
          <Box sx={{ position: "relative", px: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {editingProduct ? "Edit Product" : "Add Product"}
            </Typography>
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0 }}
              onClick={handleCancelEdit}
              disabled={formLoading}
            >
              <CloseIcon />
            </IconButton>

            <Box height={20} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  data-testid="product-name"
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  fullWidth
                  size="small"
                  required
                  disabled={formLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  type="number"
                  variant="outlined"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: "0.01" },
                  }}
                  required
                  disabled={formLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Category"
                  variant="outlined"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  fullWidth
                  size="small"
                  required
                  disabled={formLoading}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={formLoading}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={formLoading}
                    startIcon={<SaveIcon />}
                  >
                    {formLoading ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}
