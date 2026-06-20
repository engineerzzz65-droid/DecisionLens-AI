import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  data: Array<{
    category: string;
    [key: string]: any;
  }>;
  scenarios: string[];
  colors?: string[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  scenarios,
  colors = ['#0ea5e9', '#10b981', '#f59e0b']
}) => {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#6b7280' }} />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={{ fill: '#6b7280' }}
            tickCount={5}
          />
          {scenarios.map((scenario, index) => (
            <Radar
              key={scenario}
              name={scenario}
              dataKey={scenario}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.2}
            />
          ))}
          <Legend />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
};