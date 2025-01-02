'use client';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import './globals.css';
import { PersistGate } from 'redux-persist/integration/react';

// Define the type for the props
interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body className="bg-primary text-gray-100 min-h-screen">
				<div className="flex flex-col h-full">
					<Provider store={store}>
						<PersistGate loading={null} persistor={persistor}>
							{children}
						</PersistGate>
					</Provider>
				</div>
			</body>
		</html>
	);
}
