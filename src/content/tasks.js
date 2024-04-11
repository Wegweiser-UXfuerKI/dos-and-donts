/* 
  Note: For hosting this application on gh-pages and using this approach of a .js file for the content, 
  we have to import resources like images here, so that they get found in the production build.
*/
import referencedArticleThumbnail from "/src/content/article-nutzerverhalten-thumbnail-80x80.webp";

import task1Do from "/src/content/taskA-do.png";
import task1Dont from "/src/content/taskA-dont.png";

import task2Do from "/src/content/task2-do.webp";
import task2Dont from "/src/content/task2-dont.webp";

import task3Do from "/src/content/task3-do.webp";
import task3Dont from "/src/content/task3-dont.webp";

/*
  Enter an entry for each task.

  The following properties are optional: 
    id, referencedArticle, alt1, alt2, wordDefinitions
*/
export const tasks = [
	{
		id: 1, 
		taskDescription: "Wähle die App aus, die der folgenden Richtlinie folgt:",
		guidelineText: "Klarstellung der Interaktion mit KI-Systemen",
		referencedArticle: {
			title: "KI verdeutlichen",
			thumbnail: referencedArticleThumbnail,
		},
    option1: task1Do,
    option2: task1Dont,
		alt1: "Ein Chatbot, der verdeutlicht, dass er durch eine KI gesteuert wird.", 
		alt2: "Ein Chatbot, der mit dem Nutzer natürlichsprachlich interagiert.",
		answer: 1,
		explanation: "Bei der Interaktion mit Nutzenden muss klar gemacht werden, dass hier kein Mensch agiert. Insofern sollte man z.B. nicht 'schreibt' als Animation einsetzen, wenn der Bot antwortet. Das wäre täuschend und deutet auf einen wirklichen Menschen hin. Eine Alternative wäre der Einsatz von eher technischen Begriffen wie 'Antwort wird berechnet', die auf die maschinelle Natur des Gesprächspartners hinweisen.",
		wordDefinitions: {
			
		},
		compactDescription1: "Verwende Animationen wie 'Antwort wird berechnet' oder andere technische Begriffe während der Nutzer auf eine Antwort durch das System wartet.",
		compactDescription2: "Vermeide Animationen, die Nutzenden suggerieren, sie würden mit einem Menschen kommunizieren.",
		tip: "Es ist wichtig, dass Nutzende bei der Interaktion mit einem KI-Chatbot wissen, dass sie mit einer KI kommunizieren.", 
	},
	{
		id: 2,
		taskDescription: "Wähle die App aus, die der folgenden Richtlinie folgt:",
		guidelineText: "Lerne aus dem Verhalten von Nutzern",
		referencedArticle: {
			title: "Nutzerverhalten",
			thumbnail: referencedArticleThumbnail,
		},
		option1: task2Dont,
		option2: task2Do,
		alt1: "Eine Social Media App, die den Feed des Nutzers inhaltlich komplett ändert, mit der Absicht, dass dem Nutzer nicht langweilig werden soll.",
		alt2: "Eine Social Media App, die einen vermeintlich für den Nutzer interessanten Beitrag empfiehlt, der als interessant oder nicht interessant bewertet werden kann.",
		answer: 2,
		explanation:
			"Es gibt einige Gemeinsamkeiten und Unterschiede zwischen den beiden Optionen. Gemeinsam haben beide, dass dem Nutzer neue Inhalte gezeigt werden, mit einer positiven Absicht, nämlich interessante Beiträge anzuzeigen.\n\nEin wichtiger Unterschied besteht darin, dass [option2] einen Inhalt basierend auf den <strong>gelernten Interessen</strong> des Nutzers vorschlägt, während [option1] dies nicht ermöglicht. Dieser Vorschlag kann wiederum selbst vom Nutzer bewertet werden, sodass das System konstant erlernt, was den Nutzer gerade interessiert. Die Anwendung kann dieses Nutzer-Feedback verwenden, um die Präferenzen des Nutzers zu erlernen und dadurch in Zukunft passendere Empfehlungen anzuzeigen.\n\n[option1] wird hingegen wahrscheinlich zu <strong>Frustrationen</strong> beim Nutzer führen, da die Informationen im Banner verraten, dass der Nutzer sich eigentlich für einen ganz anderen Themenbereich als den jetzigen interessierte. Zum einen könnte er die alten Beiträge zu Filmen und Serien vermissen, zum anderen könnte es sein, dass die neuen Inhalte ihn gar nicht interessieren. Letzteres hat besonders dann schwerwiegende Folgen, wenn sie den Großteil seiner Empfehlungen betreffen und sich die Änderung nicht einfach rückgängig machen lässt.",
		wordDefinitions: {
			"Nutzer-Feedback": "Die Rückmeldung des Nutzers an die Anwendung über dessen Verhalten. Kann positiv oder negativ sein, und bewusst oder implizit (z.B. durch Verweildauer auf einer Seite) gegeben werden.",
		},
		compactDescription1: "Vermeide, Gewohnheiten vom und Empfehlungen an den Nutzer abrupt zu ändern. Vor allem dann, wenn keine Grundlage dafür besteht.",
		compactDescription2: "Personalisiere die Erfahrungen des Nutzers, indem aus seinen Handlungen im Laufe der Zeit gelernt wird.",
		tip: "Auf welche App würdest du als Nutzer vermutlich eher negativ reagieren? Beachte, dass dir nur eine der beiden eine Wahl lässt.",
	},{
		id: 3,
		taskDescription: "Wähle die App aus, die der folgenden Richtlinie folgt:",
		guidelineText: "Füge Kontext aus menschlichen Quellen hinzu",
		referencedArticle: {
			title: "Nutzerverhalten",
			thumbnail: referencedArticleThumbnail,
		},
		option1: task3Do,
		option2: task3Dont,
		answer: 1,
		alt1: "Eine Gesundheitsapp, die Ernährungsvorschläge basierend auf einer Fachgesellschaft macht und den Nutzer diesbezüglich nach einer Entscheidung fragt.",
		alt2: "Eine Gesundheitsapp, die Ernährungsvorschläge macht, die nicht eingeordnet werden und den Nutzer diesbezüglich nach einer Entscheidung fragt.",
		explanation: "Vorsicht ist geboten, wenn den Nutzern Vorschläge für Verhaltensänderungen gegeben werden, insbesondere dann, wenn diese sich auf ihre Gesundheit auswirken. Vorschläge zum Essverhalten, Schlafverhalten, oder zu sportlichen Aktivitäten sollten eine <strong>wissenschaftliche Basis</strong> haben und wenn nötig und möglich an den spezifischen Nutzer angepasst sein.\n\nWenn die Empfehlung durch Expertenquellen gestützt wird, lasse es den Nutzer wissen, so wie es [option1] mit einem Verweis auf die DGE kommuniziert. Durch diesen zusätzlichen Kontext wird ihm geholfen, die Qualität der Empfehlung einzuordnen.\n\nNutzern fällt es dadurch leichter, seriöse von <strong>unseriösen Informationen</strong> zu unterscheiden. Wenn Zweifel auftreten, können sie zur Not bei der dargebotenen Quelle mit wenig Mühe selbst nachschlagen. Das ist bei [option2] nicht möglich (bzw. mit mehr Mühe verbunden), weshalb der gezeigte Vorschlag auf Unsicherheit stoßen könnte und das Erlebnis mit der Anwendung negativ einfärbt.",
		wordDefinitions: {
			DGE: "Abkürzung für Deutsche Gesellschaft für Ernährung",
		},
		compactDescription1: "Kontextualisiere Empfehlungen an den Nutzer durch Expertenquellen oder durch andere vertrauenswürdige Nutzer.",
		compactDescription2: "Vermeide, Kontexte unerwähnt zu lassen, damit der Nutzer den Wert deiner Empfehlung besser einschätzen kann.",
		tip: "Frage dich Folgendes: Welche App hilft dir dabei, die Qualität des Ernährungstipps einzuschätzen?",
	}
];
