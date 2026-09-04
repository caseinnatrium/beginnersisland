/**
 * =========================================================
 * LOCAL MAP ASSETS
 * =========================================================
 */

import helperImage from '../assets/helper.png';
import platformQuestImage from '../assets/platformquest.png';
import axeImage from '../assets/axe.png';
import unagiImage from '../assets/unagi.png';
import brownChestImage from '../assets/brownchest.png';


/**
 * =========================================================
 * MAP TYPES
 * =========================================================
 */

export type MapLocationType =
  | 'npc'
  | 'monster'
  | 'item'
  | 'quest'
  | 'shop'
  | 'building'
  | 'entrance'
  | 'other';


export type MapFloor = {
  z: number;
  label: string;
  shortLabel: string;
  available: boolean;
};


export type MapLocation = {
  id: string;

  name: string;

  type: MapLocationType;

  x: number;

  y: number;

  z: number;

  image: string;

  imageAlt?: string;

  size?: number;

  href?: string;

  description?: string;
};


/**
 * =========================================================
 * FLOORS
 * =========================================================
 */

export const mapFloors: MapFloor[] = [
  {
    z: 4,
    label: 'Floor +4',
    shortLabel: '+4',
    available: true,
  },

  {
    z: 3,
    label: 'Floor +3',
    shortLabel: '+3',
    available: true,
  },

  {
    z: 2,
    label: 'Floor +2',
    shortLabel: '+2',
    available: true,
  },

  {
    z: 1,
    label: 'Floor +1',
    shortLabel: '+1',
    available: true,
  },

  {
    z: 0,
    label: 'Ground Floor',
    shortLabel: '0',
    available: true,
  },

  {
    z: -1,
    label: 'Floor -1',
    shortLabel: '-1',
    available: true,
  },
];


/**
 * =========================================================
 * MAP LOCATIONS
 * =========================================================
 */

