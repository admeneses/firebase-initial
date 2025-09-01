import { Stack } from 'expo-router';
import { FIAP_COLORS } from '../../config/colors';

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: FIAP_COLORS.PRIMARY_GREEN,
				},
				headerTintColor: FIAP_COLORS.TEXT_WHITE,
				headerTitleStyle: {
					fontWeight: 'bold',
				},
			}}
		>
			<Stack.Screen 
				name="home" 
				options={{ 
					title: 'Home',
					headerShown: false
				}} 
			/>
		</Stack>
	);
};

export default Layout;