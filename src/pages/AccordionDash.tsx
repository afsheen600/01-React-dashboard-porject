//
import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import HelpIcon from "@mui/icons-material/Help";
import StarIcon from "@mui/icons-material/Star";

export default function MobileShopAccordion() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Sample data
  const topProducts = [
    { id: 1, name: "iPhone 15 Pro", price: "$999", stock: "In Stock" },
    { id: 2, name: "Samsung Galaxy S23", price: "$799", stock: "Low Stock" },
    { id: 3, name: "Google Pixel 8", price: "$699", stock: "In Stock" },
  ];

  const recentOrders = [
    { id: "#ORD-1001", date: "2023-11-15", total: "$999", status: "Delivered" },
    { id: "#ORD-1002", date: "2023-11-10", total: "$1598", status: "Shipped" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        pr: 1,
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#999",
          borderRadius: "4px",
        },
      }}
    >
      {/* Product Categories */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PhoneIphoneIcon fontSize={isMobile ? "medium" : "large"} />
            <Typography variant={isMobile ? "subtitle2" : "subtitle1"}>
              Product Categories
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List dense>
            {["Smartphones", "Accessories", "Tablets"].map(
              (category, index) => (
                <React.Fragment key={category}>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ px: isMobile ? 1 : 2 }}>
                      <ListItemText
                        primary={category}
                        primaryTypographyProps={{
                          variant: isMobile ? "body2" : "body1",
                        }}
                        secondary={`${index * 100 + (index + 1) * 50} items`}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < 2 && <Divider />}
                </React.Fragment>
              )
            )}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Top Products */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <StarIcon fontSize={isMobile ? "medium" : "large"} />
            <Typography variant={isMobile ? "subtitle2" : "subtitle1"}>
              Top Selling Products
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List>
            {topProducts.map((product, index) => (
              <React.Fragment key={product.id}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label="Bestseller"
                      color="success"
                      size={isMobile ? "small" : "medium"}
                      sx={{ mr: isMobile ? 0.5 : 1 }}
                    />
                  }
                >
                  <ListItemButton sx={{ px: isMobile ? 1 : 2 }}>
                    <ListItemText
                      primary={product.name}
                      primaryTypographyProps={{
                        variant: isMobile ? "body2" : "body1",
                      }}
                      secondary={`${product.price} • ${product.stock}`}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItemButton>
                </ListItem>
                {index < topProducts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Recent Orders */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ShoppingBasketIcon fontSize={isMobile ? "medium" : "large"} />
            <Typography variant={isMobile ? "subtitle2" : "subtitle1"}>
              Recent Orders
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <List>
            {recentOrders.map((order) => (
              <ListItem
                key={order.id}
                disablePadding
                secondaryAction={
                  <Chip
                    label={order.status}
                    color={order.status === "Delivered" ? "success" : "warning"}
                    size={isMobile ? "small" : "medium"}
                    sx={{ mr: isMobile ? 0.5 : 1 }}
                  />
                }
              >
                <ListItemButton sx={{ px: isMobile ? 1 : 2 }}>
                  <ListItemText
                    primary={`Order ${order.id}`}
                    primaryTypographyProps={{
                      variant: isMobile ? "body2" : "body1",
                    }}
                    secondary={`${order.date} • Total: ${order.total}`}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* FAQ Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HelpIcon fontSize={isMobile ? "medium" : "large"} />
            <Typography variant={isMobile ? "subtitle2" : "subtitle1"}>
              FAQs
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {[
            {
              question: "What's the return policy?",
              answer:
                "30-day return policy for unused products with original packaging.",
            },
            {
              question: "Do you offer international shipping?",
              answer: "Yes, we ship to over 50 countries worldwide.",
            },
          ].map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                boxShadow: "none",
                "&:before": { display: "none" },
                mb: index === 0 ? 1 : 0,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon fontSize="small" />}
              >
                <Typography variant={isMobile ? "body2" : "body1"}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
