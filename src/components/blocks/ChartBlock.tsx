import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Plus, Trash2 } from "lucide-react";
import type {
  ChartBlock as ChartBlockType,
  ChartDataPoint,
  ChartType,
} from "~/types/block";

interface ChartBlockProps {
  block: ChartBlockType;
  onChange: (updates: Partial<ChartBlockType>) => void;
}

const DEFAULT_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#a78bfa"];

export function ChartBlock({ block, onChange }: ChartBlockProps) {
  const [isEditingData, setIsEditingData] = React.useState(false);

  const addDataPoint = () => {
    const newPoint: ChartDataPoint = {
      label: `Item ${block.data.length + 1}`,
      value: 0,
    };
    onChange({ data: [...block.data, newPoint] });
  };

  const updateDataPoint = (index: number, updates: Partial<ChartDataPoint>) => {
    onChange({
      data: block.data.map((point, i) =>
        i === index ? { ...point, ...updates } : point
      ),
    });
  };

  const deleteDataPoint = (index: number) => {
    onChange({ data: block.data.filter((_, i) => i !== index) });
  };

  const renderChart = () => {
    if (block.data.length === 0) {
      return (
        <div
          className="h-64 flex items-center justify-center border-2 border-dashed rounded"
          style={{ borderColor: "var(--color-linear-border-primary)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-linear-text-tertiary)" }}
          >
            Add data to see the chart
          </p>
        </div>
      );
    }

    const commonProps = {
      data: block.data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (block.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill={block.colors?.[0] || DEFAULT_COLORS[0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={block.colors?.[0] || DEFAULT_COLORS[0]}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                fill={block.colors?.[0] || DEFAULT_COLORS[0]}
                stroke={block.colors?.[0] || DEFAULT_COLORS[0]}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={block.data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {block.data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={block.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" />
              <PolarRadiusAxis />
              <Radar
                dataKey="value"
                stroke={block.colors?.[0] || DEFAULT_COLORS[0]}
                fill={block.colors?.[0] || DEFAULT_COLORS[0]}
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={block.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Chart title"
            className="w-full text-sm font-semibold border-none outline-none bg-transparent"
            style={{ color: "var(--color-linear-text-primary)" }}
          />
          <div className="block-label">Chart</div>
        </div>
        <div
          className="flex gap-1 rounded-full p-1"
          style={{ background: "var(--color-linear-bg-tertiary)" }}
        >
          {(["bar", "line", "area", "pie", "radar"] as ChartType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => onChange({ chartType: type })}
                className="text-xs px-3 py-1 rounded-full capitalize"
                style={{
                  background:
                    block.chartType === type
                      ? "var(--color-linear-bg-elevated)"
                      : "transparent",
                  color: "var(--color-linear-text-secondary)",
                  boxShadow:
                    block.chartType === type
                      ? "var(--shadow-linear-sm)"
                      : "none",
                }}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="py-2">{renderChart()}</div>

      {/* Data Editor */}
      <div className="space-y-2">
        <button
          onClick={() => setIsEditingData(!isEditingData)}
          className="text-xs px-3 py-1 rounded-full"
          style={{
            background: "var(--color-linear-bg-secondary)",
            color: "var(--color-linear-text-secondary)",
          }}
        >
          {isEditingData ? "Hide data" : "Edit data"}
        </button>

        {isEditingData && (
          <div
            className="space-y-2 pt-2 rounded-xl border p-3"
            style={{
              background: "var(--color-linear-bg-secondary)",
              borderColor: "var(--color-linear-border-primary)",
            }}
          >
            {block.data.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={point.label}
                  onChange={(e) =>
                    updateDataPoint(index, { label: e.target.value })
                  }
                  placeholder="Label"
                  className="flex-1 px-2 py-1 text-sm border rounded-lg"
                  style={{ borderColor: "var(--color-linear-border-primary)" }}
                />
                <input
                  type="number"
                  value={point.value}
                  onChange={(e) =>
                    updateDataPoint(index, {
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Value"
                  className="w-24 px-2 py-1 text-sm border rounded-lg"
                  style={{ borderColor: "var(--color-linear-border-primary)" }}
                />
                <button
                  onClick={() => deleteDataPoint(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addDataPoint}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-linear-accent-primary)",
                color: "white",
              }}
            >
              <Plus className="w-3 h-3" />
              Add Data Point
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
