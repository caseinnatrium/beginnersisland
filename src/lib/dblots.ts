import * as cheerio from 'cheerio';

export interface DblotsPlayer {
  name: string;
  url: string;

  level: number | null;
  kiLevel: number | null;
  race: string | null;
  status: string | null;

  healthPoints: number | null;
  kiPoints: number | null;
  strength: number | null;
  trainPoints: number | null;
  swordFighting: number | null;
  attackSpeed: number | null;
  kiBlasting: number | null;
  defence: number | null;
  energy: number | null;

  creationDate: string | null;
  ageDays: number | null;

  lastLogin: string | null;
  daysSinceLastLogin: number | null;

  deaths: number;
}

const CHARACTER_NAMES = [
  'Ravo',
  'King Bravic',
  'Triceratops Hunter',
  'Mieczyslaw Czwarty',
  'Rokgard',
  'Aloniasty',
  'Dark Nevraseq',
  'Veggio',
  'Tathagata Sati',
  'Kayden',
  'Ryuk T',
  'Sarven',
  'Sleeper',
  'Temporal',
  'Raito',
  'Casein',
  'Nyxxa',
  'Nuucky',
  'Aizi',
  'Barbapapa',
  'Rooky',
  'Bardetta',
  'Dziren',
  'Goku Rokowiec',
  'Omega Nevraseq',
  'Ravo Jr',
  'Rooky Slayeer',
  'Dopamine',
  'Kill Terror',
  'Rook Terror',
  'Lotus Exige',
  'Saiga',
  'Yachiru',
  'Lysa Parowa',
  'Rook Master',
  'Nervusek',
  'Nervasemba',
  'Zajety Jr',
];

export const PLAYERS = CHARACTER_NAMES.map((name) => ({
  name,
  url: `http://dblots.org.pl/characters.php?lang=en&s=classic&char=${encodeURIComponent(
    name
  )}`,
}));

const CACHE_FILE = './.astro/dblots-cache.json';

interface CacheData {
  cachedAt: string;
  players: DblotsPlayer[];
}

