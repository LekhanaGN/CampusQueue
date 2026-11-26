const { createSupabaseClient } = require("../config/supabase");

async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Login required"
            });
        }

        const supabase = createSupabaseClient(token);

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                error: "Invalid or expired session"
            });
        }

        const { data: profile, error: profileError } =
            await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single();

        if (profileError || !profile) {
            return res.status(403).json({
                error: "Profile not found"
            });
        }

        req.user = profile;
        req.supabase = supabase;

        next();
    } catch (error) {
        res.status(500).json({
            error: "Authentication failed"
        });
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        next();
    };
}

module.exports = { authenticate, authorize };