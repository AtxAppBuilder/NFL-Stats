import { motion } from "framer-motion";

const PlayerProfile = ({ playerData, isLoading }) => {
	return (
	  <motion.div
		className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay: 0.3 }}
	  >
		<h2 className="text-lg font-medium mb-4 text-gray-100">Player Profile</h2>
		<div className="h-64">
		  {isLoading ? (
			<p className="text-gray-300">Loading profile...</p>
		  ) : playerData ? (
			<div className="grid grid-cols-2 gap-4 text-white">
			  {/* Column 1 */}
			  <div className="space-y-4">
				<div>
				  <h3 className="text-md font-semibold">Height</h3>
				  <p className="text-gray-300">{playerData.height || "N/A"}</p>
				</div>
				<div>
				  <h3 className="text-md font-semibold">Weight</h3>
				  <p className="text-gray-300">{playerData.weight || "N/A"}</p>
				</div>
				<div>
				  <h3 className="text-md font-semibold">Jersey Number</h3>
				  <p className="text-gray-300">{playerData.jersey_number || "N/A"}</p>
				</div>
			  </div>
			  {/* Column 2 */}
			  <div className="space-y-4">
				<div>
				  <h3 className="text-md font-semibold">College</h3>
				  <p className="text-gray-300">{playerData.college || "N/A"}</p>
				</div>
				<div>
				  <h3 className="text-md font-semibold">Age</h3>
				  <p className="text-gray-300">{playerData.age || "N/A"}</p>
				</div>
				<div>
				  <h3 className="text-md font-semibold">Position</h3>
				  <p className="text-gray-300">{playerData.position || "N/A"}</p>
				</div>
			  </div>
			</div>
		  ) : (
			<p className="text-gray-300">
			  No profile data available. Search for a player to display their profile.
			</p>
		  )}
		</div>
	  </motion.div>
	);
  };
  
  export default PlayerProfile;





























// const PlayerProfile = ({ playerData, isLoading }) => {
// 	return (
// 		<motion.div
// 			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
// 			initial={{ opacity: 0, y: 20 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ delay: 0.2 }}
// 		>
// 		<h2 className="text-lg font-medium mb-4 text-gray-100">Player Profile</h2>
//       <div className="h-80 overflow-auto">
//         {isLoading ? (
//           <p className="text-gray-300">Loading player data...</p>
//         ) : playerData ? (
//           <div className="space-y-4 text-white">
//             <div>
//               <h3 className="text-lg font-semibold">Name</h3>
//               <p className="text-gray-300">
//                 {playerData.first_name} {playerData.last_name}
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Position</h3>
//               <p className="text-gray-300">
//                 {playerData.position} ({playerData.position_abbreviation})
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Age</h3>
//               <p className="text-gray-300">{playerData.age || "N/A"}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Height</h3>
//               <p className="text-gray-300">{playerData.height || "N/A"}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Weight</h3>
//               <p className="text-gray-300">{playerData.weight || "N/A"}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">College</h3>
//               <p className="text-gray-300">{playerData.college || "N/A"}</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Experience</h3>
//               <p className="text-gray-300">{playerData.experience || "N/A"}</p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-300">
//             No player data found. Search for a player to display their profile.
//           </p>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PlayerProfile;