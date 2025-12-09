import { useState, useEffect } from "react";

export const useIsDarkMode = () => {
	const [isDark, setIsDark] = useState(() =>
		document.body.classList.contains("dark-mode"),
	);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setIsDark(document.body.classList.contains("dark-mode"));
		});

		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	return isDark;
};
