import React, { useContext } from 'react';

import { TaskDataContext } from "../Context.jsx";
import "./ProgressIndicator.css";

/* 
  The progress indication that gives information about how many tasks there are and which task I am currently.
  Can be clicked on for fast navigation between tasks. 
*/
const ProgressIndicator = ({ total, index, handler, view }) => {

  const { ViewStates } = useContext(TaskDataContext);
  
	const circles = Array.from({ length: total }, (_, i) => (
		<div 
      key={i} 
      data-task-index={i} 
      className={`bubble ${i === index ? "active" : ""}`} 
      onClick={() => handler(i)} 
      aria-label={`Zu Frage ${i}`}>
    </div>
	));

	return <div className={`progress-indicator drop-shadow ${view === ViewStates.EXPLAIN && "darken"}`}>{circles}</div>;
};

export default ProgressIndicator;
