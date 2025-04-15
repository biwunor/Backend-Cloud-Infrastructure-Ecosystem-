import React, { useState, useRef, useEffect } from 'react';

export const Select = ({ children, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { isOpen, onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, { 
            onSelect: handleSelect,
            selectedValue: selectedValue,
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = ({ children, className, onClick, isOpen, 'aria-label': ariaLabel, id }) => {
  return (
    <button
      type="button"
      id={id}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex justify-between items-center w-full p-3 border border-gray-300 rounded-md ${className || ''} ${isOpen ? 'border-green-800' : ''}`}
    >
      {children}
      <svg 
        className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export const SelectValue = ({ placeholder, children }) => {
  return <div>{children || placeholder}</div>;
};

export const SelectContent = ({ children, className, onSelect, selectedValue }) => {
  return (
    <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg ${className || ''}`}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectGroup) {
          return React.cloneElement(child, { onSelect, selectedValue });
        }
        return child;
      })}
    </div>
  );
};

export const SelectGroup = ({ children, onSelect, selectedValue }) => {
  return (
    <div className="p-2">
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, { 
            onSelect, 
            isSelected: child.props.value === selectedValue 
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectLabel = ({ children, className }) => {
  return <div className={`px-2 py-1 text-sm font-medium text-gray-600 ${className || ''}`}>{children}</div>;
};

export const SelectItem = ({ children, value, className, onSelect, isSelected }) => {
  return (
    <div
      className={`px-2 py-2 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-100' : ''} ${className || ''}`}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};