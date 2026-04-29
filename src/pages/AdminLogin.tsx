import { useState, FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Lock } from "lucide-react";

const AdminLogin = () => {
  const { user, isAdmin, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    let res = await signIn(email, password);

    // First-time admin: account doesn't exist yet — create it
    if (
      res.error &&
      /invalid login credentials/i.test(res.error) &&
      email.trim().toLowerCase() === "saranghaemerchonline@gmail.com"
    ) {
      const up = await signUp(email, password);
      if (up.error) {
        toast.error(up.error);
        setBusy(false);
        return;
      }
      res = await signIn(email, password);
    }

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Welcome back!");
      navigate("/admin");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-pop">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold">Admin Sign In</h1>
            <p className="text-sm text-muted-foreground">4AM Media KBS</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={busy} className="w-full rounded-full">
            <Lock className="mr-2 h-4 w-4" />
            {busy ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
