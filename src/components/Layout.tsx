import { NavLink, Outlet } from "react-router-dom";
import { Sparkles, Megaphone, BarChart3, MessageSquareText, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: Megaphone, end: true },
  { to: "/scorecards", label: "Scorecards", icon: BarChart3 },
  { to: "/macros", label: "Macros", icon: MessageSquareText },
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg hover-scale">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft animate-float">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <span>
              4AM <span className="text-primary">KBS</span>
            </span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
            <a
              href="https://forms.gle/9fUouXo2xURBrSWc6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">EOD Form Submission</span>
            </a>
          </nav>
        </div>
      </header>
      <main className="container py-8 animate-fade-in">
        <Outlet />
      </main>
      <footer className="container py-8 text-center text-sm text-muted-foreground">
        Made with 💛 for the 4AM Media Social Media Team
      </footer>
    </div>
  );
};

export default Layout;
