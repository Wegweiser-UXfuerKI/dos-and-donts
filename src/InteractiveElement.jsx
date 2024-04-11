// Packages
import { React, useState, useRef, useEffect, useContext } from "react";
import tippy, { animateFill, hideAll } from "tippy.js";
import { Link } from "react-router-dom";

// Context and States
import { tasks } from "./content/tasks.js";
import { TaskDataContext } from "./Context.jsx";

// Components
import Help from "./components/Help";
import ProgressIndicator from "./components/ProgressIndicator";

// Styling
import "./InteractiveElement.css";
import "./InteractiveElement-Mobile.css";
import "./assets/scrollbar.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/backdrop.css";
import "tippy.js/animations/shift-away.css";

// Assets
import sparkleIcon from "./assets/sparkle-icon.svg";
import backIcon from "./assets/back-icon.png";
import quoteMark from "./assets/quote-mark.png";
import checkIcon from "./assets/check-icon.svg";
import crossIcon from "./assets/cross-icon.svg";
import ideaIcon from "./assets/idea-icon.svg";
import forwardIcon from "./assets/forward-icon.png";
import "./assets/kor_animations/kor-sparkles.js";

/* 
  Main component for the learning element, containting three main panes:

  Left pane: 
    Displays the task and infos about it.
  Mid pane: 
    Offers the two answer options and a check button to evaluate the user's given answer.
    When switching the view to EXPLAIN, exchange the check button with a do and the don't description.
  Right pane: 
    Give feedback regarding the logged in answer and display an explanatory text why the
    provided answer is correct or incorrect. Also provide buttons for navigating back and forth.

  Floating elements that are also placed on there are: 
    Help button, Tip button, and Progress Indicator
*/
function InteractiveElement() {

	/* 
	  Getting necessary context from the context provider.
	  For more information about these states, see Context.jsx
	*/
	const { index, setIndex, 
          task, setTask, 
          view, setView, 
          answer, setAnswer, 
          taskDataStorage, setTaskDataStorage, 
          AnswerStates, ViewStates 
  } = useContext(TaskDataContext);

	/* 
	  Easier updating of the user's data through a wrapper function. 
	  Call it like this: updateTaskData(index, {variableToChange: newValue})
	*/
	const updateTaskData = (index, newData) => {
		setTaskDataStorage((prevData) => {
			const updatedData = [...prevData];
			updatedData[index] = { ...updatedData[index], ...newData };
			return updatedData;
		});
	};

	// The type of interaction chosen by the user determines whether the pane slide is animated or not.
	const [paneSlideAnimation, setPaneSlideAnimation] = useState(true);

	// Whether the user hasn't hit the last task yet
	const [tasksRemain, setTasksRemain] = useState(true);

	const korContainerRef = useRef(null);
	useEffect(() => {
		// Updating the kor container according to the current index and/or new information inside taskDataStorage
		const korContainer = korContainerRef.current;
		if (korContainer) {
			korContainer.innerHTML = taskDataStorage[index]?.generatedKOR.message;
			korContainer.style.color = taskDataStorage[index]?.generatedKOR.color;
		}
	}, [taskDataStorage, index]);

	// The "Knowledge of Result" feedback (text and color) the user receives
	const correct_phrases = ["Ganz genau!", "Super!", "Richtig!", "Stimmt!", "Genau!"];
	const incorrect_phrases = ["Nicht ganz!", "Leider nicht", "Nicht wirklich", "Eher nicht", "Daneben!"];
	const neutral_phrases = ["Hier die Auflösung", "Richtig wäre...", "Hier die Erklärung", "Folgendes stimmt"];
	const generateKOR = (currIndex, answerGiven) => {
		// These get generated throughout this function
		let newColor, newMessage; 

		// Change these to color-code the different kinds of kor messages
		let hexCorrect = "#39C55E";   // = css "do-green"
		let hexIncorrect = "#E96C61"; // = css "dont-red"
		let hexRevealed = "#00AAF0";  // = css "highlight-blue"

		let correctAnswer = tasks[currIndex]?.answer === 1 ? AnswerStates.APP1 : AnswerStates.APP2;
		let incorrectAns = tasks[currIndex]?.answer === 1 ? AnswerStates.APP2 : AnswerStates.APP1;

		if (answerGiven === correctAnswer) {
			// Guessed correct
			newColor = hexCorrect;
			newMessage = correct_phrases[Math.floor(Math.random() * correct_phrases.length)];
		} else if (answerGiven === incorrectAns) {
			// Guessed incorrect
			newColor = hexIncorrect;
			newMessage = incorrect_phrases[Math.floor(Math.random() * incorrect_phrases.length)];
		} else {
			// Clicked on show solution
			newColor = hexRevealed;
			newMessage = neutral_phrases[Math.floor(Math.random() * neutral_phrases.length)];
		}

		// Store kor feedback for this tasks
		updateTaskData(currIndex, { generatedKOR: { color: newColor, message: newMessage } });
		updateTaskData(currIndex, { isLastAnswerCorrect: answerGiven === correctAnswer });

		// Animate the kor heading according to the correctness of provided answer
		if (answerGiven === correctAnswer) {
			startKORAnimation(true);
		} else if (answerGiven === incorrectAns) {
			startKORAnimation(false);
		}
	};

	// Sparkle animation for correct answers, shaking animation for incorrect answers
	const startKORAnimation = (isCorrectAnswer) => {
		if (isCorrectAnswer) {
			$("#kor-container")
				.sparkle({
					fill: "#39C55E",
					stroke: "#39C55E",
					size: 25,
					duration: 1500,
					delay: 600,
					startTop: 0,
					startLeft: 0,
				})
				.sparkle({
					fill: "#39C55E",
					stroke: "#39C55E",
					size: 20,
					duration: 1500,
					delay: 700,
					startTop: 29,
					startLeft: 80,
				});
		} else {
			$("#kor-container").addClass("shake");

			// Remove class after animation
			setTimeout(() => {
				$("#kor-container").removeClass("shake");
			}, 1200);
		}
	};

	const explanationContainerRef = useRef(null);
	const processExplanation = (explainText, wordDefinitions) => {
    if (explainText) {
      const explanationContainer = explanationContainerRef.current;
			let markedWords = [];
      
			const markWord = (word, definition) => {
        markedWords.push(word);
				return `<span><mark tabindex="-1" aria-hidden="true" data-definition="${definition}">${word}</mark></span>`;
			};
      
      // Mark all words that have been provided a definition with a css class, but only when they appear for the first time
			if (wordDefinitions) {
				Object.keys(wordDefinitions).forEach((word) => {
					const regex = new RegExp(`\\b${word}\\b`, "gi");

					if (!markedWords.includes(word)) {
						const match = explainText.match(regex);
						if (match) {
							explainText = explainText.replace(match[0], () => markWord(match[0], wordDefinitions[word]));
						}
					}
				});
			}

			// Replace this specific syntax with markers, to spot the references better
			explainText = explainText.replaceAll("[option1]", '<span class="ref-marker">App 1</span>');
			explainText = explainText.replaceAll("[option2]", '<span class="ref-marker">App 2</span>');

			if (explanationContainer) {
				explanationContainer.innerHTML = explainText;
			}

			// The provided word definitions that appear on hover
			tippy("mark", {
				content: (reference) => reference.getAttribute("data-definition"),
				appendTo: document.body,
				interactive: true,
				animateFill: true,
				plugins: [animateFill],
				arrow: true,
				maxWidth: 250,
				offset: [0, 1],
				interactiveBorder: 20,
			});
		}
	};

	const playGradientAnimation = () => {
		const guidelineText = document.getElementById("guideline-text");
		guidelineText.classList.remove("text-gradient-animation");
		void guidelineText.offsetWidth; // Trigger reflow to play the animation again when the class is re-applied
		guidelineText.classList.add("text-gradient-animation");
	};


  // || Event handlers for the buttons and keyboard shortcuts

	const handleCheckClicked = () => {
		setPaneSlideAnimation(true);
		generateKOR(index, answer);
		setView(ViewStates.EXPLAIN);
	};

	const handleBackClicked = () => {
		setPaneSlideAnimation(true);
		setView(ViewStates.ASK);
	};

	const handleNextClicked = () => {
		setPaneSlideAnimation(false);
		setView(ViewStates.ASK);
		setIndex(index + 1);
		playGradientAnimation();
	};

	const handleBubbleClicked = (newIndex) => {
		setPaneSlideAnimation(false);
		setIndex(newIndex);
		setView(taskDataStorage[newIndex].lastView);
	};

	const handleAppClicked = (option) => {
		let clickedOnAnswer = option === 1 ? AnswerStates.APP1 : AnswerStates.APP2;
		setAnswer(clickedOnAnswer);
	};

	const handleTipClicked = () => {
		if (view === ViewStates.ASK) {
			const tipButton = document.getElementById("show-tip-button");
			const tipModal = tipButton._tippy;

      if (tipModal.state.isVisible) {
        tipModal.hide();
      } else {
        tipModal.show();
      }
		}
	};

	const handleRevealClicked = (currIndex) => {
		// Hide tip popup
		const tipButton = document.getElementById("show-tip-button");
		const tipModal = tipButton._tippy;
		tipModal?.hide();

		setAnswer(AnswerStates.NO_ANS);
		setPaneSlideAnimation(true);
		generateKOR(currIndex, AnswerStates.NO_ANS);
		setView(ViewStates.EXPLAIN);
	};

	const handleKeyDown = (event) => {
		if (event.repeat) return;

		switch (event.key) {
			case "1":
				if (view === ViewStates.ASK) {
					handleAppClicked(1);
				}
				break;
			case "2":
				if (view === ViewStates.ASK) {
					handleAppClicked(2);
				}
				break;
			case "r":
				if (view === ViewStates.ASK && answer !== AnswerStates.NO_ANS) {
					handleCheckClicked();
				}
				break;
			case "t":
				handleTipClicked();
				break;
			case "z":
				if (view === ViewStates.ASK) {
					handleRevealClicked(index);
				}
				break;
			case "Escape":
				const button1 = document.getElementById("show-tip-button");
				const button2 = document.getElementById("help-button");
				const modal1 = button1._tippy;
				const modal2 = button2._tippy;
				modal1?.hide();
				modal2?.hide();
				break;
			case "ArrowRight":
				if (view === ViewStates.EXPLAIN && tasksRemain) {
					handleNextClicked();
				}
				break;
			case "ArrowLeft":
				if (view === ViewStates.EXPLAIN) {
					handleBackClicked();
				}
				break;
			case "ArrowDown":
				handleBubbleClicked(Math.max(0, index - 1));
				break;
			case "ArrowUp":
				if (tasksRemain) {
					handleBubbleClicked(Math.min(tasks.length, index + 1));
				}
				break;
			case "h":
				const helpButton = document.getElementById("help-button");
				const helpModal = helpButton._tippy;
				helpModal?.show();
				break;
		}
	};

	const scoreRef = useRef(null);
	const calculateScore = () => {
		let scoreContainer = scoreRef.current;
		if (taskDataStorage && scoreContainer) {
			let score = 0;
			let totalQuestions = taskDataStorage.length;
			let additionalScoreSymbol = "";

			for (let i = 0; i < totalQuestions; i++) {
				if (taskDataStorage[i].isLastAnswerCorrect) {
					score++;
				}
			}

			if (score >= 0.8 * totalQuestions) {
				additionalScoreSymbol = "🙌🏽";
			} else if (score >= 0.6 * totalQuestions) {
				additionalScoreSymbol = "👌🏽";
			} else if (score >= 0.4 * totalQuestions) {
				additionalScoreSymbol = "👍🏽";
			} else {
				additionalScoreSymbol = "☝🏽";
			}

			scoreContainer.innerHTML = additionalScoreSymbol + " " + score;
		}
	};

	const app1Ref = useRef(null);
	const app2Ref = useRef(null);
	useEffect(() => {
    // On index change, update the tasks and restore the answer if given previously
		setTask(tasks[index]);
		setAnswer(taskDataStorage[index].loggedInAnswer);
		setTasksRemain(index !== tasks.length - 1);
	}, [index]);

	useEffect(() => {
    // On task change, process the explanation for the current task
		processExplanation(task.explanation, task.wordDefinitions);

		// Cleanup function to destroy the Tippy instances (mark) for better performance
		return () => {
			document.querySelectorAll("mark").forEach((e) => {
				e._tippy.destroy();
			});
		};
	}, [task]);

	useEffect(() => {
    // Re-calculate the score when the user did a task-related action
		calculateScore();
	}, [taskDataStorage]);

	useEffect(() => {
		// On view change, store it as the last view on this task
		updateTaskData(index, { lastView: view });

		// Contract the unselected option when seeing the explanation
		if (view === ViewStates.EXPLAIN) {
			// Make word definitions tabbable when in EXPLAIN view
			document.querySelectorAll("mark").forEach((el) => {
				el.tabIndex = 0;
        el.ariaHidden = false;
			});
		} else {
			// Make word definitions untabbable when in ASK view
			setTimeout(() => {
				document.querySelectorAll("mark").forEach((el) => {
					el.tabIndex = -1;
          el.ariaHidden = true;
				});
			}, 1000);
		}
		adjustAppStyling(answer);
	}, [view]);

	const checkSubText = useRef(null);
	useEffect(() => {
		// On answer change, store it as the last logged in answer for this task
		updateTaskData(index, { loggedInAnswer: answer });

		// According to the last logged in answer, highlight the chosen option and add a sub text
		let subText = "";
		if (answer === AnswerStates.APP1) {
			subText = "Antwort 1 gewählt";
		} else if (answer === AnswerStates.APP2) {
			subText = "Antwort 2 gewählt";
		} else {
			subText = "";
		}

		checkSubText.current.innerHTML = subText;
		adjustAppStyling(answer);
	}, [answer]);

  // Append and remove css classes for styling the selected and not-selected choice
	const adjustAppStyling = (answerForIndex) => {
		if (answerForIndex === AnswerStates.APP1) {
			app1Ref.current.classList.add("selected");
			app2Ref.current.classList.remove("selected");

			if (view === ViewStates.EXPLAIN) {
				app1Ref.current.classList.remove("unselected-contracted");
				app2Ref.current.classList.add("unselected-contracted");
			}
		} else if (answerForIndex === AnswerStates.APP2) {
			app1Ref.current.classList.remove("selected");
			app2Ref.current.classList.add("selected");

			if (view === ViewStates.EXPLAIN) {
				app1Ref.current.classList.add("unselected-contracted");
				app2Ref.current.classList.remove("unselected-contracted");
			}
		} else {
			app1Ref.current.classList.remove("selected");
			app2Ref.current.classList.remove("selected");

			if (view === ViewStates.EXPLAIN) {
				app1Ref.current.classList.add("unselected-contracted");
				app2Ref.current.classList.add("unselected-contracted");
			}
		}

		if (view === ViewStates.ASK) {
			app1Ref.current.classList.remove("unselected-contracted");
			app2Ref.current.classList.remove("unselected-contracted");
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		// Cleanup the event listener on component unmount (Important for proper functionality)
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [view, answer, index, tasksRemain, tasks.length]);

	useEffect(() => {
    // Update the tip content when the task changes
		const tipButton = document.getElementById("show-tip-button");
		const tippyInstance = tipButton?._tippy;
		const tipContentElement = tippyInstance?.popper.querySelector("#tip-content");
		hideAll();
		if (tipContentElement) {
			tipContentElement.innerHTML = tasks[index].tip;
		}
	}, [index]);

	const tipContentRef = useRef(null);
	useEffect(() => {
		if (tipContentRef.current) {
			const template = document.getElementById("tip-modal");
			tippy("#show-tip-button", {
				content: template.innerHTML,
				allowHTML: true,
				interactive: true,
				appendTo: document.getElementById("tip-container"),
				arrow: true,
				maxWidth: 400,
				trigger: "manual",
				animation: "shift-away",
				theme: "purpleish",
				onShow: () => {
					$("#idea-icon").addClass("bulp-on");
					$("#tip-label").css("visibility", "hidden");
				},
				onHide: () => {
					$("#idea-icon").removeClass("bulp-on");
					$("#tip-label").css("visibility", "visible");
				},
			});
		}
	}, []);

	const revealButton = useRef(null);
	useEffect(() => {
		const tipButton = document.getElementById("show-tip-button");
		const tippyInstance = tipButton._tippy;
		const revealButton = tippyInstance.popper.querySelector("#tip-reveal-button");

		// Remove all previously assigned event handlers and add a new one
		const clonedButton = revealButton.cloneNode(true);
		clonedButton?.addEventListener("click", () => handleRevealClicked(index));
		revealButton.parentNode.replaceChild(clonedButton, revealButton);
	}, [index]);

	return (
		<>
			<main id='main-wrapper' className={`split-container min-h-screen relative ${view === ViewStates.EXPLAIN ? "right-visible" : ""} ${paneSlideAnimation ? "with-transition" : ""}`}>
				<ProgressIndicator total={tasks.length} index={index} view={view} handler={handleBubbleClicked} />
				<div id='left-pane' className={`overflow-y-auto nav-protected-padding ${paneSlideAnimation ? "with-transition" : ""}`}>
					<div id='left-content' className='flex flex-col justify-center gap-left-content content-distribute pt-to-viewport pb-to-viewport'>
            <div id='task-container' className='fly-in-left'>
              <div id='exercise-tag' className='flex justify-start items-center mb-2'>
                <img id='sparkle-icon' src={sparkleIcon} alt='' />
                <p>Aufgabe {index + 1} von {tasks.length}</p>
              </div>
              <p id='task-description'>{task.taskDescription}</p>
            </div>

            <div id='guideline-container' className='fly-in-left'>
              <h2 id='guideline-text' className='text-gradient-animation'>
                {task.guidelineText}
              </h2>
              <img id='quote-icon' src={quoteMark} alt='Zitat-Symbol' loading='lazy' />
            </div>

            {task?.referencedArticle && (
              <div id='reference-container' className='fly-in-left'>
                <p id='refers-to' className='mb-2'>Nimmt Bezug auf</p>
                <Link id='referenced-article' to='/text' className='flex justify-start items-center border-2'>
                  <div id='article-img'>
                    <img src={task.referencedArticle?.thumbnail} alt='' />
                  </div>
                  <p className='mx-2'>{task.referencedArticle?.title}</p>
                </Link>
              </div>
            )}
					</div>
				</div>

				<div id='mid-pane' className={`overflow-y-auto nav-protected-padding overflow-y-auto pattern-darker ${paneSlideAnimation ? "with-transition" : ""}`}>
					<div id='mid-content' className='flex flex-col justify-center items-center gap-y-8 content-distribute'>
						
            <div id='app-container' className='flex justify-center uniform-x-gap pt-to-viewport'>
							<div>
								<button 
                  ref={app1Ref} id='app1' 
                  className='app-width cassette-btn-illustration' 
                  disabled={view === ViewStates.EXPLAIN} onClick={() => {handleAppClicked(1);}} 
                  aria-label='App 1 wählen'
                >
									<div className='pill opacity-70 flex justify-center items-center'>1</div>
									<img rel="preload" fetchpriority="high" src={task.option1} as="image" type="image/webp" alt={task?.alt1} />
								</button>
							</div>
							<div>
								<button 
                  ref={app2Ref} id='app2' 
                  className='app-width cassette-btn-illustration' 
                  disabled={view === ViewStates.EXPLAIN} onClick={() => {handleAppClicked(2);}} 
                  aria-label='App 2 wählen'
                >
									<div className='pill opacity-70 flex justify-center items-center'>2</div>
									<img rel="preload" fetchpriority="high" src={task.option2} as="image" type="image/webp" alt={task?.alt2}/>
								</button>
							</div>
						</div>

						<div id='sub-app-container' className={`pb-to-viewport ${view === ViewStates.EXPLAIN ? "right-visible" : ""}`}>
							{/* Only show in view ASK */}
							<div className='flex flex-col'>
								<button
									id='check-button'
									className={`cassette-btn-light py-3 px-24 ${answer === AnswerStates.NO_ANS ? "greyed-out" : ""}`}
									role='button'
									onClick={answer !== AnswerStates.NO_ANS ? handleCheckClicked : undefined}
									aria-label='Prüfen-Button'
								>
									Prüfen
								</button>
								<span ref={checkSubText} id='check-sub-text' className='mt-2'></span>
							</div>

							{/* Only show in view EXPLAIN */}
							<div id='dos-and-donts' className='flex justify-center uniform-x-gap'>
								<div id={`${task.answer === 1 ? "do-side" : "dont-side"}`} className='flex flex-col justify-start items-center app-width'>
									<div id={`${task.answer === 1 ? "do-label" : "dont-label"}`} className='flex justify-center items-center py-2 mb-4 gap-x-2'>
										<img className='w-5 h-5' src={`${task.answer === 1 ? checkIcon : crossIcon}`} alt='' loading='lazy' />
										<h3>{`${task.answer === 1 ? "Berücksichtige" : "Vermeide"}`}</h3>
									</div>
									<p className='do-dont-description'>{task?.compactDescription1}</p>
								</div>
								<div id={`${task.answer === 1 ? "dont-side" : "do-side"}`} className='flex flex-col justify-start items-center app-width'>
									<div id={`${task.answer === 1 ? "dont-label" : "do-label"}`} className='flex justify-center items-center py-2 mb-4 gap-x-2'>
										<img className='w-5 h-5' src={`${task.answer === 1 ? crossIcon : checkIcon}`} alt='' loading='lazy' />
										<h3>{`${task.answer === 1 ? "Vermeide" : "Berücksichtige"}`}</h3>
									</div>
									<p className='do-dont-description'>{task?.compactDescription2}</p>
								</div>
							</div>
						</div>
					</div>

					<div id='tip-container' className={`drop-shadow flex flex-col justify-center items-center`}>
						<button id='show-tip-button' className='flex justify-center items-center' aria-label='Tipp-Button' onClick={handleTipClicked}>
							<span id='tip-label'>Tipp</span>
							<img id='idea-icon' className='w-10 h-10' src={ideaIcon} alt='' loading='lazy' />
						</button>
						<div ref={tipContentRef} style={{ display: "none" }}>
							<div id='tip-modal' className='flex flex-col justify-center items-center'>
								<div className='flex w-full mb-1'>
									<h3 id='tip-title'>Tipp</h3>
								</div>
								<p id='tip-content' className='mb-4'>
									{task?.tip}
								</p>
								<div className='flex justify-center'>
									<button ref={revealButton} id='tip-reveal-button' className='flex justify-start items-center' aria-label='Auflösen-Button'>
										<p>Zur Auflösung</p>
										<img className='w-[22px]' src={forwardIcon} alt='' loading='lazy' />
									</button>
								</div>
							</div>
						</div>
					</div>

				</div>

				<div id='right-pane' className={`overflow-y-auto nav-protected-padding overflow-y-auto ${paneSlideAnimation ? "with-transition" : ""}`}>
					<div id='right-content' className='flex flex-col justify-center items-center gap-right-content content-distribute'>
						<div id='feedback' className='w-full'>
							<h3 ref={korContainerRef} id='kor-container' className='mb-4'></h3>
							<section
								ref={explanationContainerRef}
								id='explanation-container'
								style={{ wordBreak: "break-word", hyphens: "auto", language: "de" }}
							></section>
						</div>
						<div
							id='back-forth-container'
							className={`flex flex-wrap gap-y-4 ${index === tasks?.length - 1 ? "justify-between" : "justify-start"} items-center w-full gap-x-10`}
						>
							<button id='back-button' className='flex justify-start items-center gap-x-1' onClick={handleBackClicked} aria-label='Zurück-Button'>
								<img className='w-[22px]' src={backIcon} alt='' loading='lazy' />
								<p>Zur Aufgabe</p>
							</button>
							<div id='end-box' className={`flex flex-col justify-start items-center ${tasksRemain ? "hidden" : ""}`}>
								<p id='end-box-title' className='flex justify-center items-center'>Richtig beantwortet</p>
								<div id='end-box-content' className='flex justify-center items-center'>
									<>
										<span ref={scoreRef}>{0}</span>
										<span>/{tasks.length}</span>
									</>
								</div>
							</div>
							<button
								id='next-button'
								className={`cassette-btn-dark py-3 px-5 ${tasksRemain ? "" : "hidden"}`}
								onClick={handleNextClicked}
								aria-label='Nächste-Frage-Button'
							>
								Nächste Frage
							</button>
						</div>
					</div>
				</div>
				<Help />
			</main>
		</>
	);
}

export default InteractiveElement;
