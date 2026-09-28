import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#15803d', '#ca8a04', '#b45309', '#0f766e', '#65a30d', '#9a3412', '#4d7c0f', '#a16207'];

/** data: [{crop, percentage, landArea, farmerCount}] ; type: 'pie' | 'bar' */
export default function AreaChart({ data, type = 'pie', dataKey = 'percentage', unit = '%' }) {
  if (!data?.length) return <p className="text-stone-500 text-sm">No crop data reported yet.</p>;
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        {type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="percentage" nameKey="crop" outerRadius="70%" label={(e) => `${e.crop} ${e.percentage}%`}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} /><Legend />
          </PieChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="crop" /><YAxis />
            <Tooltip formatter={(v) => `${v}${unit}`} />
            <Bar dataKey={dataKey} fill="#15803d" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
