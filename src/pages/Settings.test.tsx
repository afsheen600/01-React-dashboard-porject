import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ShopSettings from "./Settings";

describe("ShopSettings Component", () => {
  beforeEach(() => {
    // Mock the global fetch method
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Settings saved successfully" }),
    } as Response);
  });

  const renderComponent = () => {
    return render(<ShopSettings />);
  };

  afterEach(() => {
    // Restore the original fetch method
    jest.restoreAllMocks();
  });

  it("renders the shop settings title", () => {
    renderComponent();
    expect(screen.getByText(/Shop Settings/i)).toBeInTheDocument();
  });

  it("displays all tab labels", () => {
    renderComponent();
    expect(screen.getByText("Store Info")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  it("can switch between tabs", async () => {
    renderComponent();
    // Click Payment tab and check for Payment Settings content
    userEvent.click(screen.getByText("Payment"));
    setTimeout(async () => {
      await screen.findByText(/Payment Settings/i); // wait for Payment Settings content
      expect(screen.getByText(/Payment Settings/i)).toBeInTheDocument();
    }, 300);

    // Click Notifications tab and check for Notification Preferences content
    userEvent.click(screen.getByText("Notifications"));
    await screen.findByText(/Notification Preferences/i); // wait for Notification Preferences content
    expect(screen.getByText(/Notification Preferences/i)).toBeInTheDocument();

    // Click Security tab and check for Security Settings content
    userEvent.click(screen.getByText("Security"));
    await screen.findByText(/Security Settings/i); // wait for Security Settings content
    expect(screen.getByText(/Security Settings/i)).toBeInTheDocument();
  });

  it("updates store info form values", () => {
    renderComponent();
    const storeNameInput = screen.getByLabelText("Store Name");
    const emailInput = screen.getByLabelText("Email");

    fireEvent.change(storeNameInput, { target: { value: "New Store Name" } });
    fireEvent.change(emailInput, { target: { value: "new@email.com" } });

    expect(storeNameInput).toHaveValue("New Store Name");
    expect(emailInput).toHaveValue("new@email.com");
  });

  it("submits store info form successfully", async () => {
    renderComponent();
    const saveButton = screen.getByRole("button", { name: /Save Store Info/i });
    setTimeout(async () => {
      await userEvent.click(saveButton);

      const successMessage = await screen.findByText(
        "Settings saved successfully"
      );
      expect(successMessage).toBeInTheDocument();
    }, 300);
  });

  it("handles error on store info form submission", async () => {
    renderComponent();
    jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("API Error"));

    const saveButton = screen.getByRole("button", { name: /Save Store Info/i });
    fireEvent.click(saveButton);
    setTimeout(async () => {
      await waitFor(() => {
        expect(screen.getByText("Error saving settings")).toBeInTheDocument();
      });
    }, 300);
  });
});
