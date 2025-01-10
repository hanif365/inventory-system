import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../../../src/components/Homepage/Homepage";
import { useSession } from "next-auth/react";
import '@testing-library/jest-dom';

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn()
}));

describe("HomePage Component", () => {
  it("should render homepage with unauthenticated state", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "unauthenticated",
    });

    render(<HomePage />);

    // Check for main elements
    expect(screen.getByText("Inventory Management System")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your inventory with ease and efficiency.")
    ).toBeInTheDocument();
    
    // Check for background image
    const bgImage = screen.getByAltText("Background");
    expect(bgImage).toBeInTheDocument();
    expect(bgImage).toHaveAttribute("src", "/_next/image?url=%2Finventory-bg.png&w=3840&q=100");

    // Check if Get Started button links to login
    const getStartedLink = screen.getByRole("link");
    expect(getStartedLink).toHaveAttribute("href", "/login");
  });

  it("should render homepage with authenticated state", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
    });

    render(<HomePage />);

    // Check if Get Started button links to dashboard when authenticated
    const getStartedLink = screen.getByRole("link");
    expect(getStartedLink).toHaveAttribute("href", "/inventory/dashboard");
  });

  it("should render loading state", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "loading",
    });

    render(<HomePage />);

    // Basic checks for main content while loading
    expect(screen.getByText("Inventory Management System")).toBeInTheDocument();
  });
});