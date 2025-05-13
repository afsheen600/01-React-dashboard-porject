import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddForm from "./AddForm";
import Swal from "sweetalert2";

// Mock SweetAlert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({}),
}));

describe("AddForm Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn().mockResolvedValue(undefined);
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    loading: false,
    productToEdit: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders form with correct fields", () => {
    render(<AddForm {...defaultProps} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(<AddForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error!",
        "Please fill all fields correctly",
        "error"
      );
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it("validates minimum price value", async () => {
    render(<AddForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/name/i), "Test Product");

    // Use fireEvent for numeric field
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "-1" },
    });

    await userEvent.click(screen.getByLabelText(/category/i));
    await userEvent.click(screen.getByText("Mobile"));

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error!",
        "Please fill all fields correctly",
        "error"
      );
    });
  });

  it("handles API error during form submission", async () => {
    const errorMessage = "API Error";
    mockOnSave.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/name/i), "Test Product");
    await userEvent.clear(screen.getByLabelText(/price/i));
    await userEvent.type(screen.getByLabelText(/price/i), "100");
    await userEvent.click(screen.getByLabelText(/category/i));
    await userEvent.click(screen.getByText("Mobile"));

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error!",
        "Failed to save product",
        "error"
      );
    });
  });

  it("successfully submits form with valid data", async () => {
    render(<AddForm {...defaultProps} />);

    await userEvent.type(screen.getByLabelText(/name/i), "Test Product");
    await userEvent.clear(screen.getByLabelText(/price/i));
    await userEvent.type(screen.getByLabelText(/price/i), "100");
    await userEvent.click(screen.getByLabelText(/category/i));
    await userEvent.click(screen.getByText("Mobile"));

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Product",
          price: 100,
          category: "Mobile",
          date: expect.any(String),
        })
      );
    });
  });
  it("closes form and shows success message after successful submit", async () => {
    render(<AddForm {...defaultProps} productToEdit={null} />);

    await userEvent.type(screen.getByLabelText(/name/i), "Test Product");
    await userEvent.clear(screen.getByLabelText(/price/i));
    await userEvent.type(screen.getByLabelText(/price/i), "100");
    await userEvent.click(screen.getByLabelText(/category/i));
    await userEvent.click(screen.getByText("Mobile"));

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Success!",
        "Product added successfully!",
        "success"
      );
    });
  });

  it("loads product data when editing", () => {
    const productToEdit = {
      id: "1",
      name: "Test Product",
      price: 100,
      category: "Mobile",
      date: "2023-01-01",
    };

    render(<AddForm {...defaultProps} productToEdit={productToEdit} />);

    // Check name and price fields
    expect(screen.getByLabelText(/name/i)).toHaveValue("Test Product");
    expect(screen.getByLabelText(/price/i)).toHaveValue(100);

    // Find the dropdown trigger (it’s a button or div with text “Mobile”)
    const dropdown = screen.getByText("Mobile");
    expect(dropdown).toBeInTheDocument();
  });

  it("shows edit mode text when editing product", () => {
    const productToEdit = {
      id: "1",
      name: "Test Product",
      price: 100,
      category: "Mobile",
      date: "2023-01-01",
    };

    render(<AddForm {...defaultProps} productToEdit={productToEdit} />);
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
  });

  it("preserves date when editing product", async () => {
    const productToEdit = {
      id: "1",
      name: "Test Product",
      price: 100,
      category: "Mobile",
      date: "2023-01-01",
    };

    render(<AddForm {...defaultProps} productToEdit={productToEdit} />);

    await userEvent.clear(screen.getByLabelText(/name/i));
    await userEvent.type(screen.getByLabelText(/name/i), "Updated Product");

    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Updated Product",
          date: "2023-01-01",
        })
      );
    });
  });

  it("disables form when loading", () => {
    render(<AddForm {...defaultProps} loading={true} />);

    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/price/i)).toBeDisabled();

    // Check the category dropdown via test ID
    // expect(screen.getByTestId("category-select")).toBeDisabled();

    // Check the button for processing
    expect(
      screen.getByRole("button", { name: "Processing..." })
    ).toBeDisabled();
  });
});
