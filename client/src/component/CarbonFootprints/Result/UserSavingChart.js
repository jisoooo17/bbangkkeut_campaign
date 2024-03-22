import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

export default class CustomBarChart extends PureComponent {
  render() {
    const { barChartDataTotal } = this.props;

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="label">{`${label} : ${payload[0].value} kg`}</p>
          </div>
        );
      }

      return null;
    };

    // 커스텀 레이블 컴포넌트
    const CustomLabel = (props) => {
      const { x, y, width, value } = props;
      const textColor = value >= 0 ? "red" : "#0095ff";
      // 레이블 위치 조정 (막대의 오른쪽 끝 + 일정 간격)
      return (
        <text x={x + width / 2} y={y - 6} fill={textColor} textAnchor="start" dominantBaseline="middle">
          {value}kg
        </text>
      );
    };

    // console.log("??", barChartDataTotal);
    return (
      <ResponsiveContainer width="100%" height={barChartDataTotal.length * 11}>
        {barChartDataTotal.map((entry, index) => (
          <BarChart
            key={`bar-chart-${index}`}
            layout="vertical"
            width={500}
            height={30}
            data={[entry]}
            margin={{
              top: 0,
              right: 35,
              left: -80,
              bottom: 0,
            }}
          >
            <XAxis type="number" domain={[-entry.maxValaue, entry.maxValaue]} tickValues={[-entry.maxValaue, 0, entry.maxValaue]} hide />
            <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={false} />
            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Bar dataKey="value" barSize={30} fill={entry.color} radius={[0, 20, 20, 0]}>
              <Cell key={`cell-${index}`} fill={entry.color} />
              <LabelList dataKey="value" content={<CustomLabel />} />
            </Bar>
          </BarChart>
        ))}
      </ResponsiveContainer>
    );
  }
}