function cleanText(value: string | undefined | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function numberValue(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const cleaned = value.replace(/,/g, '');
  const match = cleaned.match(/-?\d+/);

  return match ? Number(match[0]) : null;
}

function normalizeLabel(value: string): string {
  return cleanText(value)
    .replace(/:/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function getTableValue(
  $: cheerio.CheerioAPI,
  label: string
): string | null {
  const wanted = normalizeLabel(label);

  let result: string | null = null;

  $('.chartable tr').each((_, row) => {
    const cells = $(row).find('td');

    if (cells.length < 2) {
      return;
    }

    const firstCell = normalizeLabel($(cells[0]).text());

    if (firstCell !== wanted) {
      return;
    }

    const value = cleanText($(cells[1]).text());

    if (value) {
      result = value;
    }
  });

  return result;
}

function getStatisticsValue(
  $: cheerio.CheerioAPI,
  label: string
): string | null {
  const wanted = normalizeLabel(label);

  let result: string | null = null;

  $('.chartable tr').each((_, row) => {
    const cells = $(row).find('td');

    if (cells.length < 2) {
      return;
    }

    cells.each((index, cell) => {
      if (index >= cells.length - 1) {
        return;
      }

      const cellLabel = normalizeLabel($(cell).text());

      if (cellLabel !== wanted) {
        return;
      }

      const value = cleanText(cells.eq(index + 1).text());

      if (value) {
        result = value;
      }
    });
  });

  return result;
}

function getRace($: cheerio.CheerioAPI): string | null {
  let race: string | null = null;

  $('.chartable tr').each((_, row) => {
    const cells = $(row).find('td');

    if (cells.length < 2) {
      return;
    }

    const label = normalizeLabel($(cells[0]).text());

    if (label !== 'race') {
      return;
    }

    const image = $(cells[1]).find('img').first();

    if (!image.length) {
      return;
    }

    const src = image.attr('src');

    if (!src) {
      return;
    }

    const cleanSrc = src.split('?')[0].split('#')[0];

    const filename = cleanSrc.split('/').pop();

    if (!filename) {
      return;
    }

    const raceName = filename
      .replace(/\.[^/.]+$/, '')
      .trim();

    if (raceName) {
      race = raceName;
    }
  });

  return race;
}

function parseDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  if (value.toLowerCase().includes('unknown')) {
    return null;
  }

  const cleaned = value
    .replace(/(\d+)(st|nd|rd|th)/gi, '$1')
    .trim();

  const parsed = new Date(cleaned);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function calculateAgeDays(
  creationDate: string | null
): number | null {
  const date = parseDate(creationDate);

  if (!date) {
    return null;
  }

  const difference = Date.now() - date.getTime();

  if (difference < 0) {
    return 0;
  }

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );
}

function calculateDaysSinceLastLogin(
  lastLogin: string | null
): number | null {
  const date = parseDate(lastLogin);

  if (!date) {
    return null;
  }

  const difference = Date.now() - date.getTime();

  if (difference < 0) {
    return 0;
  }

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );
}

function countDeaths($: cheerio.CheerioAPI): number {
  let deaths = 0;

  $('.chartable').each((_, table) => {
    const heading = cleanText(
      $(table).find('tr').first().text()
    );

    if (heading.toLowerCase().includes('deaths')) {
      deaths = $(table).find('tr').length - 1;
    }
  });

  return Math.max(deaths, 0);
}

export async function scrapePlayer(
  player: (typeof PLAYERS)[number]
): Promise<DblotsPlayer> {
  console.log(`Fetching DBLots player: ${player.name}`);

  const response = await fetch(player.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 DBLots Fansite Hiscores',
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${player.name}: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();

  if (!html.trim()) {
    throw new Error(`Empty response for ${player.name}`);
  }

  const $ = cheerio.load(html);

  if ($('.chartable').length === 0) {
    throw new Error(
      `No character data found for ${player.name}`
    );
  }

  const level = getTableValue($, 'Level');
  const kiLevel = getTableValue($, 'Ki Level');
  const race = getRace($);
  const status = getTableValue($, 'Status');
  const creationDate = getTableValue($, 'Creation date');
  const lastLogin = getTableValue($, 'Last login');

  const playerData: DblotsPlayer = {
    name: player.name,
    url: player.url,

    level: numberValue(level),
    kiLevel: numberValue(kiLevel),
    race,
    status,

    healthPoints: numberValue(
      getStatisticsValue($, 'Health Points')
    ),

    kiPoints: numberValue(
      getStatisticsValue($, 'Ki Points')
    ),

    strength: numberValue(
      getStatisticsValue($, 'Strength')
    ),

    trainPoints: numberValue(
      getStatisticsValue($, 'Train Points')
    ),

    swordFighting: numberValue(
      getStatisticsValue($, 'Sword Fighting')
    ),

    attackSpeed: numberValue(
      getStatisticsValue($, 'Attack Speed')
    ),

    kiBlasting: numberValue(
      getStatisticsValue($, 'Ki Blasting')
    ),

    defence: numberValue(
      getStatisticsValue($, 'Defense')
    ),

    energy: numberValue(
      getStatisticsValue($, 'Energy')
    ),

    creationDate,

    ageDays: calculateAgeDays(creationDate),

    lastLogin,

    daysSinceLastLogin:
      calculateDaysSinceLastLogin(lastLogin),

    deaths: countDeaths($),
  };

  return playerData;
}

function hasUsefulPlayerData(
  player: DblotsPlayer | null | undefined
): boolean {
  if (!player) {
    return false;
  }

  return (
    player.level !== null ||
    player.kiLevel !== null ||
    player.race !== null ||
    player.defence !== null ||
    player.healthPoints !== null ||
    player.kiPoints !== null
  );
}

async function readCache(): Promise<CacheData | null> {
  try {
    const fs = await import('node:fs/promises');

    const data = await fs.readFile(
      CACHE_FILE,
      'utf8'
    );

    const parsed = JSON.parse(data) as CacheData;

    if (
      !parsed ||
      !Array.isArray(parsed.players)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getUniquePlayers() {
  const seen = new Set<string>();

  return PLAYERS.filter((player) => {
    const key = player.name.trim().toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

/*
 * IMPORTANT:
 *
 * This function is now the normal function used by the site.
 *
 * It reads the committed cache.
 *
 * It DOES NOT scrape DBLots when somebody visits the site.
 */
export async function getDblotsPlayers(): Promise<
  DblotsPlayer[]
> {
  const cache = await readCache();

  if (!cache) {
    console.error(
      'DBLots cache not found. Expected:',
      CACHE_FILE
    );

    return [];
  }

  console.log(
    `Using committed DBLots cache from ${cache.cachedAt}`
  );

  const configuredPlayers = getUniquePlayers();

  const cachedMap = new Map<string, DblotsPlayer>();

  for (const player of cache.players) {
    if (hasUsefulPlayerData(player)) {
      cachedMap.set(
        player.name.trim().toLowerCase(),
        player
      );
    }
  }

  return configuredPlayers
    .map((configured) => {
      const cached = cachedMap.get(
        configured.name.trim().toLowerCase()
      );

      if (!cached) {
        return null;
      }

      return {
        ...cached,
        name: configured.name,
        url: configured.url,
      };
    })
    .filter(
      (player): player is DblotsPlayer =>
        player !== null
    );
}
