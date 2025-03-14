import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
	'#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384',
	'#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
	'#C9CB3F', '#FF6F61'
  ];

const SalaryPieChart = () => {
	const [graphData, setGraphData] = useState([]);
  	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					'http://localhost:5000/api/salary/highest-paid'
				);
				const { data } = await response.json();
				console.log('API Response Data:', data);
				const formattedData = data.map(player => ({
					name: player.position,
					value: Number(player.salary) // Convert string to number
				}))
				console.log('Formatted Graph Data:', formattedData);
				setGraphData(formattedData);
				setLoading(false);
			}catch(error) {
				console.log('Error fetching salary data:', error);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return (
		  <motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		  >
			<h2 className="text-xl font-semibold text-gray-100 mb-4">Player Salary Graph</h2>
			<div>Loading...</div>
		  </motion.div>
		);
	  }

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Player Salary Graph</h2>
			<div style={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={graphData}
							cx='50%'
							cy='50%'
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{graphData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalaryPieChart;