"use client";

import { MoreVertical } from "lucide-react";
import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";

interface ActionMenuContextType {
  closeMenu: () => void;
}

const ActionMenuContext = createContext<ActionMenuContextType | null>(null);

interface ActionMenuProps {
  children: ReactNode;
  className?: string;
}

export default function ActionMenu({
  children,
  className = "",
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Actualizar posición cuando el menú se monta
  useEffect(() => {
    if (isOpen && menuRef.current && !isAnimating) {
      updatePosition();
    }
  }, [isOpen, isAnimating]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        animateOut();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updatePosition = () => {
    if (buttonRef.current && menuRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current.offsetHeight || 300; // Usar altura real o estimada
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;

      // Determinar si abrir hacia arriba o hacia abajo
      const openUpwards = spaceBelow < menuHeight + 16; // 16px de margen

      setPosition({
        top: openUpwards ? rect.top - menuHeight - 8 : rect.bottom + 8,
        left: rect.right - 192, // 192px = w-48
      });
    }
  };

  const animateOut = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setShouldRender(false);
    }, 200); // Duración de la animación
  };

  const handleToggle = () => {
    if (!isOpen) {
      // Calcular posición ANTES de renderizar
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const estimatedHeight = 300;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const openUpwards = spaceBelow < estimatedHeight + 16;

        setPosition({
          top: openUpwards ? rect.top - estimatedHeight - 8 : rect.bottom + 8,
          left: rect.right - 192,
        });
      }

      setShouldRender(true);
      setIsOpen(true);
      // Actualizar posición con altura real después
      setTimeout(() => {
        updatePosition();
        setIsAnimating(true);
      }, 10);
    } else {
      animateOut();
    }
  };

  const menuContent = (
    <>
      {shouldRender && (
        <div
          ref={backdropRef}
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 transition-opacity duration-200"
          style={{ opacity: isAnimating ? 1 : 0 }}
          onClick={animateOut}
        />
      )}
      {shouldRender && (
        <div
          ref={menuRef}
          className="fixed w-48 bg-[var(--elevated)] border border-[var(--borders)] rounded-xl shadow-2xl py-2 z-50"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(-8px)",
            transition:
              "opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ActionMenuContext.Provider value={{ closeMenu: animateOut }}>
            {children}
          </ActionMenuContext.Provider>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className="p-2 rounded-lg hover:cursor-pointer hover:bg-[var(--surface)] transition-all text-[var(--textmuted)] hover:text-[var(--text)] relative z-50"
        >
          <MoreVertical size={20} />
        </button>
      </div>
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}

interface ActionMenuItemProps {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "warning" | "danger";
  disabled?: boolean;
}

export function ActionMenuItem({
  icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}: ActionMenuItemProps) {
  const context = useContext(ActionMenuContext);

  const handleClick = () => {
    if (!disabled) {
      onClick();
      context?.closeMenu();
    }
  };

  const variants: Record<string, string> = {
    default: "text-[var(--text)] hover:bg-[var(--surface)]",
    primary: "text-[var(--primary)] hover:bg-[var(--primary)]/10",
    warning: "text-[var(--warning)] hover:bg-[var(--warning)]/10",
    danger: "text-[var(--error)] hover:bg-[var(--error)]/10",
  };
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm font-medium transition-all ${
        variants[variant]
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed hover:cursor-not-allowed"
          : "hover:cursor-pointer"
      }`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export function ActionMenuDivider() {
  return <div className="my-1 border-t border-[var(--borders)]" />;
}

export function ActionMenuHeader({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-[var(--textmuted)] uppercase">
      {label}
    </div>
  );
}