export const mapLocations: MapLocation[] = [

  /* =======================================================
     EXISTING MONSTERS
  ======================================================= */

  {
    id: 'death-machine',
    name: 'Death Machine',
    type: 'monster',
    x: 38,
    y: 34,
    z: 2,
    image:
      'http://dblots.org.pl/pictures/monsters/death%20machine.png',
    imageAlt: 'Death Machine',
    size: 18,
    href: '/monsters/death-machine/',
    description:
      'A Death Machine that can be summoned on Beginners Island.',
  },

  {
    id: 'huge',
    name: 'Huge',
    type: 'monster',
    x: 50,
    y: 34,
    z: 2,
    image:
      'http://dblots.org.pl/pictures/monsters/huge.png',
    imageAlt: 'Huge',
    size: 18,
    href: '/monsters/huge/',
    description:
      'A Huge that can be reached on Beginners Island.',
  },


  /* =======================================================
     WOLVES - 4 PINS
  ======================================================= */

  {
    id: 'wolf-1',
    name: 'Wolf',
    type: 'monster',
    x: 24,
    y: 15,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/wolf.png',
    imageAlt: 'Wolf',
    size: 16,
    href: '/monsters/wolf/',
    description:
      'A Wolf found on Beginners Island.',
  },

  {
    id: 'wolf-2',
    name: 'Wolf',
    type: 'monster',
    x: 38,
    y: 19,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/wolf.png',
    imageAlt: 'Wolf',
    size: 18,
    href: '/monsters/wolf/',
    description:
      'A Wolf found on Beginners Island.',
  },

  {
    id: 'wolf-3',
    name: 'Wolf',
    type: 'monster',
    x: 18,
    y: 28,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/wolf.png',
    imageAlt: 'Wolf',
    size: 18,
    href: '/monsters/wolf/',
    description:
      'A Wolf found on Beginners Island.',
  },

  {
    id: 'wolf-4',
    name: 'Wolf',
    type: 'monster',
    x: 46,
    y: 30,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/wolf.png',
    imageAlt: 'Wolf',
    size: 18,
    href: '/monsters/wolf/',
    description:
      'Wolves can be found in an underground cave. They can multispawn if not killed.',
  },
    {
    id: 'wolf-4',
    name: 'Wolf',
    type: 'monster',
    x: 46,
    y: 33,
    z: 3,
    image:
      'http://dblots.org.pl/pictures/monsters/wolf.png',
    imageAlt: 'Wolf',
    size: 18,
    href: '/monsters/wolf/',
    description:
      'Wolves can be found on this floor alongside Tigermen.',
  },


  /* =======================================================
     TIGERMAN - 3 PINS
  ======================================================= */

  {
    id: 'tigerman-1',
    name: 'Tigerman',
    type: 'monster',
    x: 48,
    y: 45,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/tigerman.png',
    imageAlt: 'Tigerman',
    size: 18,
    href: '/monsters/tigerman/',
    description:
      'A Tigerman found on Beginners Island.',
  },

  {
    id: 'tigerman-2',
    name: 'Tigerman',
    type: 'monster',
    x: 48,
    y: 38,
    z: 1,
    image:
      'http://dblots.org.pl/pictures/monsters/tigerman.png',
    imageAlt: 'Tigerman',
    size: 18,
    href: '/monsters/tigerman/',
    description:
      'A Tigerman found on Beginners Island.',
  },

  {
    id: 'tigerman-3',
    name: 'Tigerman',
    type: 'monster',
    x: 50,
    y: 46,
    z: 2,
    image:
      'http://dblots.org.pl/pictures/monsters/tigerman.png',
    imageAlt: 'Tigerman',
    size: 18,
    href: '/monsters/tigerman/',
    description:
      'Three Tigermen guard a chest on this floor.',
  },
    {
    id: 'tigerman-4',
    name: 'Tigerman',
    type: 'monster',
    x: 46,
    y: 42,
    z: 3,
    image:
      'http://dblots.org.pl/pictures/monsters/tigerman.png',
    imageAlt: 'Tigerman',
    size: 18,
    href: '/monsters/tigerman/',
    description:
      'Multiple Tigermen are on this floor.',
  },


  /* =======================================================
     PANDORIAN - 2 PINS
  ======================================================= */

  {
    id: 'pandorian-1',
    name: 'Pandorian',
    type: 'monster',
    x: 14,
    y: 5,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/pandorian.png',
    imageAlt: 'Pandorian',
    size: 12,
    href: '/monsters/pandorian/',
    description:
      'A Pandorian found on Beginners Island.',
  },

  {
    id: 'pandorian-2',
    name: 'Pandorian',
    type: 'monster',
    x: 13,
    y: 9,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/pandorian.png',
    imageAlt: 'Pandorian',
    size: 12,
    href: '/monsters/pandorian/',
    description:
      'A Pandorian found on Beginners Island.',
  },


  /* =======================================================
     BANDIT - 2 PINS
  ======================================================= */

  {
    id: 'bandit-1',
    name: 'Bandit',
    type: 'monster',
    x: 52,
    y: 39,
    z: 4,
    image:
      'http://dblots.org.pl/pictures/monsters/bandit.png',
    imageAlt: 'Bandit',
    size: 12,
    href: '/monsters/bandit/',
    description:
      'A Bandit found on Beginners Island.',
  },

  {
    id: 'bandit-2',
    name: 'Bandit',
    type: 'monster',
    x: 49,
    y: 39,
    z: 4,
    image:
      'http://dblots.org.pl/pictures/monsters/bandit.png',
    imageAlt: 'Bandit',
    size: 12,
    href: '/monsters/bandit/',
    description:
      'A Bandit found on Beginners Island.',
  },


  /* =======================================================
     COMMANDO - 1 PIN
  ======================================================= */

  {
    id: 'commando-1',
    name: 'Commando',
    type: 'monster',
    x: 50,
    y: 38,
    z: 4,
    image:
      'http://dblots.org.pl/pictures/monsters/commando.png',
    imageAlt: 'Commando',
    size: 12,
    href: '/monsters/commando/',
    description:
      'A Commando found on Beginners Island.',
  },


  /* =======================================================
     TRICERATOPS - 7 PINS
  ======================================================= */

  {
    id: 'triceratops-1',
    name: 'Triceratops',
    type: 'monster',
    x: 65,
    y: 32,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },

  {
    id: 'triceratops-2',
    name: 'Triceratops',
    type: 'monster',
    x: 68,
    y: 27,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },

  {
    id: 'triceratops-3',
    name: 'Triceratops',
    type: 'monster',
    x: 58,
    y: 27,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },

  {
    id: 'triceratops-4',
    name: 'Triceratops',
    type: 'monster',
    x: 62,
    y: 30,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },

  {
    id: 'triceratops-5',
    name: 'Triceratops',
    type: 'monster',
    x: 60,
    y: 32,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },

  {
    id: 'triceratops-6',
    name: 'Triceratops',
    type: 'monster',
    x: 65,
    y: 27,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },

  {
    id: 'triceratops-7',
    name: 'Triceratops',
    type: 'monster',
    x: 62,
    y: 25,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/monsters/triceratops.png',
    imageAlt: 'Triceratops',
    size: 12,
    href: '/monsters/triceratops/',
    description:
      'A Triceratops found on Beginners Island.',
  },


  /* =======================================================
     NPC
  ======================================================= */

  {
    id: 'helper',
    name: 'Helper',
    type: 'npc',
    x: 30,
    y: 52,
    z: 0,
    image:
      helperImage.src,
    imageAlt: 'Helper',
    size: 18,
    href: '/npcs/helper/',
    description:
      'A helpful NPC found on Beginners Island.',
  },


  /* =======================================================
     ITEMS
  ======================================================= */

  {
    id: 'fishingrod',
    name: 'Fishing Rod',
    type: 'item',
    x: 5,
    y: 13,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/items/fishing%20rod.png',
    imageAlt: 'Fishing Rod',
    size: 12,
    href: '/items/fishingrod/',
    description:
      'Appears on Beginners Island after each server restart. Can be used to fish in the water.',
  },
  {
    id: 'greatmeat',
    name: 'Great Meats',
    type: 'item',
    x: 57,
    y: 36,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/items/great%20meat.png',
    imageAlt: 'Great Meat',
    size: 12,
    href: '/items/greatmeat/',
    description:
      '5 pieces of great meat that appear on Beginners Island after each server restart.',
  },
    {
    id: 'scissors',
    name: 'Scissors',
    type: 'item',
    x: 14,
    y: 37,
    z: 0,
    image:
      'http://dblots.pl/images/accmaker/pictures/items/scissors.png',
    imageAlt: 'Scissors',
    size: 12,
    href: '/items/scissors/',
    description:
      'Appear after each server save. You will have to burn some bushes to obtain it.',
  },
  {
    id: 'essenceoffire',
    name: 'Essence of Fire',
    type: 'item',
    x: 50,
    y: 44,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/items/essence%20of%20fire.png',
    imageAlt: 'Essence of Fire',
    size: 12,
    href: '/items/essenceoffire/',
    description:
      'Appears on Beginners Island after each server restart. Click on the bonfire to collect it. Can be used to light up the torches.',
  },

  {
    id: 'trunkssword',
    name: 'Trunks Sword',
    type: 'item',
    x: 43,
    y: 32,
    z: 1,
    image:
      'http://dblots.org.pl/pictures/items/trunks%20sword.png',
    imageAlt: 'Trunks Sword',
    size: 12,
    href: '/equipment/swords/trunkssword/',
    description:
      'Appears on Beginners Island after each server restart. To get to it you have to complete the Trunks Sword puzzle.',
  },

  {
    id: 'axe',
    name: 'Axe',
    type: 'item',
    x: 50,
    y: 37,
    z: 4,
    image:
      axeImage.src,
    imageAlt: 'Axe',
    size: 12,
    href: '/items/axe/',
    description:
      'Three axes can be found on Beginners Island after each server restart. They can be used to chop down some trees.',
  },

  {
    id: 'unagi',
    name: 'Unagi',
    type: 'item',
    x: 47,
    y: 34,
    z: 2,
    image:
      unagiImage.src,
    imageAlt: 'Unagi',
    size: 10,
    href: '/items/unagi/',
    description:
      'Unagi can be found on Beginners Island after each server restart on a small table next to Huge.',
  },

  {
    id: 'brownchest-1',
    name: 'Brown Chest',
    type: 'quest',
    x: 5,
    y: 15,
    z: 0,
    image:
      brownChestImage.src,
    imageAlt: 'Quest Chest',
    size: 12,
    href: '/quests/brownchest/',
    description:
      'A brown chest found on Beginners Island. It contains leather boots.',
  },

  {
    id: 'brownchest-2',
    name: 'Brown Chest',
    type: 'quest',
    x: 49,
    y: 42,
    z: 2,
    image:
      brownChestImage.src,
    imageAlt: 'Quest Chest',
    size: 12,
    href: '/quests/blackdress/',
    description:
      'A brown chest found on Beginners Island. It contains black dress.',
  },


  /* =======================================================
     QUEST
  ======================================================= */

  {
    id: 'platformquest',
    name: 'Platform Quest',
    type: 'quest',
    x: 10,
    y: 29,
    z: 0,
    image:
      platformQuestImage.src,
    imageAlt: 'Platform Quest',
    size: 20,
    href: '/quests/platformquest/',
    description:
      'This location is related to a platform quest.',
  },


  /* =======================================================
     BUILDING
  ======================================================= */

  {
    id: 'gym',
    name: 'Gym',
    type: 'building',
    x: 21,
    y: 43,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/monsters/train%20machine.png',
    imageAlt: 'Gym',
    size: 15,
    href: '/guides/training/',
    description:
      'An important building on Beginners Island.',
  },

  /* =======================================================
     ENTRANCES
  ======================================================= */

  {
    id: 'example-entrance',
    name: 'Entrance to Triceratops Cave',
    type: 'entrance',
    x: 53,
    y: 29,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/items/used%20gem.png',
    imageAlt: 'Cave Entrance',
    size: 20,
    href: '/reference/cave-entrance/',
    description:
      'A level gate that requires level 4.',
  },
{
    id: 'example-entrance-2',
    name: 'Entrance to Pandorian Forest',
    type: 'entrance',
    x: 18,
    y: 12,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/items/used%20gem.png',
    imageAlt: 'Forest Entrance',
    size: 20,
    href: '/reference/forest-entrance/',
    description:
      'A level gate that requires level 6.',
  },
  {
    id: 'example-entrance-3',
    name: 'Entrance to Tigermen Mountain',
    type: 'entrance',
    x: 44,
    y: 44,
    z: 0,
    image:
      'http://dblots.org.pl/pictures/items/used%20gem.png',
    imageAlt: 'Mountain Entrance',
    size: 20,
    href: '/reference/mountain-entrance/',
    description:
      'A level gate that requires level 4.',
  },
  {
    id: 'example-entrance-4',
    name: 'Entrance to the room with Huge',
    type: 'entrance',
    x: 50,
    y: 32,
    z: 3,
    image:
      'http://dblots.org.pl/pictures/items/used%20gem.png',
    imageAlt: 'Huge Room Entrance',
    size: 20,
    href: '/reference/huge-room-entrance/',
    description:
      'To drop down you need to burn the dry bush with the lighted torch. You can read how to get it in the Trunks Sword quest guide.',
  },
    {
    id: 'example-entrance-5',
    name: 'Entrance to the room with Sleeping Ninja',
    type: 'entrance',
    x: 58,
    y: 34,
    z: -1,
    image:
      'http://dblots.org.pl/pictures/items/used%20gem.png',
    imageAlt: 'Sleeping Ninja Room Entrance',
    size: 20,
    href: '/reference/sleeping-ninja-room-entrance/',
    description:
      'To unlock this entrance, you need to have pliers in your inventory. Opening the doors will wake up the Sleeping Ninja, who will flee upstairs.',
  },
      {
    id: 'example-entrance-6',
    name: 'Wall Crack',
    type: 'entrance',
    x: 39,
    y: 32,
    z: 1,
    image:
      'http://dblots.org.pl/pictures/items/used%20gem.png',
    imageAlt: 'Wall Crack',
    size: 20,
    href: '/reference/wall-crack/',
    description:
      'A crack in the wall that leads to the Trunks sword.',
  },
];