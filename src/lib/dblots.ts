// src/lib/dblots.ts

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

/*
 * ============================================================
 * CHARACTERS
 * ============================================================
 *
 * To add a character, ONLY add their name here.
 *
 * Example:
 *
 *   'Goku',
 *   'Vegeta',
 *   'Some New Player',
 *
 * The URL is generated automatically.
 *
 * IMPORTANT:
 * Do not add the same character twice.
 */

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
  'Veggio',
  'Dopamine',
  'Kill Terror',
  'Rook Terror',
  'Lotus Exige',
  'Saiga',
  'Yachiru',
  'Lysa Parowa',
  'Rook Master',
  "Dopamine",
  "Dziren",
  "Goku Rokowiec",
  "Nervusek",
  "Nervasemba",
  "Zajety Jr"


];

/*
 * Automatically build the DBLots character URLs.
 */
export const PLAYERS = CHARACTER_NAMES.map((name) => ({
  name,
  url: `http://dblots.org.pl/characters.php?lang=en&s=classic&char=${encodeURIComponent(
    name
  )}`,
}));

/*
 * ============================================================
 * CACHE
 * ============================================================
 *
 * The cache is valid for one calendar day.
 *
 * Example:
 *
 *   Fetch at 14:00 Monday
 *   -> cached until midnight
 *
 *   After midnight Tuesday
 *   -> data is fetched again
 *
 * New characters are handled separately:
 * if a character is added to CHARACTER_NAMES and is not already
 * present in the cache, only that character needs to be fetched.
 *
 * Most importantly:
 *
 *   - failed requests are NOT saved as null players
 *   - successful old cache entries are preserved
 *   - a timeout for one character does not destroy the cache
 *   - adding a new character does not invalidate everybody
 */

const CACHE_FILE = './.astro/dblots-cache.json';

function getStartOfToday(): number {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).getTime();
}

function isCacheFromToday(timestamp: number): boolean {
  return timestamp >= getStartOfToday();
}

/*
 * ============================================================
 * TEXT / NUMBER HELPERS
 * ============================================================
 */

function cleanText(
  value: string | undefined | null
): string {
  return (value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function numberValue(
  value: string | null
): number | null {
  if (!value) {
    return null;
  }

  const cleaned = value.replace(/,/g, '');

  const match = cleaned.match(/-?\d+/);

  return match ? Number(match[0]) : null;
}

/*
 * ============================================================
 * TABLE PARSING
 * ============================================================
 *
 * Handles rows such as:
 *
 * <tr>
 *   <td class="chartd2"><b>Ki Level:</b></td>
 *   <td class="chartd2">98</td>
 * </tr>
 *
 * and:
 *
 * <tr>
 *   <td class="chartd1"><b>Defense:</b></td>
 *   <td class="chartd1" style="width: 280px;">113</td>
 * </tr>
 */

function normalizeLabel(
  value: string
): string {
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

    const firstCell = normalizeLabel(
      $(cells[0]).text()
    );

    if (firstCell !== wanted) {
      return;
    }

    const value = cleanText(
      $(cells[1]).text()
    );

    if (value) {
      result = value;
    }
  });

  return result;
}

/*
 * Some DBLots tables can have the label and value in
 * different positions, so this is a more flexible fallback.
 */
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

      const cellLabel = normalizeLabel(
        $(cell).text()
      );

      if (cellLabel !== wanted) {
        return;
      }

      const nextCell = cells.eq(index + 1);

      const value = cleanText(
        nextCell.text()
      );

      if (value) {
        result = value;
      }
    });
  });

  return result;
}

/*
 * ============================================================
 * RACE
 * ============================================================
 *
 * DBLots stores race as an image:
 *
 * <img
 *   src="pictures/races/Brolly.png"
 *   title="Brolly"
 * >
 *
 * We intentionally use the filename.
 *
 * Brolly.png -> Brolly
 *
 * This avoids incorrect text parsing and does not depend on
 * whatever text happens to be around the image.
 */

