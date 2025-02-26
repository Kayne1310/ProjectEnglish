

import Header from "../componentsss/common/Header";
import ConnectedAccounts from "../componentsss/settings/ConnectedAccounts";
import DangerZone from "../componentsss/settings/DangerZone";
import Notifications from "../componentsss/settings/Notifications";
import Profile from "../componentsss/settings/Profile";
import Security from "../componentsss/settings/Security";




const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Notifications />
				<Security />
				<ConnectedAccounts />
				<DangerZone />
			</main>
		</div>
	);
};
export default SettingsPage;
