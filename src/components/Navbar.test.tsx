import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";
import useStore from "../store/appStore";
import { useThemeContext } from "../theme/themeContext";

// Mock the required hooks and modules
jest.mock("../store/appStore");
jest.mock("../theme/themeContext");

describe("Navbar Component", () => {
  const mockToggleSidebar = jest.fn();
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    // Mock the store hook
    (useStore as unknown as jest.Mock).mockReturnValue({
      toggleSidebar: mockToggleSidebar,
    });

    // Mock the theme context hook
    (useThemeContext as jest.Mock).mockReturnValue({
      toggleTheme: mockToggleTheme,
      mode: "light",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("renders navbar with correct title", () => {
    render(<Navbar />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("calls toggleSidebar when sidebar button is clicked", () => {
    render(<Navbar />);
    const menuButton = screen.getByTestId("toggle sidebar");
    fireEvent.click(menuButton);
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test("calls toggleTheme when theme button is clicked", () => {
    render(<Navbar />);
    const themeButton = screen.getByTestId("toggle theme");
    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test("displays correct theme icon based on mode", () => {
    const { rerender } = render(<Navbar key="light" />);

    // Light mode
    expect(screen.getByTestId("theme-icon-light")).toBeInTheDocument();
    expect(screen.queryByTestId("theme-icon-dark")).not.toBeInTheDocument();

    // Change mock for dark mode
    (useThemeContext as jest.Mock).mockReturnValue({
      toggleTheme: mockToggleTheme,
      mode: "dark",
    });

    // Force re-mount
    rerender(<Navbar key="dark" />);

    // Dark mode
    expect(screen.getByTestId("theme-icon-dark")).toBeInTheDocument();
    expect(screen.queryByTestId("theme-icon-light")).not.toBeInTheDocument();
  });
});
