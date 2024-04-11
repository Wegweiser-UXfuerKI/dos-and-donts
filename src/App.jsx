import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import NavBar from "./components/NavBar";
import InteractiveElement from "./InteractiveElement.jsx";
import InformationText from "./InformationText.jsx";
import { TaskDataProvider } from "./Context.jsx";

/* 
  The main component representing the learning element. Uses routing from react-router-dom for the different subpages.

  Provides the state independent of the current subpage, so that returning to the learning element
  after seeing the info text restores the state for a better user experience.

  @author Tino Breier 
*/
function App() {

	return (
		<div className='base-background flex flex-col'>
			<TaskDataProvider>
				<HashRouter>
					<NavBar />
					<Routes>
						<Route path='/' element={<Navigate to='/interaktiv' replace />} />
						<Route index path='/interaktiv' element={<InteractiveElement />} />
						<Route path='/text' element={<InformationText />} />
					</Routes>
				</HashRouter>
			</TaskDataProvider>
		</div>
	);
}

export default App;
