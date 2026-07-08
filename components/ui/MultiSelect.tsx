"use client";

import React from "react";
import { Check } from "lucide-react";
import styles from "./MultiSelect.module.css";

interface MultiSelectProps {
  options: { id: string; name: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label?: string;
  columns?: 1 | 2 | 3;
}

export default function MultiSelect({ options, selectedValues, onChange, label, columns = 2 }: MultiSelectProps) {
  
  const toggleSelection = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(v => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.id);
          return (
            <div 
              key={opt.id} 
              className={`${styles.optionCard} ${isSelected ? styles.selected : ""}`}
              onClick={() => toggleSelection(opt.id)}
            >
              <div className={`${styles.checkbox} ${isSelected ? styles.checked : ""}`}>
                {isSelected && <Check size={14} className={styles.checkIcon} />}
              </div>
              <span className={styles.optionName}>{opt.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
