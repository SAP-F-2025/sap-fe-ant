import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { SettingsModal, type SettingsSection } from './SettingsModal';

interface SettingsModalContextType {
	isOpen: boolean;
	openSettings: (section?: SettingsSection) => void;
	closeSettings: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextType | undefined>(undefined);

interface SettingsModalProviderProps {
	children: ReactNode;
}

/**
 * Provider component for settings modal
 * Wrap your app with this to enable the useSettingsModal hook
 */
export const SettingsModalProvider: React.FC<SettingsModalProviderProps> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [defaultSection, setDefaultSection] = useState<SettingsSection>('my-account');

	const openSettings = useCallback((section: SettingsSection = 'my-account') => {
		setDefaultSection(section);
		setIsOpen(true);
	}, []);

	const closeSettings = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<SettingsModalContext.Provider value={{ isOpen, openSettings, closeSettings }}>
			{children}
			<SettingsModal
				open={isOpen}
				onClose={closeSettings}
				defaultSection={defaultSection}
			/>
		</SettingsModalContext.Provider>
	);
};

/**
 * Hook to control the settings modal from anywhere in the app
 * 
 * Usage:
 * const { openSettings, closeSettings } = useSettingsModal();
 * openSettings(); // Opens to default section
 * openSettings('notifications'); // Opens to specific section
 */
export const useSettingsModal = (): SettingsModalContextType => {
	const context = useContext(SettingsModalContext);
	if (!context) {
		throw new Error('useSettingsModal must be used within a SettingsModalProvider');
	}
	return context;
};
