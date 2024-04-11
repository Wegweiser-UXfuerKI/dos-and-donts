import { React, useState, createContext } from "react";
import { tasks } from "./content/tasks";

export const TaskDataContext = createContext(null);

// Possible views the user can have on the system
export const ViewStates = { ASK: "ask", EXPLAIN: "explain" };

// Possible answers the user can log in on a task
export const AnswerStates = { NO_ANS: "no_ans", APP1: "app1", APP2: "app2" };

/* 
  Provides it's children element (InteractiveElement and InformationText) with context about the current index 
  and all user data related to answering/completing the different tasks.
*/
export const TaskDataProvider = ({ children }) => {

	// Which task gets indexed
	const [index, setIndex] = useState(0);

	// The task displayed at the moment
	const [task, setTask] = useState(tasks[index]);

	// The user's view on the system for the current task - It can ask the user or explain the solution
	const [view, setView] = useState(ViewStates.ASK);

	// The user's logged-in answer for the current task
	const [answer, setAnswer] = useState(AnswerStates.NO_ANS);

	// The storage for things that get saved per-task, so that they can be restored
	const [taskDataStorage, setTaskDataStorage] = useState(
		Array(tasks.length).fill({
			lastView: ViewStates.ASK,
			loggedInAnswer: AnswerStates.NO_ANS,
			isLastAnswerCorrect: false,
			generatedKOR: {
				color: "",
				message: "",
			},
		})
	);

	return (
		<TaskDataContext.Provider
			value={{
				index,
				setIndex,
				task,
				setTask,
				view,
				setView,
				answer,
				setAnswer,
				taskDataStorage,
				setTaskDataStorage,
				ViewStates,
				AnswerStates,
			}}
		>
			{children}
		</TaskDataContext.Provider>
	);
};
