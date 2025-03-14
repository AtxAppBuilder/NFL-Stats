import AIPoweredInsights from "../components/analytics/AIPoweredInsights";
import OverviewCards from "../components/analytics/OverviewCards";
import PlayerSegmentation from "../components/analytics/PlayerSegmentation";
import SalaryPieChart from "../components/analytics/SalaryPieChart";
import TopTenPlayers from "../components/analytics/TopTenPlayers";
import TopTenSalaries from "../components/analytics/TopTenSalaries";
import WeeklyAvg from "../components/analytics/WeeklyAvg";
import Header from "../components/common/Header";

const AnalyticsPage = () => {
	

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Player Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<TopTenPlayers />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					
					<SalaryPieChart />
					<TopTenSalaries />
					<WeeklyAvg />
					<PlayerSegmentation />
				</div>

				<AIPoweredInsights />
			</main>
		</div>
	);
};
export default AnalyticsPage;