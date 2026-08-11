import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sparkles,
  Megaphone,
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
  { to: "/", label: "Home", icon: Megaphone, end: true },
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
            {directLinks.map(({ to, label, icon: Icon, end }) => (
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
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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