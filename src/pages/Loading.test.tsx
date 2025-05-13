import { render, screen } from "@testing-library/react";
import Loading from "./Loading";
import "@testing-library/jest-dom";

describe("Loading Component", () => {
  it("should render the Box component with correct styles", () => {
    render(<Loading />);

    let boxElement;
    try {
      // Try the preferred method first
      boxElement = screen.getByTestId("loading-box");
    } catch (e) {
      try {
        // Fallback to alternative method
        boxElement = screen.getByRole("progressbar").parentElement;
      } catch (e) {
        // Final fallback
        boxElement = screen.getByRole("presentation");
      }
    }

    expect(boxElement).toBeInTheDocument();
    expect(boxElement).toHaveStyle({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    });
  });
});

it("should render the CircularProgress component", () => {
  render(<Loading />);
  const progressElement = screen.getByRole("progressbar");
  expect(progressElement).toBeInTheDocument();
});

it("should render without crashing", () => {
  const { container } = render(<Loading />);
  expect(container).toBeTruthy();
});
