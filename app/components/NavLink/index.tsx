import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { ANIMATION_DURATION } from "~/constants";
import { isHiddenOverflow, isLoading } from "~/store/slices/loading";

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function NavLink({
  to,
  children,
  className,
  end,
  onClick,
}: Props) {
  const navigate = useNavigate(),
    location = useLocation(),
    dispatch = useDispatch(),
    isActive = end
      ? location.pathname === to
      : location.pathname.startsWith(to),
    computedClassName =
      typeof className === "function" ? className({ isActive }) : className,
    handleNavigation = (e: React.MouseEvent) => {
      if (isActive) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      e.preventDefault();
      dispatch(isLoading());
      dispatch(isHiddenOverflow());

      setTimeout(() => {
        onClick?.(e);
        navigate(to);
      }, ANIMATION_DURATION());
    };

  return (
    <a href={to} onClick={handleNavigation} className={computedClassName}>
      {children}
    </a>
  );
}
