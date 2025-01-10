import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../../../../src/components/LoginRegistration/login/LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (signIn as jest.Mock).mockReset();
  });

  it("renders login form with all fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });
});
