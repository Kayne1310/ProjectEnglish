

import Header from "../componentsss/common/Header";
import OverviewCards from "../componentsss/analytics/OverviewCards";
import RevenueChart from "../componentsss/analytics/RevenueChart";
import ChannelPerformance from "../componentsss/analytics/ChannelPerformance";
import ProductPerformance from "../componentsss/analytics/ProductPerformance";
import UserRetention from "../componentsss/analytics/UserRetention";
import CustomerSegmentation from "../componentsss/analytics/CustomerSegmentation";
import AIPoweredInsights from "../componentsss/analytics/AIPoweredInsights";



const AnalyticsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Analytics Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OverviewCards />
				<RevenueChart />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ChannelPerformance />
					<ProductPerformance />
					<UserRetention />
					<CustomerSegmentation />
				</div>

				<AIPoweredInsights />
			</main>
		</div>
	);
};
export default AnalyticsPage;
