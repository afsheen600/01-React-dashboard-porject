import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import "@testing-library/jest-dom";
import Analytics from "../pages/Analytics";

// Mock data with proper types
interface TestProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  date: string;
  stock?: number;
}

const testProducts: TestProduct[] = [
  {
    id: "1",
    name: "iPhone 13",
    price: 999,
    category: "Mobile",
    date: "2024-01-01",
    stock: 50,
  },
  {
    id: "2",
    name: "MacBook Pro",
    price: 1999,
    category: "Laptop",
    date: "2024-01-01",
    stock: 30,
  },
];

// Improve mock types and add error scenarios
const mockCollection = jest.fn();
const mockAddDoc = jest
  .fn()
  .mockImplementation(() => Promise.resolve({ id: "new-id" }));
const mockUpdateDoc = jest.fn().mockImplementation(() => Promise.resolve());
const mockDeleteDoc = jest.fn().mockImplementation(() => Promise.resolve());
const mockGetDocs = jest.fn();
const mockDoc = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: (db: any, path: string) => {
    mockCollection(path);
    return { path };
  },
  getDocs: () =>
    mockGetDocs.mockImplementation(() =>
      Promise.resolve({
        docs: testProducts.map((product) => ({
          id: product.id,
          data: () => product,
          ref: { id: product.id, path: `products/${product.id}` },
        })),
      })
    ),
  addDoc: async (collection: any, data: any) => {
    await mockAddDoc(collection, data);
    return { id: "new-id" };
  },
  updateDoc: async (ref: any, data: any) => {
    await mockUpdateDoc(ref, data);
  },
  deleteDoc: async (ref: any) => {
    await mockDeleteDoc(ref);
  },
  doc: (db: any, collection: string, id: string) => {
    mockDoc(collection, id);
    return { id, collection, path: `${collection}/${id}` };
  },
}));

// Mock chart components with proper props
jest.mock("../charts/GeoChart", () => ({
  __esModule: true,
  default: () => <div data-testid="geo-chart">Geo Chart</div>,
}));

jest.mock("../charts/PieChart", () => ({
  __esModule: true,
  default: () => <div data-testid="pie-chart">Pie Chart</div>,
}));

jest.mock("../charts/HbarChart", () => ({
  __esModule: true,
  default: () => <div data-testid="hbar-chart">HBar Chart</div>,
}));

// Add error boundary mock
jest.mock("../components/ErrorBoundary", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const theme = createTheme();
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("Analytics Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDocs.mockClear();
    mockAddDoc.mockClear();
    mockUpdateDoc.mockClear();
    mockDeleteDoc.mockClear();
    // Setup successful mock response
    mockGetDocs.mockResolvedValue({
      docs: testProducts.map((product) => ({
        id: product.id,
        data: () => product,
        ref: { id: product.id, path: `products/${product.id}` },
      })),
    });
  });

  it("renders main analytics components", async () => {
    renderWithTheme(<Analytics />);

    expect(screen.getByTestId("geo-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("hbar-chart")).toBeInTheDocument();
  });

  it("loads and displays products correctly", async () => {
    renderWithTheme(<Analytics />);

    await waitFor(() => {
      testProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });
  });

  it("handles product deletion", async () => {
    mockDeleteDoc.mockResolvedValueOnce(undefined);

    renderWithTheme(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(testProducts[0].name)).toBeInTheDocument();
    });

    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  it("handles product addition", async () => {
    const newProduct = {
      name: "Test Product",
      price: 100,
      category: "Test",
      date: expect.any(String),
    };

    mockAddDoc.mockResolvedValueOnce({ id: "new-id" });

    renderWithTheme(<Analytics />);

    const addButton = await screen.findByRole("button", {
      name: /add product/i,
    });
    fireEvent.click(addButton);

    // Fill form and submit (assuming you have a form)
    const submitButton = await screen.findByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(newProduct)
      );
    });
  });

  it("handles fetch errors gracefully", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetDocs.mockRejectedValueOnce(new Error("Failed to fetch"));

    renderWithTheme(<Analytics />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  // Add test for loading state
  it("shows loading state initially", () => {
    renderWithTheme(<Analytics />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  // Add test for network error
  it("handles network errors gracefully", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("Network error"));
    renderWithTheme(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  // Add test for form validation
  it("validates required fields in add product form", async () => {
    renderWithTheme(<Analytics />);

    const addButton = screen.getByRole("button", { name: /add product/i });
    fireEvent.click(addButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      // expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });
});
