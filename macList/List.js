const raw = `
Sivasspor 5 Giresunspor 0
Alanyaspor 0 Başakşehir 1
Hatayspor 3 Gaziantep FK 1
İstanbulspor 3 Karagümrük 0
Alanyaspor 1 Hatayspor 3
Hatayspor 5 Başakşehir 4
Kayserispor 2 Başakşehir 0
Karagümrük 3 Adana Demirspor 2
Ümraniyespor 2 Başakşehir 4
Eskişehirspor 0 Konyaspor 0
Gaziantep FK 3 Antalyaspor 2
Alanyaspor 0 Adana Demirspor 5
Konyaspor 2 Sakaryaspor 2
Adana Demirspor 3 Alanyaspor 0
Giresunspor 3 Konyaspor 0
Bursaspor 2 Gaziantep FK 1
Eskişehirspor 3 Sakaryaspor 3
Sivasspor 2 Başakşehir 2
Trabzonspor 5 Başakşehir 0
İstanbulspor 3 Antalyaspor 3
Trabzonspor 2 Gaziantep FK 0
Giresunspor 4 Başakşehir 1
Başakşehir 3 Beşiktaş 3
Alanyaspor 0 Bursaspor 1
Gaziantep FK 4 Beşiktaş 0
Antalyaspor 0 Giresunspor 5
Alanyaspor 2 Beşiktaş 4
Sivasspor 5 Giresunspor 0
Bursaspor 4 Trabzonspor 4
Karagümrük 1 Hatayspor 5
Trabzonspor 2 Sivasspor 0
İstanbulspor 5 Alanyaspor 5
Trabzonspor 0 Sakaryaspor 1
Beşiktaş 2 Gaziantep FK 5
Sakaryaspor 5 Adana Demirspor 0
Konyaspor 1 Hatayspor 3
Sivasspor 0 Trabzonspor 1
Giresunspor 2 Adana Demirspor 4
Gaziantep FK 0 Fenerbahçe 3
Antalyaspor 3 İstanbulspor 2
Karagümrük 3 Başakşehir 5
Adana Demirspor 0 Galatasaray 1
Alanyaspor 0 Karagümrük 3
Ümraniyespor 2 Giresunspor 2
Giresunspor 1 Gaziantep FK 2
Trabzonspor 1 Kayserispor 5
Adana Demirspor 2 Konyaspor 2
Beşiktaş 3 Antalyaspor 1
Hatayspor 0 Adana Demirspor 5
İstanbulspor 5 Galatasaray 5
`.trim();


function parseMatches(rawStr) {
  return rawStr.split(/\n/).map((line) => {
    const [, home, hStr, away, aStr] = line.match(/^(.*?)\s+(\d+)\s+(.*?)\s+(\d+)$/);
    return {
      home,
      away,
      h: +hStr,
      a: +aStr,
    };
  });
}

function buildStandings(matches) {
  const stats = {};
  const ensure = t => (stats[t] ||= { O: 0, G: 0, B: 0, M: 0, A: 0, Y: 0 });

  matches.forEach(({ home, away, h, a }) => {
    ensure(home);
    ensure(away);

   
    stats[home].O++;
    stats[away].O++;

   
    stats[home].A += h;
    stats[home].Y += a;
    stats[away].A += a;
    stats[away].Y += h;

  
    if (h > a) {
      stats[home].G++;
      stats[away].M++;
    } else if (h < a) {
      stats[away].G++;
      stats[home].M++;
    } else {
      stats[home].B++;
      stats[away].B++;
    }
  });
  return stats;
}

function standingsToArray(stats) {
  return Object.entries(stats)
    .map(([Team, s]) => ({
      Team,
      ...s,
      AV: s.A - s.Y,
      P: s.G * 3 + s.B,
    }))
    .sort((a, b) => b.P - a.P || b.AV - a.AV || b.A - a.A)
    .map((row, i) => ({ Pos: i + 1, ...row }));
}


function printStandings(table) {
  console.log("\n===== PUAN DURUMU =====");
  console.table(table);
  console.log("\nO: Oynanan | G: Galibiyet | B: Beraberlik | M: Mağlubiyet");
  console.log("A: Attığı Gol | Y: Yediği Gol | AV: Averaj | P: Puan\n");
}

function run(rawStr) {
  const matches = parseMatches(rawStr);
  const standingsObj = buildStandings(matches);
  const table = standingsToArray(standingsObj);

  printStandings(table);
}

run(raw);