"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import styles from "./Autocomplete.module.css";

interface AutocompleteProps {
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function Autocomplete({ options, value, onChange, placeholder = "Search...", label }: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div 
        className={`${styles.inputWrapper} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(true)}
      >
        <div className={styles.selectedDisplay}>
          {selectedOption ? selectedOption.name : <span className={styles.placeholder}>{placeholder}</span>}
        </div>
        <div className={styles.icons}>
          {value && (
            <X 
              size={16} 
              className={styles.clearIcon} 
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearchTerm("");
              }} 
            />
          )}
          <ChevronDown size={20} className={styles.chevron} />
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  className={`${styles.option} ${value === opt.id ? styles.selected : ""}`}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt.name}
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
