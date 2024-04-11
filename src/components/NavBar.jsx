import { NavLink, useLocation } from "react-router-dom";

// Assets
import logo from "../assets/logo-wegweiser.svg";
import "./NavBar.css";

/*
  The nav bar showing the title and logo of the page on the left and two different nav links on the right.
  For switching between the info text and the learn element.
*/
function NavBar() {

  // Current subpage on which the user is located
	const location = useLocation();

	return (
		<header className='nav-bar flex justify-between px-4 items-center'>
			<a className='home flex items-center' href='#'>
				<img className='logo' src={logo} alt='Logo UX-für-KI' />
				<span id='website-title' className='text-center hidden md:block'>
					Plattform zur Evaluation
				</span>
			</a>
			<span id='nav-button-container'>
				<NavLink id='text-link' className={`nav-button mx-2 ${location.pathname === "/text" ? "active-link" : ""}`} to='/text'>
					<span>Informationstext</span>
				</NavLink>
				<NavLink id='app-link' className={`nav-button mx-2 ${location.pathname === "/interaktiv" ? "active-link" : ""}`} to='/interaktiv'>
					<span>Lernanwendung</span>
				</NavLink>
			</span>
		</header>
	);
}

export default NavBar;
