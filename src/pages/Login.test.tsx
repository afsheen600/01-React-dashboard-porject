import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import configureStore from "../store/store";
import { configureStore } from "@reduxjs/toolkit";

import Login from "./Login";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    isAuthenticated: false,
    currentUser: null,
    loading: false,
    error: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState.user,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const mockStore = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn((selector) => selector(mockStore.getState())),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest
    .fn()
    .mockImplementation((auth, email, password) => {
      return new Promise((resolve, reject) => {
        if (email === "test@example.com" && password === "password123") {
          resolve({ user: { email } });
        } else if (!email || !password) {
          reject(new Error("Fields cannot be empty"));
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          reject(new Error("Invalid email address"));
        } else {
          reject(new Error("Login failed"));
        }
      });
    }),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return () => {};
  }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  const renderLogin = () => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  it("should render the login form correctly", () => {
    renderLogin();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i })
    ).toBeInTheDocument();
  });

  it("should show validation error if fields are empty", async () => {
    renderLogin();
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Fields cannot be empty/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for invalid email", async () => {
    renderLogin();

    await userEvent.type(
      screen.getByLabelText(/Email Address/i),
      "invalid-email"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it("should log in successfully with correct credentials", async () => {
    renderLogin();

    await userEvent.type(
      screen.getByLabelText(/Email Address/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "user/setUser",
          payload: expect.objectContaining({ email: "test@example.com" }),
        })
      );
    });
  });

  it("should disable button and show spinner while logging in", async () => {
    renderLogin();

    await userEvent.type(
      screen.getByLabelText(/Email Address/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(screen.getByRole("button", { name: /Sign In/i })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
