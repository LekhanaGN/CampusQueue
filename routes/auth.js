const express = require("express");
const router = express.Router();

const { createSupabaseClient } = require("../config/supabase");
const { authenticate } = require("../middleware/auth");

// Registration
router.post("/register", async (req, res) => {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name }
        }
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json({
        message: data.session
            ? "Registration successful"
            : "Check your email to confirm registration"
    });
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    const supabase = createSupabaseClient();

    const { data, error } =
        await supabase.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        return res.status(401).json({
            error: error.message
        });
    }

    const userClient = createSupabaseClient(
        data.session.access_token
    );

    const { data: profile, error: profileError } =
        await userClient
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

    if (profileError || !profile) {
        return res.status(403).json({
            error: "User profile not found"
        });
    }

    res.json({
        message: "Login successful",
        token: data.session.access_token,
        user: profile
    });
});

// Get current user
router.get("/me", authenticate, (req, res) => {
    res.json(req.user);
});

// Logout
router.post("/logout", authenticate, async (req, res) => {
    const { error } = await req.supabase.auth.signOut({
        scope: "local"
    });

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.json({
        message: "Logged out successfully"
    });
});

module.exports = router;