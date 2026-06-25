import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Password",
};

const ADMIN_PASSWORD = "NomanDeveloper2026@";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const adminPassword = req.headers.get("X-Admin-Password");
    if (adminPassword !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid admin credentials" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "get_settings";

    // GET: Retrieve app settings
    if (action === "get_settings") {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: Update app settings
    if (action === "update_settings" && req.method === "POST") {
      const body = await req.json();
      const allowedFields = [
        "payment_gateway_url",
        "gumroad_link",
        "easypaisa_details",
        "jazzcash_details",
        "bank_account_details",
        "openai_api_key",
        "gemini_api_key",
        "whatsapp_number",
        "contact_email",
      ];
      const update: Record<string, string> = {};
      for (const field of allowedFields) {
        if (body[field] !== undefined) update[field] = body[field];
      }
      update.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("app_settings")
        .update(update)
        .eq("id", 1)
        .select()
        .maybeSingle();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET: List all users with profiles
    if (action === "list_users") {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, user_id, full_name, is_premium, signup_date, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const emailMap = new Map();
      for (const u of authUsers.users || []) {
        emailMap.set(u.id, u.email);
      }
      const users = (data || []).map((p) => ({
        ...p,
        email: emailMap.get(p.user_id) || "unknown",
      }));

      return new Response(JSON.stringify(users), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: Toggle user premium status
    if (action === "toggle_premium" && req.method === "POST") {
      const { user_id, is_premium } = await req.json();
      const { error } = await supabase
        .from("user_profiles")
        .update({ is_premium })
        .eq("user_id", user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET: List contact messages
    if (action === "list_messages") {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE: Delete a contact message
    if (action === "delete_message" && req.method === "DELETE") {
      const { message_id } = await req.json();
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", message_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
