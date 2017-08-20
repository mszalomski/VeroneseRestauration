# Technische Dokumentation
Im Folgenden soll ein technischer Überblick über das Projekt gegeben werden. Dabei wird zunächst die vorliegende Dateistruktur erläutert. Sie sollte wie folgt aussehen:
```
/content
/images
/scripts
/styles
/arrowLeft.png
/arrowRight.png
/closeButton.png
/data.json
/homeButton.png
/index.html
/introvideo.mp4
/introvideo.webm
/magnificationGlass.png
/restauration.html
/startButton.png
```
Im Ordner `content` liegen die darzustellenden Informationstexte zu den jeweiligen Restaurierungsmethoden. Zugehörige Bilder sind dabei in `images` zu finden.
Unter `scripts` kann die Applikationslogik eingesehen werden. UI-Styling-Angelegenheiten befinden sich dagegen im Ordner `styles`.

Weiterhin gibt es zwei HTML-Dateien, eine für die Startseite (`index.html`) und eine für die Hauptinhalte (`restauration.html`).
Für das auf der Startseite befindliche Video werden zwei Formate genutzt.
Die Datei `data.json` dient vor allem der korrekten Zuordnung von Informationstexten und Bildern.
Die zahlreichen Bilder im PNG-Format werden für verschiedene klickbare Funktionalitäten innerhalb der Anwendung eingesetzt.

## Softwaretechnologischer Aufbau
Um eine möglichst hohe Portabilität zu verwirklichen, wird ein webbasierter Ansatz gewählt. Dadurch ist eine Ausführung auf verschiedenen Plattformen möglich.
Die Anwendung baut dabei auf den Webtechnologien HTML, CSS und JavaScript auf.

Die JavaScript-Dateien `jsonLoader.js` und `veronese_main.js` bilden beide das Herzstück der Anwendung. In ihnen ist die wesentliche Funktionalität definiert.
Die Datei `jsonLoader.js` liest hier zunächst die JSON-Datei im Hauptverzeichnis und übergibt alle benötigten Informationen (Bilder, Datum, Informationstexte) an die Datei `veronese_main.js` weiter.
Die zahlreichen Funktionen der Zeitleiste werden ebenfalls von der Datei `jsonLoader.js` realisiert.
Die Datei `veronese_main.js` hingegen ist grundlegend für die weitere Verarbeitung der erhaltenen Informationsdaten und somit für deren korrekte UI-Darstellung verantwortlich.

<p align="center">
<img src="media/klassendiagramm.png">
<div align="center"><i>Ein Überblick über die zwei wesentlichen JavaScript-Dateien.</i></div>
</p>

## Quellcode-Dokumentation

TODO:
- JavaDoc

## Architektur

Prinzipiell kann die Anwendung mithilfe eines Browsers lokal ausgeführt werden, sodass kein Webserver benötigt wird.
Optional ist die Verwendung eines Webservers für die Anwendung jedoch möglich. Hierfür kann beispielsweise ein einfacher Apache Server ohne serverseitige Logik aufgesetzt werden.
Die Quelldateien der Anwendung müssen anschließend auf den Webserver hochgeladen werden, sodass diese später über die jeweilige Server-URL referenziert werden können.
Mithilfe des Browsers als Client werden die Ressourcen letztlich abgerufen.

## Systemvoraussetzungen

Die Anwendung läuft im Wesentlichen ohne Probleme unter den verbreitetsten Browsern Firefox, Chrome, Safari und Edge.
Lediglich im Browser Chrome sollte das Feature `Overscroll history navigation` in den Entwickler-Einstellungen, einsehbar unter `chrome://flags/`, deaktiviert werden.
Dies verhindert ein unerwünschtes Zurücknavigieren zur Startseite nach einer horizontalen Wischgeste (mehr dazu in der Bedienungsanleitung, wo es um die Interaktionsmöglichkeiten der Anwendung geht).

