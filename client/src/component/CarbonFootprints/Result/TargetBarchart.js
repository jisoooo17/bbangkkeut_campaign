import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default class CustomBarChart extends PureComponent {
  render() {
    const { barChatData } = this.props;

    const maxLeft = Math.max(...barChatData.map((item) => item.user));
    const maxRight = Math.max(...barChatData.map((item) => item.average));
    const maxYAxis = Math.ceil(Math.max(maxLeft, maxRight) / 100) * 100;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={barChatData}
          barGap={"10%"}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false}/>
          <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={false} domain={[0, maxYAxis]} />
          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} domain={[0, maxYAxis]} />
          <Tooltip formatter={(value, name) =>[ name,`${value} kg`]} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="user"
            name={<span style={{ color: "black" }}>우리집</span>}
            fill={barChatData[0].color}
            barSize={50}
            label={{
              position: "top",
              formatter: (value) => `${value}kg`,
            }}
            radius={[25,25,0,0]}
          />
          <Bar
            yAxisId="right"
            dataKey="average"
            name={<span style={{ color: "black" }}>다른집</span>}
            fill={`rgba(${parseInt(barChatData[0].color.slice(1, 3), 16)}, ${parseInt(barChatData[0].color.slice(3, 5), 16)}, ${parseInt(barChatData[0].color.slice(5, 7), 16)}, 0.5)`}
            barSize={50}
            label={{ position: "top", formatter: (value) => `${value}kg` }}
            radius={[25,25,0,0]}
          />
          <Bar yAxisId="right" dataKey="target" name={<span style={{ color: "black" }}>목표</span>} fill="#F4DD7C" barSize={50} label={{ position: "top", formatter: (value) => `${value}kg` }} radius={[25,25,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
