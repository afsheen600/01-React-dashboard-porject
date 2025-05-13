import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";

// Mock API with proper TypeScript typing
jest.mock("../services/api", () => ({
  fetchDashboardData: jest.fn(() =>
    Promise.resolve({
      stats: { totalUsers: 0, activeUsers: 0 },
      chart: { data: [] },
    })
  ),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Dashboard />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Dashboard />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("displays loading state initially", () => {
    render(<Dashboard />);
    expect(screen.getByRole("status")).toBeInTheDocument(); // Better than testId
  });

  it("handles error states", async () => {
    require("../services/api").fetchDashboardData.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<Dashboard />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("displays dashboard data after loading", async () => {
    const mockData = {
      stats: { totalUsers: 100, activeUsers: 80 },
      chart: { data: [10, 20, 30] },
    };

    require("../services/api").fetchDashboardData.mockResolvedValue(mockData);

    render(<Dashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Verify data is displayed
    expect(screen.getByText(/100 users/i)).toBeInTheDocument();
    expect(screen.getByText(/80 active/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
  });

  describe("Interactive Features", () => {
    it("opens filter dialog", async () => {
      render(<Dashboard />);

      // Wait for initial load
      await screen.findByText(/users/i);

      const filterButton = screen.getByRole("button", { name: /filter/i });
      await userEvent.click(filterButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("handles date range selection", async () => {
      render(<Dashboard />);

      // Wait for initial load
      await screen.findByText(/users/i);

      const dateInput = screen.getByLabelText(/date range/i);
      await userEvent.click(dateInput);

      // Assuming you're using a date picker library
      const todayButton = screen.getByRole("button", { name: /today/i });
      await userEvent.click(todayButton);

      expect(dateInput).toHaveValue(expect.any(String));
    });
  });

  describe("Navigation", () => {
    it("switches between tabs", async () => {
      render(<Dashboard />);

      const analyticsTab = screen.getByRole("tab", { name: /analytics/i });
      await userEvent.click(analyticsTab);

      expect(screen.getByText(/analytics dashboard/i)).toBeInTheDocument();
      expect(analyticsTab).toHaveAttribute("aria-selected", "true");
    });
  });
});
