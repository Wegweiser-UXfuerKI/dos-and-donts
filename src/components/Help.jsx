import { useRef, useEffect } from "react";

import expandIcon from "../assets/expand-icon.png";
import "./Help.css";

/*
  The help button that provides more information about how to use the system and 
  which keyboard shortcuts are available.
*/
function Help() {

	const helpContentRef = useRef(null);
	useEffect(() => {
		if (helpContentRef.current) {
      // Set up the tippy-modal when the page loaded
			tippy(".help", {
				content: helpContentRef.current.innerHTML,
				arrow: true,
				maxWidth: 400,
				allowHTML: true,
				trigger: "click",
				animation: "shift-away",
			});
		}
	}, []);

	return (
		<>
			<div id='help-wrapper' ref={helpContentRef} style={{ display: "none" }}>
				<div id='help-content' className='flex flex-col gap-y-4 m-3'>
					<h3 id='help-heading'>Hilfe zur Nutzung</h3>
					<p style={{ wordBreak: "break-word", hyphens: "auto", language: "de" }}>
						Wähle diejenige App aus, die der präsentierten Richtlinie folgt. Es wird empfohlen, sich zuvor mit dem referenzierten Artikel
						auseinanderzusetzen. Dieser wird dir inhaltlich weiterhelfen. Wenn du nicht weiter weißt, kannst du den Tipp unten rechts benutzen.
					</p>
					<p>Du kannst folgende Tastatur-Shortcuts benutzen: </p>
					<div><code>1</code> App 1 auswählen</div>
					<div><code>2</code> App 2 auswählen</div>
					<div><code>R</code> Auswahl einloggen und prüfen</div>
					<hr />
					<div><code>T</code> Tipp einblenden</div>
					<div><code>Z</code> Richtige Antwort auflösen</div>
					<hr />
					<div><code>←</code> Zurück zur Aufgabenstellung
					</div>
					<div><code>→</code> Weiter zur nächsten Aufgabe
					</div>
					<hr />
					<div><code>↓</code><code>↑</code> Zwischen Aufgaben navigieren</div>
				</div>
			</div>
			<button id='help-button' className='help flex justify-center items-center gap-x-1' aria-label='Hilfe-Button'>
				<h2>Hilfe</h2>
				<img id='expand-arrow' src={expandIcon} className='w-[24px]' aria-label='Ausklappbar' />
			</button>
		</>
	);
}

export default Help;
