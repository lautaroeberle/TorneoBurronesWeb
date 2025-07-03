import { useLocation, useNavigate } from "react-router-dom";

interface NavLinkHeroProps {
  to: string;
  children: React.ReactNode;
}

export default function NavLinkHero({ to, children }: NavLinkHeroProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.getElementById(to);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(to);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} style={{ cursor: "pointer" }}>
      {children}
    </a>
  );
}