function getRace(
  $: cheerio.CheerioAPI
): string | null {
  let race: string | null = null;

  $('.chartable tr').each((_, row) => {
    const cells = $(row).find('td');

    if (cells.length < 2) {
      return;
    }

    const label = normalizeLabel(
      $(cells[0]).text()
    );

    if (label !== 'race') {
      return;
    }

    const image = $(cells[1])
      .find('img')
      .first();

    if (!image.length) {
      return;
    }

    const src = image.attr('src');

    if (!src) {
      return;
    }

    /*
     * Handle:
     *
     * pictures/races/Brolly.png
     * /pictures/races/Brolly.png
     * http://dblots.org.pl/pictures/races/Brolly.png
     * pictures/races/Brolly.png?x=123
     */

    const cleanSrc = src
      .split('?')[0]
      .split('#')[0];

    const filename = cleanSrc
      .split('/')
      .pop();

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

/*
 * ============================================================
 * DATES
 * ============================================================
 */

function parseDate(
  value: string | null
): Date | null {
  if (!value) {
    return null;
  }

  if (
    value
      .toLowerCase()
      .includes('unknown')
  ) {
    return null;
  }

  /*
   * DBLots example:
   *
   * 4th August 2025 21:03:28
   *
   * Convert:
   *
   * 4th -> 4
   */
  const cleaned = value
    .replace(
      /(\d+)(st|nd|rd|th)/gi,
      '$1'
    )
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

  const difference =
    Date.now() - date.getTime();

  if (difference < 0) {
    return 0;
  }

  return Math.floor(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

function calculateDaysSinceLastLogin(
  lastLogin: string | null
): number | null {
  const date = parseDate(lastLogin);

  if (!date) {
    return null;
  }

  const difference =
    Date.now() - date.getTime();

  if (difference < 0) {
    return 0;
  }

  return Math.floor(
    difference /
      (1000 * 60 * 60 * 24)
  );
}

/*
 * ============================================================
 * DEATHS
 * ============================================================
 */

function countDeaths(
  $: cheerio.CheerioAPI
): number {
  let deaths = 0;

  $('.chartable').each((_, table) => {
    const heading = cleanText(
      $(table)
        .find('tr')
        .first()
        .text()
    );

    if (
      heading
        .toLowerCase()
        .includes('deaths')
    ) {
      deaths =
        $(table).find('tr').length - 1;
    }
  });

  return Math.max(deaths, 0);
}

/*
 * ============================================================
 * SCRAPER
 * ============================================================
 */

export async function scrapePlayer(
  player: (typeof PLAYERS)[number]
): Promise<DblotsPlayer> {
  console.log(
    `Fetching DBLots player: ${player.name}`
  );

  const response = await fetch(
    player.url,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 DBLots Fansite Hiscores',
        Accept:
          'text/html,application/xhtml+xml',
      },

      signal: AbortSignal.timeout(
        10000
      ),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${player.name}: ${response.status} ${response.statusText}`
    );
  }

  const html =
    await response.text();

  if (!html.trim()) {
    throw new Error(
      `Empty response for ${player.name}`
    );
  }

  const $ =
    cheerio.load(html);

  /*
   * Basic sanity check.
   *
   * If DBLots returned an error page or some unexpected
   * content, do NOT create a cache entry full of nulls.
   */
  const hasCharacterData =
    $('.chartable').length > 0;

  if (!hasCharacterData) {
    throw new Error(
      `No character data found for ${player.name}`
    );
  }

  const level =
    getTableValue(
      $,
      'Level'
    );

  const kiLevel =
    getTableValue(
      $,
      'Ki Level'
    );

  const race =
    getRace($);

  const status =
    getTableValue(
      $,
      'Status'
    );

  const creationDate =
    getTableValue(
      $,
      'Creation date'
    );

  const lastLogin =
    getTableValue(
      $,
      'Last login'
    );

  /*
   * Defense is deliberately using "Defense" here.
   *
   * DBLots HTML example:
   *
   * <b>Defense:</b>
   * ...
   * 113
   */
  const defenceValue =
    getStatisticsValue(
      $,
      'Defense'
    );

  const playerData: DblotsPlayer = {
    name: player.name,
    url: player.url,

    level:
      numberValue(level),

    kiLevel:
      numberValue(kiLevel),

    race,

    status,

    healthPoints:
      numberValue(
        getStatisticsValue(
          $,
          'Health Points'
        )
      ),

    kiPoints:
      numberValue(
        getStatisticsValue(
          $,
          'Ki Points'
        )
      ),

    strength:
      numberValue(
        getStatisticsValue(
          $,
          'Strength'
        )
      ),

    trainPoints:
      numberValue(
        getStatisticsValue(
          $,
          'Train Points'
        )
      ),

    swordFighting:
      numberValue(
        getStatisticsValue(
          $,
          'Sword Fighting'
        )
      ),

    attackSpeed:
      numberValue(
        getStatisticsValue(
          $,
          'Attack Speed'
        )
      ),

    kiBlasting:
      numberValue(
        getStatisticsValue(
          $,
          'Ki Blasting'
        )
      ),

    defence:
      numberValue(
        defenceValue
      ),

    energy:
      numberValue(
        getStatisticsValue(
          $,
          'Energy'
        )
      ),

    creationDate,

    ageDays:
      calculateAgeDays(
        creationDate
      ),

    lastLogin,

    daysSinceLastLogin:
      calculateDaysSinceLastLogin(
        lastLogin
      ),

    deaths:
      countDeaths($),
  };

  /*
   * Log useful data so it is easy to see what DBLots returned.
   */
  console.log(
    `${player.name}:`,
    {
      race:
        playerData.race,
      level:
        playerData.level,
      kiLevel:
        playerData.kiLevel,
      defence:
        playerData.defence,
      ageDays:
        playerData.ageDays,
      daysSinceLastLogin:
        playerData.daysSinceLastLogin,
    }
  );

  return playerData;
}

/*
 * ============================================================
 * CACHE TYPES
 * ============================================================
 */

interface CacheData {
  timestamp: number;
  players: DblotsPlayer[];
}

/*
 * ============================================================
 * CACHE READ
 * ============================================================
 */

async function readCache(): Promise<CacheData | null> {
  try {
    const fs =
      await import(
        'node:fs/promises'
      );

    const data =
      await fs.readFile(
        CACHE_FILE,
        'utf8'
      );

    const parsed =
      JSON.parse(data) as CacheData;

    if (
      !parsed ||
      !Array.isArray(
        parsed.players
      )
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/*
 * ============================================================
 * CACHE WRITE
 * ============================================================
 */

async function writeCache(
  players: DblotsPlayer[]
): Promise<void> {
  try {
    const fs =
      await import(
        'node:fs/promises'
      );

    const path =
      await import(
        'node:path'
      );

    await fs.mkdir(
      path.dirname(CACHE_FILE),
      {
        recursive: true,
      }
    );

    const cache: CacheData = {
      /*
       * Cache timestamp represents the fetch/cache day.
       */
      timestamp:
        Date.now(),

      players,
    };

    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify(
        cache,
        null,
        2
      ),
      'utf8'
    );

    console.log(
      `DBLots cache saved: ${players.length} players`
    );
  } catch (error) {
    console.error(
      'Failed to write DBLots cache:',
      error
    );
  }
}

/*
 * ============================================================
 * CACHE HELPERS
 * ============================================================
 */

/*
 * A cached player is considered useful if we have at least
 * one important piece of actual character data.
 *
 * This prevents a failed HTTP request from becoming:
 *
 * {
 *   race: null,
 *   level: null,
 *   ...
 * }
 *
 * and replacing a previously good player.
 */
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

/*
 * Match cache entries by character name rather than array
 * position.
 *
 * This is what makes adding new characters safe.
 */
function getCachedPlayer(
  cachedPlayers: DblotsPlayer[],
  name: string
): DblotsPlayer | null {
  const wanted =
    name.trim().toLowerCase();

  const found =
    cachedPlayers.find(
      (player) =>
        player.name
          .trim()
          .toLowerCase() ===
        wanted
    );

  return hasUsefulPlayerData(
    found
  )
    ? found!
    : null;
}

/*
 * Remove duplicates from PLAYERS.
 *
 * This also protects the cache if the same name accidentally
 * gets added twice.
 */
function getUniquePlayers() {
  const seen =
    new Set<string>();

  return PLAYERS.filter(
    (player) => {
      const key =
        player.name
          .trim()
          .toLowerCase();

      if (seen.has(key)) {
        console.warn(
          `Duplicate DBLots character ignored: ${player.name}`
        );

        return false;
      }

      seen.add(key);

      return true;
    }
  );
}

/*
 * ============================================================
 * FETCH ALL
 * ============================================================
 */

async function fetchPlayers(
  playersToFetch: typeof PLAYERS
): Promise<DblotsPlayer[]> {
  if (
    playersToFetch.length === 0
  ) {
    return [];
  }

  console.log(
    `Fetching ${playersToFetch.length} DBLots player(s)...`
  );

  /*
   * Fetch concurrently, but a failure for one player does not
   * stop the others.
   */
  const results =
    await Promise.allSettled(
      playersToFetch.map(
        (player) =>
          scrapePlayer(player)
      )
    );

  const successful:
    DblotsPlayer[] = [];

  results.forEach(
    (result, index) => {
      const player =
        playersToFetch[index];

      if (
        result.status ===
        'fulfilled'
      ) {
        /*
         * Never cache a completely empty result.
         */
        if (
          hasUsefulPlayerData(
            result.value
          )
        ) {
          successful.push(
            result.value
          );
        } else {
          console.error(
            `Rejected empty DBLots data for ${player.name}`
          );
        }
      } else {
        console.error(
          `Failed to scrape ${player.name}:`,
          result.reason
        );
      }
    }
  );

  return successful;
}

/*
 * ============================================================
 * MERGE CACHE + NEW RESULTS
 * ============================================================
 *
 * Important:
 *
 * Old good data wins over failed/null data.
 *
 * New successful data replaces old data.
 *
 * A player that could not be fetched remains in the cache.
 */
function mergePlayers(
  configuredPlayers: typeof PLAYERS,
  oldPlayers: DblotsPlayer[],
  freshPlayers: DblotsPlayer[]
): DblotsPlayer[] {
  const freshMap =
    new Map<string, DblotsPlayer>();

  for (
    const player of freshPlayers
  ) {
    if (
      hasUsefulPlayerData(
        player
      )
    ) {
      freshMap.set(
        player.name
          .trim()
          .toLowerCase(),
        player
      );
    }
  }

  const oldMap =
    new Map<string, DblotsPlayer>();

  for (
    const player of oldPlayers
  ) {
    if (
      hasUsefulPlayerData(
        player
      )
    ) {
      oldMap.set(
        player.name
          .trim()
          .toLowerCase(),
        player
      );
    }
  }

  return configuredPlayers
    .map((configured) => {
      const key =
        configured.name
          .trim()
          .toLowerCase();

      /*
       * Fresh successful data has priority.
       */
      const fresh =
        freshMap.get(key);

      if (
        fresh &&
        hasUsefulPlayerData(
          fresh
        )
      ) {
        return fresh;
      }

      /*
       * If fetching failed, keep the old good data.
       */
      const old =
        oldMap.get(key);

      if (
        old &&
        hasUsefulPlayerData(
          old
        )
      ) {
        /*
         * Keep the configured URL/name in case the URL
         * ever changes.
         */
        return {
          ...old,
          name:
            configured.name,
          url:
            configured.url,
        };
      }

      /*
       * No usable data exists for this player.
       */
      return null;
    })
    .filter(
      (
        player
      ): player is DblotsPlayer =>
        player !== null
    );
}

/*
 * ============================================================
 * MAIN GETTER
 * ============================================================
 */

export async function getDblotsPlayers(): Promise<
  DblotsPlayer[]
> {
  const configuredPlayers =
    getUniquePlayers();

  const cache =
    await readCache();

  /*
   * ==========================================================
   * CACHE IS FROM TODAY
   * ==========================================================
   *
   * Normally return it immediately.
   *
   * BUT:
   *
   * If a character was added to CHARACTER_NAMES and is missing
   * from the cache, fetch only that character.
   *
   * This fixes the situation where:
   *
   *   - old characters are cached
   *   - you add Kayden
   *   - Kayden gets fetched
   *   - old characters do not need to be fetched again
   */
  if (
    cache &&
    isCacheFromToday(
      cache.timestamp
    )
  ) {
    const missingPlayers =
      configuredPlayers.filter(
        (player) =>
          !getCachedPlayer(
            cache.players,
            player.name
          )
      );

    /*
     * Everything is already cached.
     */
    if (
      missingPlayers.length === 0
    ) {
      console.log(
        `Using DBLots cache (${cache.players.length} players)`
      );

      return mergePlayers(
        configuredPlayers,
        cache.players,
        []
      );
    }

    /*
     * Only fetch characters that are not cached.
     */
    console.log(
      `DBLots cache is current. Fetching ${missingPlayers.length} new/missing character(s).`
    );

    const freshPlayers =
      await fetchPlayers(
        missingPlayers
      );

    const merged =
      mergePlayers(
        configuredPlayers,
        cache.players,
        freshPlayers
      );

    /*
     * Save the merged cache if we got at least one useful
     * result, or if the existing cache already had data.
     *
     * Failed new characters are NOT written as nulls.
     */
    if (
      merged.length > 0
    ) {
      await writeCache(
        merged
      );
    }

    return merged;
  }

  /*
   * ==========================================================
   * NEW DAY
   * ==========================================================
   *
   * Midnight has passed.
   *
   * Fetch all configured characters again.
   *
   * However, failed requests do NOT destroy yesterday's data.
   */
  console.log(
    'DBLots cache expired. Refreshing character data...'
  );

  const freshPlayers =
    await fetchPlayers(
      configuredPlayers
    );

  const oldPlayers =
    cache?.players ?? [];

  const merged =
    mergePlayers(
      configuredPlayers,
      oldPlayers,
      freshPlayers
    );

  /*
   * Always write a new cache when we have useful data.
   *
   * The merged result contains:
   *
   *   fresh successful players
   *   +
   *   old players whose requests failed
   *
   * It NEVER contains newly-created null entries.
   */
  if (
    merged.length > 0
  ) {
    await writeCache(
      merged
    );
  }

  /*
   * If absolutely nothing could be loaded and there is no
   * previous cache, return an empty list.
   */
  if (
    merged.length === 0
  ) {
    console.error(
      'No usable DBLots player data available.'
    );
  }

  return merged;
}