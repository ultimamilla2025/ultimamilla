"use client";

import { MoreVertical } from "lucide-react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 192, // 192px = w-48
      });
    }
  };

  const handleToggle = () => {
    updatePosition();
    setIsOpen(!isOpen);
  };

  const menuContent = (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed w-48 bg-gray-800 border border-white/10 rounded-xl shadow-2xl py-2 z-50"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {children}
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
          className="p-2 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-gray-200 relative z-50"
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
  const variants: Record<string, string> = {
    default: "text-gray-300 hover:bg-white/10",
    primary: "text-blue-300 hover:bg-blue-500/20",
    warning: "text-yellow-300 hover:bg-yellow-500/20",
    danger: "text-red-300 hover:bg-red-500/20",
  };
  return (
    <button
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      className={`w-full px-4 py-2.5 flex items-center gap-3 text-sm font-medium transition-all ${
        variants[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export function ActionMenuDivider() {
  return <div className="my-1 border-t border-white/10" />;
}

export function ActionMenuHeader({ label }: { label: string }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
      {label}
    </div>
  );
}
