"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number; // percentage, positive or negative
  trendLabel?: string;
  color?: string; // Hex color for the icon background
}

export default function KPICard({ title, value, icon, trend, trendLabel, color = "#3b82f6" }: KPICardProps) {
  // Determine trend UI
  let TrendIcon = Minus;
  let trendColor = "#94a3b8"; // neutral gray
  
  if (trend !== undefined) {
    if (trend > 0) {
      TrendIcon = TrendingUp;
      trendColor = "#16a34a"; // green
    } else if (trend < 0) {
      TrendIcon = TrendingDown;
      trendColor = "#dc2626"; // red
    }
  }

  return (
    <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="text-muted" style={{ fontSize: "0.875rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
            {title}
          </p>
          <h3 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0, color: "var(--foreground)" }}>
            {value}
          </h3>
        </div>
        <div style={{ 
          width: "48px", 
          height: "48px", 
          borderRadius: "12px", 
          background: `${color}15`, // 15% opacity background
          color: color,
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: trendColor, fontWeight: "bold" }}>
            <TrendIcon size={16} />
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-muted">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
