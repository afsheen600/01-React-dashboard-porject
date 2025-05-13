import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Products from "./Products";

// Add proper interfaces
interface Product {
  id: number;
  name: string;
  price?: number;
  category?: string;
}

interface AppStore {
  rows: Product[];
  setRows: (rows: Product[]) => void;
  loading?: boolean;
  error?: string | null;
  fetchProducts?: () => Promise<void>;
}

// Improve mock implementation
const mockStore = {} as AppStore;
jest.mock("../store/appStore", () => ({
  __esModule: true,
  default: jest.fn(() => mockStore),
}));

describe("Products Component", () => {
  beforeEach(() => {
    // Reset mock store state before each test
    mockStore.rows = [];
    mockStore.setRows = jest.fn();
    mockStore.loading = false;
    mockStore.error = null;
    mockStore.fetchProducts = jest.fn().mockResolvedValue(undefined);
  });

  it("renders without crashing", () => {
    render(<Products />);
    expect(screen.getByText("Products Management")).toBeInTheDocument();
  });

  it("displays an error alert when there is an error", () => {
    const mockError = "Error loading products";
    mockStore.error = mockError;

    render(<Products />);
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it("calls onRefresh when refresh button is clicked", async () => {
    render(<Products />);
    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await userEvent.click(refreshButton);

    expect(mockStore.fetchProducts).toHaveBeenCalled();
  });

  it("renders rows when data is available", async () => {
    const mockData: Product[] = [
      { id: 1, name: "Product A" },
      { id: 2, name: "Product B" },
    ];

    mockStore.rows = mockData;
    mockStore.loading = false;

    render(<Products />);

    setTimeout(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
      expect(screen.getByText("Product B")).toBeInTheDocument();
    }, 300);
  });

  it("renders a loading indicator when data is being fetched", async () => {
    mockStore.loading = true;

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
    });
  });

  it("displays a message when no products are available", () => {
    mockStore.rows = [];
    mockStore.loading = false;

    render(<Products />);
    expect(screen.getByTestId("no-products-message")).toBeInTheDocument();
  });

  it("handles row click events correctly", async () => {
    const mockRowClickHandler = jest.fn();
    const mockData: Product = { id: 1, name: "Product A" };
    mockStore.rows = [mockData];

    render(<Products />);

    const row = await screen.findByText("Product A");
    await userEvent.click(row);

    expect(mockRowClickHandler).toHaveBeenCalledWith(mockData);
  });

  it("handles errors gracefully when fetching products fails", () => {
    const errorMessage = "Failed to load products";
    mockStore.error = errorMessage;

    render(<Products />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
