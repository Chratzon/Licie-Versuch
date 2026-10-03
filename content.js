/* Mondruhe – Inhalte
   Skript-Format: Strings werden vorgelesen (automatisch in Sätze geteilt),
   Zahlen sind zusätzliche Pausen in Sekunden. */

const CATEGORIES = [
  { id: "atmen", title: "Atemübungen", sub: "Den Atem verlangsamen" },
  { id: "meditation", title: "Meditationen", sub: "Körper und Kopf zur Ruhe bringen" },
  { id: "geschichten", title: "Geschichten", sub: "Natur- und Einschlafgeschichten" },
  { id: "klaenge", title: "Klänge", sub: "Sanfte Geräusche zum Wegdämmern" }
];

const SOUNDS = [
  { id: "none", title: "Stille" },
  { id: "regen", title: "Regen" },
  { id: "meer", title: "Meer" },
  { id: "wind", title: "Wind" },
  { id: "feuer", title: "Kaminfeuer" },
  { id: "bach", title: "Bachlauf" },
  { id: "nacht", title: "Sommernacht" },
  { id: "braun", title: "Rauschen" }
];

const BREATH_OUTRO = [
  "Lass den Atem jetzt wieder ganz von allein fließen.", 3,
  "Du musst nichts mehr tun. Nicht mehr zählen, nicht mehr steuern.", 3,
  "Nur noch liegen. Und schwer werden.", 5,
  "Gute Nacht."
];

