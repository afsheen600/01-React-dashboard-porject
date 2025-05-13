import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
} from "@mui/material";

function CustomTabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ShopSettings() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600-900px
  const isLarge = useMediaQuery(theme.breakpoints.up("md")); // > 900px

  const [value, setValue] = useState(0);
  const [storeInfo, setStoreInfo] = useState({
    name: "Mobile World",
    email: "contact@mobileworld.com",
    phone: "+1234567890",
    address: "123 Main St, City",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
  };

  return (
    <Paper
      elevation={isSmall ? 0 : 1}
      sx={{
        width: "80%",
        maxWidth: isLarge ? "800px" : "80%",
        mx: "auto",
        my: isSmall ? 0 : 1,
        p: isSmall ? 1 : isMedium ? 2 : 3,
        borderRadius: isSmall ? 0 : 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Typography
        variant={isSmall ? "h5" : "h4"}
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.primary.main,
          textAlign: isSmall ? "center" : "left",
        }}
      >
        Shop Settings
      </Typography>

      {/* Tabs - Responsive Behavior */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isSmall || isMedium ? "fullWidth" : "standard"} // ✅ No scrollbars
          scrollButtons={false}
          allowScrollButtonsMobile={false}
          sx={{
            "& .MuiTabs-flexContainer": {
              flexWrap: isSmall || isMedium ? "wrap" : "nowrap", // optional wrap on mid screens
            },
            "& .MuiTab-root": {
              minWidth: "auto", // ✅ allows tabs to shrink
              fontSize: isSmall ? "0.75rem" : "0.875rem",
              py: isSmall ? 1 : 1.5,
              textTransform: "capitalize",
              flex: 1, // ✅ make all tabs equal width
            },
          }}
        >
          <Tab label="Store Info" />
          <Tab label="Payment" />
          <Tab label="Notifications" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      {/* Store Info Panel */}
      <CustomTabPanel value={value} index={0}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: isLarge ? "1fr 1fr" : "1fr",
            "& .MuiTextField-root": { mb: 0 },
          }}
        >
          <TextField
            fullWidth
            label="Store Name"
            name="name"
            value={storeInfo.name}
            onChange={handleStoreInfoChange}
            size={isSmall ? "small" : "medium"}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={storeInfo.email}
            onChange={handleStoreInfoChange}
            size={isSmall ? "small" : "medium"}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={storeInfo.phone}
            onChange={handleStoreInfoChange}
            size={isSmall ? "small" : "medium"}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={storeInfo.address}
            onChange={handleStoreInfoChange}
            size={isSmall ? "small" : "medium"}
            multiline
            rows={3}
            variant="outlined"
            sx={{ gridColumn: isLarge ? "1 / -1" : "auto" }}
          />
          <Button
            variant="contained"
            size={isSmall ? "medium" : "large"}
            sx={{
              gridColumn: isLarge ? "1 / -1" : "auto",
              mt: 1,
              py: isSmall ? 1 : 1.5,
            }}
          >
            Save Store Info
          </Button>
        </Box>
      </CustomTabPanel>

      {/* Payment Panel */}
      <CustomTabPanel value={value} index={1}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Payment Settings
          </Typography>
          <Divider />

          <FormControl fullWidth size={isSmall ? "small" : "medium"}>
            <InputLabel>Primary Payment Method</InputLabel>
            <Select label="Primary Payment Method" defaultValue="cod">
              <MenuItem value="stripe">Credit Card</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="cod">Cash on Delivery</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size={isSmall ? "small" : "medium"}>
            <InputLabel>Default Currency</InputLabel>
            <Select label="Default Currency" defaultValue="usd">
              <MenuItem value="usd">USD ($)</MenuItem>
              <MenuItem value="eur">EUR (€)</MenuItem>
              <MenuItem value="gbp">GBP (£)</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size={isSmall ? "medium" : "large"}
            sx={{ mt: 1, py: isSmall ? 1 : 1.5 }}
          >
            Update Payment Settings
          </Button>
        </Box>
      </CustomTabPanel>

      {/* Notifications Panel */}
      <CustomTabPanel value={value} index={2}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Notification Preferences
          </Typography>
          <Divider />

          <FormControlLabel
            control={<Switch color="primary" defaultChecked />}
            label="Email Notifications"
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Switch color="primary" />}
            label="SMS Notifications"
            sx={{ m: 0 }}
          />
          <FormControlLabel
            control={<Switch color="primary" defaultChecked />}
            label="Low Stock Alerts"
            sx={{ m: 0 }}
          />

          <TextField
            fullWidth
            label="Admin Email"
            defaultValue="admin@mobileworld.com"
            size={isSmall ? "small" : "medium"}
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            size={isSmall ? "medium" : "large"}
            sx={{ mt: 1, py: isSmall ? 1 : 1.5 }}
          >
            Save Notification Settings
          </Button>
        </Box>
      </CustomTabPanel>

      {/* Security Panel */}
      <CustomTabPanel value={value} index={3}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Security Settings
          </Typography>
          <Divider />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: isMedium ? "1fr 1fr" : "1fr",
            }}
          >
            <Button
              variant="outlined"
              size={isSmall ? "medium" : "large"}
              sx={{ py: isSmall ? 1 : 1.5 }}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              size={isSmall ? "medium" : "large"}
              sx={{ py: isSmall ? 1 : 1.5 }}
            >
              Two-Factor Auth
            </Button>
          </Box>

          <FormControlLabel
            control={<Switch color="primary" defaultChecked />}
            label="Auto logout after 30 minutes"
            sx={{ mt: 1 }}
          />

          <TextField
            fullWidth
            label="Add New Admin"
            placeholder="Enter admin email"
            size={isSmall ? "small" : "medium"}
            sx={{ mt: 1 }}
          />
        </Box>
      </CustomTabPanel>
    </Paper>
  );
}
