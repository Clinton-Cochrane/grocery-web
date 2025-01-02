'use client';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import './globals.css';
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/navigation';
import { FaHome, FaShoppingCart } from 'react-icons/fa';

// Define the type for the props
interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	const router = useRouter();
	return (
		<html lang="en">
			<head>
				<title>Recipe App</title>
				<meta name="description" content="A simple recipe app with shopping cart functionality" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>

			<body className="bg-primary text-gray-100 min-h-screen">
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<header className="flex justify-between items-center p-4 bg-gray-800 text-white">
							<button onClick={() => router.push('/')} className="text-xl">
								<FaHome />
							</button>
							<h1 className="text-xl">Recipe App</h1>
							<button onClick={() => router.push('/shoppingCart')} className="text-xl">
								<FaShoppingCart />
							</button>
						</header>

						<div className="flex flex-col h-full">{children}</div>
					</PersistGate>
				</Provider>
			</body>
		</html>
	);
}