const ITEMS = [
  /* ---------------- ATEMÜBUNGEN ---------------- */
  {
    id: "atem-478", cat: "atmen", type: "breath", sound: "none",
    title: "4-7-8 Atmung",
    desc: "Der Klassiker zum Einschlafen. Das lange Ausatmen beruhigt den ganzen Körper.",
    phases: [["Einatmen", 4, "in"], ["Halten", 7, "hold"], ["Ausatmen", 8, "out"]],
    cycles: 4, minCycles: 2, maxCycles: 12,
    intro: [
      "Mach es dir bequem. Leg dich so hin, wie es sich gerade gut anfühlt.", 2,
      "Wir atmen gleich im Rhythmus vier, sieben, acht.", 1,
      "Vier Sekunden durch die Nase einatmen. Sieben Sekunden den Atem sanft halten. Und acht Sekunden langsam durch den Mund ausatmen.", 2,
      "Wenn dir das Halten schwerfällt, mach es einfach etwas kürzer. Es gibt hier nichts falsch zu machen.", 2,
      "Atme jetzt einmal ganz aus. Und dann geht es los."
    ],
    outro: BREATH_OUTRO
  },
  {
    id: "atem-box", cat: "atmen", type: "breath", sound: "none",
    title: "Box-Atmung",
    desc: "Vier gleich lange Phasen. Gibt dem Kopf einen ruhigen Takt, wenn die Gedanken kreisen.",
    phases: [["Einatmen", 4, "in"], ["Halten", 4, "hold"], ["Ausatmen", 4, "out"], ["Halten", 4, "hold"]],
    cycles: 6, minCycles: 3, maxCycles: 15,
    intro: [
      "Willkommen. Leg dich bequem hin und lass die Schultern sinken.", 2,
      "Stell dir ein Quadrat vor. Jede Seite dauert vier Sekunden.", 1,
      "Einatmen. Halten. Ausatmen. Halten.", 2,
      "Folge einfach dem Kreis und meiner Stimme. Los geht es."
    ],
    outro: BREATH_OUTRO
  },
  {
    id: "atem-welle", cat: "atmen", type: "breath", sound: "meer",
    title: "Sanfte Welle",
    desc: "Vier Sekunden ein, sechs Sekunden aus. Ganz ohne Anhalten, wie Wellen am Strand.",
    phases: [["Einatmen", 4, "in"], ["Ausatmen", 6, "out"]],
    cycles: 15, minCycles: 6, maxCycles: 40,
    intro: [
      "Mach es dir gemütlich und schließe die Augen, wenn du magst.", 2,
      "Wir atmen jetzt wie Wellen am Strand. Vier Sekunden kommt die Welle herein. Sechs Sekunden zieht sie sich wieder zurück.", 2,
      "Ohne Anhalten. Ganz fließend. Atme ruhig durch die Nase."
    ],
    outro: BREATH_OUTRO
  },
  {
    id: "atem-seufzer", cat: "atmen", type: "breath", sound: "none",
    title: "Doppelter Seufzer",
    desc: "Zweimal einatmen, lang ausatmen. Löst Anspannung besonders schnell.",
    phases: [["Einatmen", 2, "in"], ["Nachatmen", 1, "in2"], ["Langsam aus", 6, "out"]],
    cycles: 10, minCycles: 4, maxCycles: 25,
    intro: [
      "Leg dich bequem hin.", 1,
      "Bei dieser Übung atmest du zweimal durch die Nase ein. Erst ein normaler Atemzug, dann noch ein kleiner Schluck Luft obendrauf.", 2,
      "Und dann atmest du ganz lang und langsam durch den Mund aus. Wie ein erleichterter Seufzer.", 2,
      "Wir beginnen."
    ],
    outro: BREATH_OUTRO
  },

  /* ---------------- MEDITATIONEN ---------------- */
  {
    id: "med-bodyscan", cat: "meditation", type: "voice", sound: "braun",
    title: "Body Scan",
    desc: "Eine langsame Reise durch den Körper, von den Zehen bis zum Scheitel.",
    script: [
      "Willkommen. Schön, dass du dir diese Zeit nimmst.", 2,
      "Leg dich bequem hin. Lass deinen Kopf ins Kissen sinken und deine Arme locker neben dem Körper liegen.", 2,
      "Wenn du magst, schließe jetzt die Augen.", 4,
      "Atme einmal tief ein. Und lass den Atem mit einem langen Seufzer wieder los.", 5,
      "Noch einmal. Tief einatmen. Und langsam ausatmen.", 6,
      "Jetzt darf der Atem wieder ganz von allein fließen. Du musst nichts verändern.", 5,
      "Wir wandern nun mit der Aufmerksamkeit langsam durch deinen Körper. Ohne etwas zu wollen. Nur spüren, was da ist.", 4,
      "Beginne bei deinen Füßen. Spüre deine Zehen, die Fußsohlen, die Fersen.", 3,
      "Vielleicht sind sie warm, vielleicht kühl. Alles ist in Ordnung.", 3,
      "Lass deine Füße schwer werden. Ganz schwer.", 6,
      "Wandere weiter zu deinen Unterschenkeln und Knien. Spüre, wie sie auf der Matratze liegen.", 3,
      "Mit jedem Ausatmen werden sie ein bisschen schwerer.", 6,
      "Nun deine Oberschenkel. Kräftige Muskeln, die dich den ganzen Tag getragen haben.", 3,
      "Jetzt dürfen sie ausruhen. Lass sie los.", 6,
      "Spüre dein Becken und deinen unteren Rücken. Lass alles, was dort noch festhält, in die Unterlage sinken.", 6,
      "Dein Bauch. Spüre, wie er sich mit jedem Atemzug sanft hebt. Und wieder senkt.", 3,
      "Heben. Und senken. Wie kleine Wellen.", 7,
      "Deine Brust. Vielleicht spürst du deinen Herzschlag. Ruhig und gleichmäßig.", 6,
      "Deine Schultern. Hier sammelt sich oft die Last des Tages.", 2,
      "Lass die Schultern jetzt ein kleines Stück nach unten sinken. Weg von den Ohren.", 3,
      "Ganz weich.", 6,
      "Deine Arme. Oberarme, Ellbogen, Unterarme. Bis in die Hände und in jeden einzelnen Finger.", 3,
      "Deine Hände liegen schwer und warm. Sie müssen heute nichts mehr halten.", 7,
      "Dein Nacken. Lass deinen Kopf ganz vom Kissen tragen.", 4,
      "Dein Gesicht. Lass die Stirn glatt werden. Die Augenbrauen weich.", 2,
      "Deine Augen ruhen schwer unter den Lidern.", 2,
      "Dein Kiefer darf locker werden. Die Zähne leicht auseinander, die Zunge weich im Mund.", 7,
      "Und nun spüre deinen ganzen Körper auf einmal. Von den Zehen bis zum Scheitel.", 3,
      "Schwer. Warm. Getragen.", 8,
      "Es gibt jetzt nichts mehr zu tun. Nichts mehr zu erledigen. Der Tag ist vorbei.", 4,
      "Du darfst einfach hier liegen und dich vom Schlaf holen lassen.", 6,
      "Gute Nacht."
    ]
  },
  {
    id: "med-pmr", cat: "meditation", type: "voice", sound: "none",
    title: "Muskeln entspannen",
    desc: "Kurze progressive Muskelentspannung: anspannen, halten, loslassen.",
    script: [
      "Willkommen. Bei dieser Übung spannst du nacheinander einzelne Muskelgruppen an und lässt sie dann bewusst wieder los.", 2,
      "Die Spannung soll deutlich spürbar sein, aber nie wehtun.", 2,
      "Leg dich bequem hin und schließe die Augen.", 5,
      "Wir beginnen mit den Händen. Balle beide Hände zu Fäusten. Fest. Halte die Spannung.", 5,
      "Und loslassen.", 2,
      "Spüre, wie die Spannung aus den Händen fließt. Wie sie warm und weich werden.", 8,
      "Nun die Arme. Beuge die Ellbogen und spanne die Oberarme an. Halten.", 5,
      "Und loslassen. Lass die Arme schwer zurücksinken.", 8,
      "Jetzt die Schultern. Zieh sie hoch bis zu den Ohren. Ganz hoch. Halten.", 5,
      "Und fallen lassen.", 2,
      "Spüre, wie viel Platz jetzt zwischen Schultern und Ohren ist.", 8,
      "Das Gesicht. Kneife die Augen zusammen, rümpfe die Nase, presse die Lippen aufeinander. Halten.", 5,
      "Und loslassen. Die Stirn wird glatt, der Mund weich.", 8,
      "Nun der Bauch. Spanne die Bauchmuskeln an, als würdest du dich auf eine kleine Welle vorbereiten. Halten.", 5,
      "Und loslassen. Der Atem fließt wieder frei in den Bauch.", 8,
      "Die Beine. Drücke die Fersen in die Matratze und ziehe die Zehen zu dir heran. Halten.", 5,
      "Und loslassen. Die Beine werden schwer.", 8,
      "Zum Schluss die Füße. Kralle die Zehen ein, als wolltest du Sand greifen. Halten.", 5,
      "Und loslassen.", 8,
      "Spüre jetzt deinen ganzen Körper. Jeder Muskel hat einmal gearbeitet und darf nun ruhen.", 4,
      "Wenn noch irgendwo eine Spannung ist, atme dorthin und lass sie mit dem nächsten Ausatmen gehen.", 8,
      "Du bist ganz entspannt. Schwer und warm.", 6,
      "Bleib einfach so liegen. Gute Nacht."
    ]
  },
  {
    id: "med-fluss", cat: "meditation", type: "voice", sound: "bach",
    title: "Gedanken am Fluss",
    desc: "Für Abende, an denen der Kopf nicht stillsteht. Gedanken kommen und dürfen weiterziehen.",
    script: [
      "Willkommen. Leg dich bequem hin und schließe die Augen.", 3,
      "Atme ein paar Mal ruhig ein und aus.", 6,
      "Stell dir vor, du sitzt am Ufer eines kleinen Flusses. Das Gras unter dir ist weich und noch warm von der Sonne.", 3,
      "Das Wasser fließt ruhig an dir vorbei. Du hörst es leise plätschern.", 4,
      "Auf dem Wasser treiben Blätter. Große, flache Blätter, langsam, eins nach dem anderen.", 4,
      "Immer wenn dir jetzt ein Gedanke kommt, legst du ihn auf eines dieser Blätter.", 2,
      "Egal, was es ist. Etwas von heute. Eine Sorge für morgen. Eine Liste, die du noch im Kopf hast.", 3,
      "Du legst den Gedanken auf das Blatt und schaust zu, wie er davontreibt.", 8,
      "Du musst den Gedanken nicht lösen. Du musst ihn nicht bewerten. Er darf einfach weiterschwimmen.", 8,
      "Vielleicht kommt derselbe Gedanke wieder. Das ist in Ordnung. Leg ihn einfach noch einmal auf ein Blatt.", 10,
      "Der Fluss ist geduldig. Er nimmt alles mit, was du ihm gibst.", 10,
      "Mit der Zeit werden die Blätter weniger. Zwischen den Gedanken entstehen kleine Pausen.", 4,
      "Nur noch das Wasser. Das Rauschen. Das sanfte Licht.", 10,
      "Du sitzt ganz ruhig am Ufer. Leicht und frei.", 8,
      "Und wenn du magst, legst du dich ins weiche Gras und schaust in den Abendhimmel.", 4,
      "Der Fluss fließt weiter. Du darfst jetzt schlafen.", 6,
      "Gute Nacht."
    ]
  },
  {
    id: "med-ort", cat: "meditation", type: "voice", sound: "regen",
    title: "Der sichere Ort",
    desc: "Eine Fantasiereise an einen Ort, an dem du dich vollkommen geborgen fühlst.",
    script: [
      "Willkommen. Mach es dir bequem und lass deinen Körper schwer werden.", 3,
      "Atme tief ein. Und langsam aus.", 6,
      "Ich lade dich ein zu einer kleinen Reise. An einen Ort, an dem du dich ganz sicher und geborgen fühlst.", 3,
      "Das kann ein Ort sein, den du kennst. Oder einer, den es nur in deiner Vorstellung gibt.", 3,
      "Vielleicht ein gemütliches Zimmer. Eine Lichtung im Wald. Ein Strand im Abendlicht.", 6,
      "Lass das Bild ganz von allein entstehen. Das Erste, was auftaucht, ist genau richtig.", 8,
      "Schau dich an deinem Ort um. Welche Farben siehst du? Wie ist das Licht?", 8,
      "Was hörst du? Vielleicht ist es ganz still. Vielleicht hörst du Wind, Wasser oder das Knistern eines Feuers.", 8,
      "Wie riecht es hier? Nach Holz, nach Gras, nach Meer, nach frischer Wäsche?", 8,
      "Spüre, worauf du sitzt oder liegst. Es ist weich und warm und trägt dich vollkommen.", 8,
      "Hier kann dir nichts passieren. Niemand will etwas von dir. Die Zeit spielt keine Rolle.", 6,
      "Atme diese Ruhe ein. Und mit jedem Ausatmen lässt du ein bisschen mehr vom Tag los.", 10,
      "Dieser Ort gehört nur dir. Du kannst jederzeit hierher zurückkehren. Jeden Abend. Mit nur einem Atemzug.", 8,
      "Und jetzt mach es dir hier ganz gemütlich. Kuschel dich ein.", 4,
      "Deine Augenlider sind schwer. Dein Atem ist langsam.", 6,
      "Du bist sicher. Du bist geborgen. Und du darfst schlafen.", 6,
      "Gute Nacht."
    ]
  },

  /* ---------------- GESCHICHTEN ---------------- */
  {
    id: "gs-herbstwald", cat: "geschichten", type: "voice", sound: "wind",
    title: "Abendspaziergang im Herbstwald",
    desc: "Raschelndes Laub, goldenes Licht und eine Bank am Waldrand.",
    script: [
      "Mach es dir bequem. Zieh die Decke ein Stück höher und lass den Kopf ins Kissen sinken.", 3,
      "Diese Geschichte beginnt an einem späten Nachmittag im Oktober.", 3,
      "Du gehst einen schmalen Weg entlang, der in einen Wald führt. Die Luft ist kühl und klar, und sie riecht nach feuchter Erde und nach Pilzen.", 3,
      "Du trägst einen weichen Pullover und einen Schal, und deine Hände stecken warm in den Jackentaschen.", 4,
      "Unter deinen Schuhen raschelt das Laub. Bei jedem Schritt ein leises Knistern.", 3,
      "Die Buchen leuchten in Orange und Kupfer. Ab und zu löst sich ein Blatt, dreht sich langsam in der Luft und landet ohne ein Geräusch auf dem Weg vor dir.", 5,
      "Du hast keine Eile. Niemand wartet auf dich. Der Weg führt dich ganz von allein.", 4,
      "Irgendwo klopft ein Specht. Dann ist es wieder still. Nur der Wind streicht durch die Baumkronen, wie ein langes, ruhiges Ausatmen.", 6,
      "Die Sonne steht schon tief. Ihr Licht fällt schräg zwischen die Stämme und malt goldene Streifen auf den Waldboden.", 4,
      "Du bleibst kurz stehen und schaust hinauf. Ganz oben in den Ästen sitzt ein Eichhörnchen und knabbert an einer Nuss. Es schaut dich an, ganz ohne Angst, und huscht dann gemächlich davon.", 6,
      "Der Weg wird weicher. Moos bedeckt die Ränder, grün und samtig.", 3,
      "Du kommst an einem kleinen Holzsteg vorbei, unter dem ein Bach gluckert. Das Wasser ist so klar, dass du die runden Kiesel am Grund sehen kannst.", 6,
      "Ein Stück weiter öffnet sich der Wald zu einer Lichtung. Am Rand steht eine alte Holzbank, von der Sonne gewärmt.", 3,
      "Du setzt dich. Das Holz ist glatt von den vielen Menschen, die hier schon gesessen und geruht haben.", 5,
      "Vor dir liegt eine Wiese, auf der feiner Nebel aufsteigt. Dahinter sinkt die Sonne langsam hinter die Hügel.", 4,
      "Der Himmel färbt sich rosa, dann violett, dann ein tiefes, weiches Blau.", 6,
      "Ein Reh tritt am anderen Ende der Wiese aus dem Wald. Es senkt den Kopf und grast, ganz in Ruhe. Du hältst still und schaust ihm zu.", 6,
      "Der erste Stern erscheint. Dann ein zweiter.", 4,
      "Du ziehst den Schal etwas enger. Dir ist warm, und eine angenehme Müdigkeit breitet sich in deinem Körper aus.", 5,
      "Deine Schultern werden schwer. Deine Beine werden schwer. Die Bank trägt dich, und der Wald hält dich wie eine große, ruhige Umarmung.", 6,
      "Der Wind rauscht leise in den Bäumen. Wie ein Atem. Ein und aus. Ein und aus.", 8,
      "Das Reh ist im Wald verschwunden. Der Nebel liegt still über der Wiese.", 5,
      "Und du darfst jetzt die Augen schließen. Hier ist alles gut.", 8,
      "Schlaf gut."
    ]
  },
  {
    id: "gs-leuchtturm", cat: "geschichten", type: "voice", sound: "meer",
    title: "Die Nacht im Leuchtturm",
    desc: "Ein kleines Zimmer hoch über dem Meer, ein warmer Tee und das Rauschen der Wellen.",
    script: [
      "Mach es dir bequem und atme einmal tief durch.", 4,
      "Stell dir vor, du stehst am Ende einer langen Landzunge. Vor dir ragt ein weiß-roter Leuchtturm in den Abendhimmel.", 4,
      "Heute Nacht darfst du hier oben schlafen.", 3,
      "Die schwere Holztür öffnet sich mit einem leisen Knarren. Drinnen riecht es nach Salz, nach altem Holz und ein wenig nach Lampenöl.", 4,
      "Eine Wendeltreppe führt nach oben. Du gehst langsam, Stufe für Stufe. Deine Hand gleitet über das kühle Geländer.", 5,
      "Ganz oben, direkt unter dem Licht, gibt es ein kleines, rundes Zimmer.", 3,
      "Darin steht ein Bett mit dicken Kissen und einer Decke aus weicher Wolle. Auf dem Tischchen daneben wartet eine Tasse Tee, aus der noch Dampf aufsteigt.", 5,
      "Du setzt dich ans Fenster. Draußen liegt das Meer, so weit du schauen kannst.", 3,
      "Die Sonne ist gerade untergegangen. Am Horizont glüht noch ein schmaler, orangefarbener Streifen.", 5,
      "Unten am Felsen rollen die Wellen heran. Sie heben sich, brechen sich weiß schäumend und ziehen sich mit einem langen Rauschen wieder zurück.", 4,
      "Heran. Und zurück. Heran. Und zurück.", 7,
      "Du trinkst einen Schluck Tee. Er schmeckt nach Honig und Kamille und wärmt dich von innen.", 5,
      "Über dir beginnt das große Licht sich zu drehen. Langsam, ganz gleichmäßig. Sein Strahl wandert über das dunkle Wasser, verschwindet und kommt wieder.", 5,
      "Weit draußen siehst du die Lichter eines Schiffes. Es zieht ruhig seine Bahn, sicher geleitet von diesem Licht.", 5,
      "Du denkst daran, dass dieser Turm schon seit über hundert Jahren hier steht. Er hat Stürme erlebt und stille Nächte wie diese. Und er steht immer noch. Fest und verlässlich.", 6,
      "Hier oben bist du ganz sicher.", 4,
      "Du stellst die Tasse ab und legst dich ins Bett. Die Decke ist schwer und warm. Die Kissen geben genau so nach, wie du es magst.", 6,
      "Durch das Fenster siehst du die ersten Sterne. Und jedes Mal, wenn der Lichtstrahl vorbeizieht, schimmert die Zimmerdecke für einen Moment golden.", 6,
      "Das Meer rauscht. Das Licht kreist. Dein Atem wird langsam und tief.", 8,
      "Heran. Und zurück.", 6,
      "Der Leuchtturm hält Wache, die ganze Nacht. Du musst nichts mehr tun.", 6,
      "Du darfst einfach schlafen.", 6,
      "Gute Nacht."
    ]
  },
  {
    id: "gs-huette", cat: "geschichten", type: "voice", sound: "feuer",
    title: "Die Hütte im Schnee",
    desc: "Draußen fällt leise Schnee, drinnen knistert das Feuer im Ofen.",
    script: [
      "Mach es dir gemütlich. Spüre, wie warm es unter deiner Decke ist.", 4,
      "In dieser Geschichte bist du in einer kleinen Holzhütte in den Bergen.", 3,
      "Es ist Abend. Draußen ist es schon dunkel, und es schneit. Dicke, weiche Flocken fallen ganz langsam vom Himmel.", 4,
      "Du hast einen langen Tag draußen verbracht. Deine Wangen sind noch ein bisschen rot von der Kälte, aber jetzt bist du im Warmen.", 4,
      "Im Ofen brennt ein Feuer. Die Holzscheite knacken und knistern, und das Licht der Flammen tanzt über die Wände aus Zirbenholz.", 5,
      "Es riecht nach Holz, nach Harz und ein wenig nach Bratäpfeln.", 4,
      "Du sitzt in einem tiefen Sessel direkt neben dem Ofen. Über deinen Knien liegt eine karierte Wolldecke. Deine Füße stecken in dicken Socken.", 5,
      "Am Fenster bilden sich kleine Eisblumen. Dahinter siehst du, wie der Schnee im Schein der Laterne glitzert.", 5,
      "Alles draußen wird still. Der Schnee dämpft jedes Geräusch. Kein Auto, keine Stimmen. Nur das leise Rieseln der Flocken.", 6,
      "Du legst noch ein Holzscheit nach. Die Glut flammt kurz auf, dann brennt das Feuer wieder ruhig und gleichmäßig.", 5,
      "Auf dem Ofen steht ein Topf mit heißer Milch. Du gießt dir eine Tasse ein und hältst sie mit beiden Händen. Die Wärme zieht in deine Finger, dann in deine Arme.", 6,
      "Draußen ist die Welt weiß und weich geworden. Die Tannen tragen Mützen aus Schnee. Die Berge ruhen.", 5,
      "Und auch du darfst jetzt ruhen.", 4,
      "Du stellst die Tasse ab, ziehst die Decke bis zum Kinn und lehnst den Kopf an die Sessellehne.", 5,
      "Das Feuer knistert. Mal leiser, mal etwas lauter. Wie ein Freund, der neben dir sitzt und einfach da ist.", 6,
      "Deine Augen werden schwer. Die Flammen verschwimmen zu einem warmen, goldenen Schimmer.", 6,
      "Draußen fällt der Schnee. Flocke für Flocke. Ganz langsam.", 8,
      "Du bist warm. Du bist geborgen. Die Nacht ist lang und ruhig.", 6,
      "Schlaf gut."
    ]
  },
  {
    id: "gs-gewaechshaus", cat: "geschichten", type: "voice", sound: "regen",
    title: "Regen im Gewächshaus",
    desc: "Tropfen auf dem Glasdach, Duft von nasser Erde und ein Korbsessel zwischen Pflanzen.",
    script: [
      "Lass deinen Körper schwer werden und atme ein paar Mal ruhig ein und aus.", 5,
      "Stell dir einen alten Garten vor, an einem Sommerabend. Am Ende des Gartens steht ein Gewächshaus aus Glas und weiß gestrichenem Holz.", 4,
      "Gerade fängt es an zu regnen. Ein warmer, sanfter Sommerregen.", 3,
      "Du öffnest die Glastür und trittst ein. Drinnen ist es warm und ein bisschen feucht. Es riecht nach Tomatenblättern, nach Basilikum und nach Erde.", 5,
      "Überall stehen Pflanzen. Große Farne, Töpfe mit Kräutern, ein Zitronenbäumchen mit kleinen grünen Früchten.", 4,
      "Zwischen den Pflanzen steht ein alter Korbsessel mit einem dicken Kissen. Du setzt dich hinein und ziehst die Beine an.", 5,
      "Über dir trommelt der Regen auf das Glasdach. Tausend kleine Tropfen. Kein Tropfen klingt wie der andere, und doch klingt alles zusammen wie ein ruhiges, gleichmäßiges Rauschen.", 6,
      "An den Scheiben laufen Rinnsale herab. Sie suchen sich ihren Weg, verbinden sich, trennen sich wieder.", 5,
      "Du schaust ihnen zu. Ohne zu denken. Nur schauen.", 6,
      "Draußen wird der Garten dunkler. Die Rosen neigen ihre Köpfe unter dem Gewicht der Tropfen. Die Erde trinkt.", 5,
      "Alles darf jetzt wachsen, ganz ohne Mühe. Der Regen sorgt für alles.", 5,
      "Auf einem Regal steht eine kleine Laterne. Ihr warmes Licht spiegelt sich in den nassen Scheiben.", 4,
      "Eine Katze kommt durch die angelehnte Tür, schüttelt die Pfoten und springt zu dir auf den Schoß. Sie dreht sich zweimal im Kreis, rollt sich zusammen und beginnt zu schnurren.", 6,
      "Ihr Körper ist warm. Ihr Schnurren vermischt sich mit dem Rauschen des Regens.", 6,
      "Du legst eine Hand auf ihr weiches Fell und spürst, wie sie langsam atmet. Ein und aus.", 5,
      "Dein eigener Atem passt sich an. Langsam. Ruhig.", 8,
      "Der Regen trommelt weiter. Mal etwas stärker, dann wieder ganz sacht.", 6,
      "Deine Augen fallen zu. Du bist trocken und warm, mitten im Regen.", 6,
      "Alles ist gut, so wie es ist.", 6,
      "Gute Nacht."
    ]
  },
  {
    id: "gs-sternengarten", cat: "geschichten", type: "voice", sound: "nacht",
    title: "Der Sternengarten",
    desc: "Eine fantasievolle Geschichte über einen Garten, in dem nachts die Sterne wachsen.",
    script: [
      "Mach es dir bequem und schließe die Augen.", 4,
      "Es war einmal ein Garten, der nur nachts zu finden war.", 3,
      "Er lag hinter einer niedrigen Mauer aus Feldsteinen, am Ende eines Weges, den man nur sieht, wenn der Mond scheint.", 4,
      "Heute Nacht scheint der Mond. Und so findest du den Weg.", 4,
      "Ein kleines Holztor öffnet sich ganz von allein, als du davorstehst.", 3,
      "Dahinter liegt eine Wiese mit hohem, silbrigem Gras. Grillen zirpen. Die Luft ist warm und duftet nach Lavendel und Heu.", 5,
      "Zwischen den Gräsern wachsen Blumen, die du noch nie gesehen hast. Ihre Blüten sind geschlossen, wie kleine Laternen aus Papier.", 4,
      "In der Mitte der Wiese steht eine alte Gärtnerin mit einer Gießkanne. Sie lächelt dir zu, als hätte sie dich erwartet.", 4,
      "„Hier wachsen die Sterne“, sagt sie leise. „Jede Nacht ein paar neue. Möchtest du helfen?“", 4,
      "Sie reicht dir die Gießkanne. Sie ist leicht, und das Wasser darin schimmert wie flüssiges Mondlicht.", 4,
      "Du gehst langsam zwischen den Blumen hindurch und gießt jede einzelne. Ganz behutsam.", 5,
      "Und wo das Wasser die Erde berührt, öffnen sich die Blüten. In jeder liegt ein winziges Licht. Erst ganz schwach, dann immer heller.", 6,
      "Die Lichter lösen sich aus den Blüten und schweben nach oben. Langsam, ohne Eile. Immer höher, bis sie ihren Platz am Himmel finden.", 6,
      "Du schaust ihnen nach. Ein Stern. Und noch einer. Und noch einer.", 8,
      "Als die Kanne leer ist, setzt du dich ins weiche Gras. Die Gärtnerin setzt sich neben dich.", 4,
      "„Weißt du“, sagt sie, „die Sterne leuchten am schönsten, wenn jemand unter ihnen schläft.“", 5,
      "Du legst dich zurück. Das Gras ist warm und duftet. Über dir funkelt ein Himmel voller Sterne, und einige davon hast du heute selbst gepflanzt.", 6,
      "Die Grillen singen leiser. Die Blumen schließen sich wieder. Der Garten atmet ruhig.", 6,
      "Deine Augen werden schwer. Die Sterne verschwimmen zu einem sanften, silbernen Schimmer.", 6,
      "Und während du einschläfst, wacht der Garten über dich. Die ganze Nacht.", 6,
      "Schlaf gut."
    ]
  },

  /* ---------------- KLÄNGE ---------------- */
  { id: "kl-regen", cat: "klaenge", type: "sound", sound: "regen", title: "Sanfter Regen", desc: "Gleichmäßiger Sommerregen." },
  { id: "kl-meer", cat: "klaenge", type: "sound", sound: "meer", title: "Meeresrauschen", desc: "Wellen, die langsam kommen und gehen." },
  { id: "kl-wind", cat: "klaenge", type: "sound", sound: "wind", title: "Wind in den Bäumen", desc: "Ein ruhiger, auf- und abschwellender Wind." },
  { id: "kl-feuer", cat: "klaenge", type: "sound", sound: "feuer", title: "Kaminfeuer", desc: "Knisternde Holzscheite und tiefe Glut." },
  { id: "kl-bach", cat: "klaenge", type: "sound", sound: "bach", title: "Bachlauf", desc: "Plätscherndes Wasser über Kiesel." },
  { id: "kl-nacht", cat: "klaenge", type: "sound", sound: "nacht", title: "Sommernacht", desc: "Grillen und ein leiser Abendwind." },
  { id: "kl-braun", cat: "klaenge", type: "sound", sound: "braun", title: "Tiefes Rauschen", desc: "Braunes Rauschen. Weich und dunkel, deckt Störgeräusche ab." }
];
