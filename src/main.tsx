import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n"; // Initialize i18n
import "./index.css";
import "./style.css";

ReactDOM.createRoot(document.getElementById("app")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
