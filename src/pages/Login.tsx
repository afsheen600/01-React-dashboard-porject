import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { auth } from "../../src/firebase-config";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return unsubscribe;
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) return "Please fill in all fields";
    if (!email.includes("@") || !email.includes("."))
      return "Invalid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { email, password } = formData;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userEmail = userCredential.user.email;

      dispatch(setUser({ email: userEmail }));
      localStorage.setItem("user", JSON.stringify({ email: userEmail }));

      navigate("/dashboard");
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/user-not-found": "No user found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/too-many-requests":
          "Account temporarily disabled due to many failed attempts",
        "auth/invalid-email": "Invalid email format",
      };
      setError(
        errorMessages[err.code] ||
          "Failed to login. Please check your credentials."
      );
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          backgroundColor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
