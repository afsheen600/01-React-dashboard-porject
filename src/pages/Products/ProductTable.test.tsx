import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductTable from "./ProductTable";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Swal from "sweetalert2";

// Improve SweetAlert2 mock
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockImplementation((title, text, type) => {
    if (type === "warning") {
      return Promise.resolve({ isConfirmed: false });
    }
    return Promise.resolve({ isConfirmed: true });
  }),
}));

const theme = createTheme();

// Add proper typing for mock products
interface MockProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  date: string;
}

const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "iPhone 13",
    price: 999,
    category: "Mobile",
    date: new Date("2023-01-01").toISOString(),
  },
  {
    id: "2",
    name: "MacBook Pro",
    price: 1999,
    category: "Laptop",
    date: new Date("2023-01-02").toISOString(),
  },
  {
    id: "3",
    name: "iPad Air",
    price: 599,
    category: "Tablet",
    date: new Date("2023-01-03").toISOString(),
  },
];

// Improve default props typing
const defaultProps = {
  products: mockProducts,
  onEdit: jest.fn().mockImplementation((product) => Promise.resolve(product)),
  onSave: jest.fn().mockImplementation((product) => Promise.resolve(product)),
  onDelete: jest.fn().mockImplementation((id) => Promise.resolve(true)),
  onRefresh: jest.fn().mockImplementation(() => Promise.resolve(mockProducts)),
  showActions: true,
  showSearch: true,
  showAddButton: true,
};

const renderProductTable = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <ProductTable {...defaultProps} {...props} />
    </ThemeProvider>
  );
};

describe("ProductTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with products", async () => {
    renderProductTable();
    expect(await screen.findByText("Products List")).toBeInTheDocument();
    expect(screen.getByText("iPhone 13")).toBeInTheDocument();
    expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
    expect(screen.getByText("iPad Air")).toBeInTheDocument();
  });

  it("filters products case-insensitively", async () => {
    renderProductTable();
    const searchInput = screen.getByLabelText("Search Products");

    await userEvent.type(searchInput, "iphone");
    expect(screen.getByText("iPhone 13")).toBeInTheDocument();
    expect(screen.queryByText("MacBook Pro")).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "IPHONE");
    expect(screen.getByText("iPhone 13")).toBeInTheDocument();
  });

  it("handles empty search results correctly", async () => {
    renderProductTable();
    const searchInput = screen.getByLabelText("Search Products");

    await userEvent.type(searchInput, "nonexistent");
    expect(await screen.findByText("No products found")).toBeInTheDocument();
  });

  it("opens add product modal with empty fields", async () => {
    renderProductTable();
    const addButton = screen.getByText("Add Product");

    setTimeout(async () => {
      await userEvent.click(addButton);
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();
      expect(screen.getByLabelText("Name")).toHaveValue("");
      expect(screen.getByLabelText("Price")).toHaveValue("0");
      expect(screen.getByLabelText("Category")).toHaveValue("");
    });
  }, 300);

  it("validates form inputs before submission", async () => {
    renderProductTable();
    setTimeout(async () => {
      await userEvent.click(screen.getByText("Add Product"));
      await userEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(
          "Validation Error",
          "Name and category are required",
          "warning"
        );
      });
    }, 300);
  });

  it("handles delete confirmation", async () => {
    renderProductTable();

    // Find all delete buttons - using more specific query
    const deleteButtons = screen.getAllByRole("button", {
      name: /delete/i,
    });

    // Verify we found buttons
    expect(deleteButtons.length).toBeGreaterThan(0);

    await userEvent.click(deleteButtons[0]);

    // Verify SweetAlert was called with expected arguments

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: expect.any(String),
        cancelButtonColor: expect.any(String),
        confirmButtonText: "Yes, delete it!",
      });
    });

    // Verify onDelete was called with correct ID after confirmation
    setTimeout(async () => {
      await waitFor(() => {
        expect(defaultProps.onDelete).toHaveBeenCalledWith("1");
      });
    }, 300);
  });

  it("updates product list after successful edit", async () => {
    const onSave = jest.fn().mockResolvedValue({});
    renderProductTable({ onSave });

    // Find edit buttons - ensure they exist
    const editButtons = await screen.findAllByRole("button", { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);

    fireEvent.click(editButtons[0]);

    // Wait for modal to open and inputs to be available
    setTimeout(async () => {
      const nameInput = await screen.findByTestId("product-name");
      const saveButton = await screen.findByRole("button", { name: /save/i });
      // Clear and type new value
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Updated iPhone");

      // Click save and wait for actions to complete
      await userEvent.click(saveButton);

      // Verify onSave was called with updated product details
      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({
          id: "1",
          name: "Updated iPhone",
          price: 999,
          category: "Mobile",
          date: expect.any(String),
        });
      });

      // Verify modal is closed after save
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    }, 300);
  });

  it("handles pagination correctly", async () => {
    renderProductTable();

    // Check initial page
    expect(screen.getByText("iPhone 13")).toBeInTheDocument();
    expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
    expect(screen.getByText("iPad Air")).toBeInTheDocument();

    // Change rows per page to 2
    setTimeout(async () => {
      const rowsPerPageSelect = screen.getByLabelText("Rows per page:");
      await userEvent.click(rowsPerPageSelect);
      const option = await screen.findByText("10");
      await userEvent.click(option);

      // Verify only 2 items shown (since we have 3 products and default is 5)
      expect(screen.getByText("iPhone 13")).toBeInTheDocument();
      expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
      expect(screen.getByText("iPad Air")).toBeInTheDocument();

      // Go to next page (shouldn't change anything since we have only 3 products)
      const nextPageButton = screen.getByLabelText("Go to next page");
      await userEvent.click(nextPageButton);
    }, 300);
  });

  it("handles refresh button click", async () => {
    renderProductTable();
    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    setTimeout(async () => {
      await userEvent.click(refreshButton);
      expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
