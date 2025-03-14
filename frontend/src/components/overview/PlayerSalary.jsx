import { motion } from "framer-motion";

const PlayerSalary = ({ salaryData }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Player Salary</h2>
      <div className="h-64 overflow-auto">
        {salaryData ? (
          <div className="grid grid-cols-2 gap-4 text-white">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-semibold">Total Contract Value</h3>
                <p className="text-gray-300">
                {salaryData.total_value
                    ? `$${Number(salaryData.total_value).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-md font-semibold">total_guaranteed</h3>
                <p className="text-gray-300">
                {salaryData.total_guaranteed
                    ? `$${Number(salaryData.total_guaranteed).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-md font-semibold">Annual Salary (APY)</h3>
                <p className="text-gray-300">
                {salaryData.apy ? `$${Number(salaryData.apy).toLocaleString()}` : "N/A"}
                </p>
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-semibold">AVG Guarantee Per Year</h3>
                <p className="text-gray-300">
                {salaryData.avg_guarantee_per_year
                    ? `$${Number(salaryData.avg_guarantee_per_year).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-md font-semibold">% Guaranteed</h3>
                <p className="text-gray-300">
                {salaryData.percent_guaranteed
                    ? `${Number(salaryData.percent_guaranteed)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">
            No salary data available. Search for a player to display their salary details.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerSalary;



























// import { motion } from "framer-motion";

// const PlayerSalary = () => {

//   return (
//     <motion.div
//       className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.4 }}
//     >
//       <h2 className="text-lg font-medium mb-4 text-gray-100">Player Salary Data</h2>
//       <div className="h-64">
//         Player Salary
//       </div>
//     </motion.div>
//   );
// };

// export default PlayerSalary;