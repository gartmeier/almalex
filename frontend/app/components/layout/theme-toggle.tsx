import { Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/contexts/theme";

export function ThemeToggle() {
  let { resolved, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
    >
      {resolved === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
