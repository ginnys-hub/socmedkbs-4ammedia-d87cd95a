import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sparkles,
  Home,
  BarChart3,
  MessageSquareText,
  FileText,
  BookOpen,
  Languages,
  FolderTree,
  BookMarked,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const directLinks = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/scorecards", label: "Scorecards", icon: BarChart3 },
];

const macroLinks = [
  { to: "/macros", label: "Macros", icon: MessageSquareText },
  { to: "/zendesk-macros", label: "Zendesk Macros", icon: FolderTree },
];

const resourceLinks = [
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/handbook", label: "Handbook", icon: BookMarked },
  { to: "/translator", label: "Translator", icon: Languages },
];

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(circle_at_top_left,hsl(var(--secondary)/0.45),transparent_34rem)]">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 shadow-soft backdrop-blur-xl">
        <div className="container flex min-h-20 flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <NavLink
            to="/"
            className="group flex min-w-0 items-center gap-3 font-bold hover-scale"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg leading-tight tracking-tight text-foreground">
                4AM CSR Desk
              </span>
              <span className="block truncate text-xs font-extrabold uppercase tracking-[0.22em] text-primary">
                Social Media Knowledge Base
              </span>
            </span>
          </NavLink>
          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/80 bg-card/85 p-1.5 shadow-soft"
          >
            {directLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all sm:px-4",
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

            <NavDropdown
              label="Macros"
              icon={MessageSquareText}
              links={macroLinks}
              activePath={location.pathname}
            />
            <NavDropdown
              label="Resources"
              icon={BookOpen}
              links={resourceLinks}
              activePath={location.pathname}
            />

            <a
              href="https://forms.gle/9fUouXo2xURBrSWc6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:px-4"
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
        Made for the 4AM Media Social Media Team
      </footer>
    </div>
  );
};

type NavDropdownLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const NavDropdown = ({
  label,
  icon: Icon,
  links,
  activePath,
}: {
  label: string;
  icon: LucideIcon;
  links: NavDropdownLink[];
  activePath: string;
}) => {
  const isActive = links.some((link) => activePath === link.to);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4",
          isActive
            ? "bg-primary text-primary-foreground shadow-soft"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52 rounded-2xl p-2">
        {links.map(({ to, label: itemLabel, icon: ItemIcon }) => (
          <DropdownMenuItem key={to} asChild className="rounded-xl p-0">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <ItemIcon className="h-4 w-4" />
              <span>{itemLabel}</span>
            </NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Layout;
