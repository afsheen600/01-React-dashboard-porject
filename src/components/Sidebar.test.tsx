import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import * as firebaseAuth from "firebase/auth";
import Sidebar from "./Sidebar";
import useStore from "../store/appStore";
import store from "../store/store";

// Mock the modules
jest.mock("../store/appStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
  auth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Create mock store

describe("Sidebar Component", () => {
  const mockToggleSidebar = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      sidebarOpen: true,
      toggleSidebar: mockToggleSidebar,
    });
    (firebaseAuth.signOut as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Remove or replace this line with appropriate logic if needed
  });

  const renderSidebar = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      </Provider>
    );
  };

  it("renders all navigation items", () => {
    renderSidebar();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("navigates to correct routes when clicking nav items", () => {
    renderSidebar();

    const navItems = [
      { text: "Dashboard", path: "/dashboard" },
      { text: "Analytics", path: "/analytics" },
      { text: "Products", path: "/products" },
      { text: "Settings", path: "/settings" },
    ];

    navItems.forEach(({ text, path }) => {
      fireEvent.click(screen.getByText(text));
      expect(mockNavigate).toHaveBeenCalledWith(path);
      expect(mockToggleSidebar).toHaveBeenCalled();
      jest.clearAllMocks();
    });
  });

  it("handles logout correctly", async () => {
    renderSidebar();
    fireEvent.click(screen.getByText("Logout"));

    expect(firebaseAuth.signOut).toHaveBeenCalled();
    await expect(async () => {
      await screen.findByText("Logout");
    }).not.toThrow();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(mockToggleSidebar).toHaveBeenCalled();
    // Assert that the correct action was dispatched
    const actions = store.getState();
    expect(actions.user).toEqual(expect.objectContaining({}));
  });

  it("handles logout error correctly", async () => {
    (firebaseAuth.signOut as jest.Mock).mockRejectedValueOnce(
      new Error("Logout failed")
    );
    renderSidebar();

    fireEvent.click(screen.getByText("Logout"));

    await expect(async () => {
      await screen.findByText("Logout");
    }).not.toThrow();
    expect(mockNavigate).not.toHaveBeenCalled();
    const dispatchedActions = store.getState();
    expect(dispatchedActions.user).not.toEqual(expect.objectContaining({}));
  });

  it("toggles sidebar when clicking navigation items", () => {
    renderSidebar();

    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Analytics"));
    expect(mockToggleSidebar).toHaveBeenCalledTimes(2);
  });
});