Des Weiteren ist für die Anwendung kein spezielles Betriebssystem notwendig.
Für die verwendeten Technologien und Frameworks müssen von der Seite des Nutzers aus keine gesonderten Installationen durchgeführt werden, da bereits alle nötigen Dateien mitgeliefert werden.
Unter anderem wird die JavaScript-Bibliothek jQuery 3.2.1, die Erweiterung jQuery UI 1.12.1 und das Plug-in jQRangeSlider in der Version 5.7.2, welches etwa für die Zeitleiste verwendet wird, eingesetzt.
Außerdem wird zusätzlich Bootstrap 3.3.7 für die UI-Gestaltung genutzt.

Für eine optimale Darstellung der Inhalte wird ein 30 bis 36 Zoll großer Tabletop empfohlen, welches das Breitbildformat 16:9 unterstützt.
Eine Full-HD-Bildschirmauflösung wird dabei vorausgesetzt.
Mit einer geringeren User Experience ist die Anwendung zudem auch auf herkömmlichen PCs lauffähig.

## Bedienungsanleitung

Wird die Anwendung durch das Aufrufen der entsprechenden Webseite gestartet, dann erscheint zunächst die Startseite mit dem zugehörigen Eyecatcher-Video.
Der Nutzer kann nun auf eine beliebige Stelle im Bild klicken, sodass er zu der Hauptseite mit den wesentlichen Inhalten gelangt.
Mit dem auf der Hauptseite befindlichen Home-Symbol, welches oben zentriert lokalisiert ist, kann der Nutzer jederzeit zur Startseite zurückkehren.

Auf der Hauptseite ist überdies oben die aktuell einsehbare Restaurierungsmethode als Titel zu sehen.
Darunter befinden sich die eigentlichen Informationsinhalte zu der jeweiligen Restaurierungsmethode mit Bildern auf der linken Seite und zugehörigen Texten auf der rechten Seite.
In diesem Bereich, der durch weiße Linien oberhalb und rechts gekennzeichnet ist, ist der Nutzer in der Lage, weitere Informationen durch Scrollen zu erforschen.
Um den Bezug zum Originalbild "Die Madonna der Familie Cuccina" nicht zu verlieren, ist dieses Bild stets oben rechts als Referenz zu sehen und durch Anklicken auch vergrößerbar.
Der Zustand des Bildes passt sich dabei fortlaufend der aktuell angezeigten Restaurierungsmethode an.

Für die Navigation zu einer anderen Restaurierungsmethode gibt es mehrere Möglichkeiten.
Der Nutzer kann hier beispielsweise die an der linken und rechten Seite befindlichen Pfeile anklicken, um zur zeitlich vorhergehenden oder nachfolgenden Restaurierungsmethode zu navigieren.
Eine andere Möglichkeit wäre per horizontale Wischgesten zu den angrenzenden Methoden zu wechseln.
Um zu einer beliebigen Restaurierungsmethode zu gelangen, kann der Slider im unteren Bereich der Seite genutzt werden.
Per Drag & Drop des goldenen Sliders wird die gewünschte Restaurierungsmethode ebenfalls ausgewählt.
Auch ein einfacher Klick auf eines der unteren Elemente führt zu einem schnellen Wechsel.
Die Navigation mithilfe des Sliders bringt an dieser Stelle den Vorteil des Einsehens einer kleinen Bildvorschau zu einer Restaurierungsmethode.
Je nachdem, wo sich der Slider während des Drag & Drop-Vorgangs befindet, werden über den jeweiligen Elementen entsprechend große Vorschaubilder angezeigt.

## Versionsverwaltung

TODO:
- Dokumentation der Branches, Tags (welcher ist der finale Commit, entspricht der kompilierten Abgabe)?
- Welche IDE/Entwicklungsumgebung zur Entwicklung verwendet? kurze Einrichtungsanleitung für Projekt (erste Schritte, falls mal jemand weiterentwickeln möchte)