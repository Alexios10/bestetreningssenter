import { Link, useLocation } from "react-router-dom";
import { Home, Info, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", text: "Hjem", Icon: Home },
    { to: "/about", text: "Om", Icon: Info },
    { to: "/contact", text: "Kontakt", Icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center sm:justify-end space-x-4">
          {links.map(({ to, text, Icon }) => (
            <TooltipProvider key={to}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={to}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out relative
                      ${
                        location.pathname === to
                          ? "text-indigo-600"
                          : "text-gray-500 hover:text-indigo-600"
                      }`}
                  >
                    <Icon
                      size={16}
                      className="transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                    <span className="hidden sm:inline">{text}</span>
                    {location.pathname === to && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 animate-fade-in" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="sm:hidden" side="top" align="center">
                  {text}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
