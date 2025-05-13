import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  test("should render main content", () => {
    render(<App />);
    // This test will need to be adjusted based on what your App actually renders
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeVisible();
  });
});
