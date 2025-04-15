import React, { useState, useEffect, useRef } from "react";

export const Sheet = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type === SheetTrigger) {
          return React.cloneElement(child, {
            onClick: () => handleOpenChange(true),
          });
        }
        if (child.type === SheetContent) {
          return isOpen
            ? React.cloneElement(child, {
                onClose: () => handleOpenChange(false),
              })
            : null;
        }
        return child;
      })}
    </div>
  );
};

export const SheetTrigger = ({ children, onClick, asChild }) => {
  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      onClick: (e) => {
        onClick && onClick(e);
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    });
  }

  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export const SheetContent = ({ children, onClose, side = "right", className }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const sideStyles = {
    right: "right-0 h-full",
    left: "left-0 h-full", 
    top: "top-0 w-full",
    bottom: "bottom-0 w-full",
  };

  const sideAnimations = {
    right: "animate-slide-in-from-right",
    left: "animate-slide-in-from-left",
    top: "animate-slide-in-from-top",
    bottom: "animate-slide-in-from-bottom",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        ref={contentRef}
        className={`fixed ${sideStyles[side]} max-w-sm z-50 p-4 shadow-lg ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export const SheetClose = ({ children, className, asChild }) => {
  const context = { onClose: null };

  if (asChild) {
    return React.cloneElement(React.Children.only(children), {
      onClick: (e) => {
        context.onClose && context.onClose();
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => context.onClose && context.onClose()}
    >
      {children}
    </button>
  );
};