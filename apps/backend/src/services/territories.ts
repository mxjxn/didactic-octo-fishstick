// Simplified Risk-like territories for the game
export const territories = [
  // North America
  {
    name: 'Alaska',
    continent: 'North America',
    adjacentTerritories: ['Northwest Territory', 'Alberta', 'Kamchatka'],
    position: { x: 50, y: 100 },
  },
  {
    name: 'Northwest Territory',
    continent: 'North America',
    adjacentTerritories: ['Alaska', 'Alberta', 'Ontario', 'Greenland'],
    position: { x: 150, y: 80 },
  },
  {
    name: 'Greenland',
    continent: 'North America',
    adjacentTerritories: ['Northwest Territory', 'Ontario', 'Quebec', 'Iceland'],
    position: { x: 280, y: 60 },
  },
  {
    name: 'Alberta',
    continent: 'North America',
    adjacentTerritories: ['Alaska', 'Northwest Territory', 'Ontario', 'Western United States'],
    position: { x: 120, y: 130 },
  },
  {
    name: 'Ontario',
    continent: 'North America',
    adjacentTerritories: ['Northwest Territory', 'Alberta', 'Greenland', 'Quebec', 'Eastern United States', 'Western United States'],
    position: { x: 180, y: 140 },
  },
  {
    name: 'Quebec',
    continent: 'North America',
    adjacentTerritories: ['Ontario', 'Greenland', 'Eastern United States'],
    position: { x: 230, y: 130 },
  },
  {
    name: 'Western United States',
    continent: 'North America',
    adjacentTerritories: ['Alberta', 'Ontario', 'Eastern United States', 'Central America'],
    position: { x: 130, y: 180 },
  },
  {
    name: 'Eastern United States',
    continent: 'North America',
    adjacentTerritories: ['Western United States', 'Ontario', 'Quebec', 'Central America'],
    position: { x: 190, y: 190 },
  },
  {
    name: 'Central America',
    continent: 'North America',
    adjacentTerritories: ['Western United States', 'Eastern United States', 'Venezuela'],
    position: { x: 150, y: 240 },
  },

  // South America
  {
    name: 'Venezuela',
    continent: 'South America',
    adjacentTerritories: ['Central America', 'Peru', 'Brazil'],
    position: { x: 200, y: 290 },
  },
  {
    name: 'Peru',
    continent: 'South America',
    adjacentTerritories: ['Venezuela', 'Brazil', 'Argentina'],
    position: { x: 190, y: 340 },
  },
  {
    name: 'Brazil',
    continent: 'South America',
    adjacentTerritories: ['Venezuela', 'Peru', 'Argentina', 'North Africa'],
    position: { x: 240, y: 330 },
  },
  {
    name: 'Argentina',
    continent: 'South America',
    adjacentTerritories: ['Peru', 'Brazil'],
    position: { x: 210, y: 390 },
  },

  // Europe
  {
    name: 'Iceland',
    continent: 'Europe',
    adjacentTerritories: ['Greenland', 'Great Britain', 'Scandinavia'],
    position: { x: 320, y: 100 },
  },
  {
    name: 'Great Britain',
    continent: 'Europe',
    adjacentTerritories: ['Iceland', 'Scandinavia', 'Northern Europe', 'Western Europe'],
    position: { x: 340, y: 140 },
  },
  {
    name: 'Scandinavia',
    continent: 'Europe',
    adjacentTerritories: ['Iceland', 'Great Britain', 'Northern Europe', 'Ukraine'],
    position: { x: 380, y: 110 },
  },
  {
    name: 'Ukraine',
    continent: 'Europe',
    adjacentTerritories: ['Scandinavia', 'Northern Europe', 'Southern Europe', 'Middle East', 'Afghanistan', 'Ural'],
    position: { x: 430, y: 140 },
  },
  {
    name: 'Northern Europe',
    continent: 'Europe',
    adjacentTerritories: ['Great Britain', 'Scandinavia', 'Ukraine', 'Southern Europe', 'Western Europe'],
    position: { x: 380, y: 160 },
  },
  {
    name: 'Western Europe',
    continent: 'Europe',
    adjacentTerritories: ['Great Britain', 'Northern Europe', 'Southern Europe', 'North Africa'],
    position: { x: 340, y: 190 },
  },
  {
    name: 'Southern Europe',
    continent: 'Europe',
    adjacentTerritories: ['Western Europe', 'Northern Europe', 'Ukraine', 'Middle East', 'Egypt', 'North Africa'],
    position: { x: 390, y: 200 },
  },

  // Africa
  {
    name: 'North Africa',
    continent: 'Africa',
    adjacentTerritories: ['Brazil', 'Western Europe', 'Southern Europe', 'Egypt', 'East Africa', 'Congo'],
    position: { x: 370, y: 260 },
  },
  {
    name: 'Egypt',
    continent: 'Africa',
    adjacentTerritories: ['Southern Europe', 'Middle East', 'North Africa', 'East Africa'],
    position: { x: 420, y: 250 },
  },
  {
    name: 'East Africa',
    continent: 'Africa',
    adjacentTerritories: ['Egypt', 'Middle East', 'North Africa', 'Congo', 'South Africa', 'Madagascar'],
    position: { x: 440, y: 300 },
  },
  {
    name: 'Congo',
    continent: 'Africa',
    adjacentTerritories: ['North Africa', 'East Africa', 'South Africa'],
    position: { x: 400, y: 320 },
  },
  {
    name: 'South Africa',
    continent: 'Africa',
    adjacentTerritories: ['Congo', 'East Africa', 'Madagascar'],
    position: { x: 410, y: 370 },
  },
  {
    name: 'Madagascar',
    continent: 'Africa',
    adjacentTerritories: ['East Africa', 'South Africa'],
    position: { x: 470, y: 360 },
  },

  // Asia
  {
    name: 'Middle East',
    continent: 'Asia',
    adjacentTerritories: ['Southern Europe', 'Ukraine', 'Afghanistan', 'India', 'East Africa', 'Egypt'],
    position: { x: 470, y: 220 },
  },
  {
    name: 'Afghanistan',
    continent: 'Asia',
    adjacentTerritories: ['Ukraine', 'Ural', 'China', 'India', 'Middle East'],
    position: { x: 510, y: 180 },
  },
  {
    name: 'Ural',
    continent: 'Asia',
    adjacentTerritories: ['Ukraine', 'Siberia', 'China', 'Afghanistan'],
    position: { x: 500, y: 130 },
  },
  {
    name: 'Siberia',
    continent: 'Asia',
    adjacentTerritories: ['Ural', 'Yakutsk', 'Irkutsk', 'Mongolia', 'China'],
    position: { x: 540, y: 100 },
  },
  {
    name: 'Yakutsk',
    continent: 'Asia',
    adjacentTerritories: ['Siberia', 'Kamchatka', 'Irkutsk'],
    position: { x: 600, y: 80 },
  },
  {
    name: 'Kamchatka',
    continent: 'Asia',
    adjacentTerritories: ['Yakutsk', 'Irkutsk', 'Mongolia', 'Japan', 'Alaska'],
    position: { x: 660, y: 90 },
  },
  {
    name: 'Irkutsk',
    continent: 'Asia',
    adjacentTerritories: ['Siberia', 'Yakutsk', 'Kamchatka', 'Mongolia'],
    position: { x: 580, y: 120 },
  },
  {
    name: 'Mongolia',
    continent: 'Asia',
    adjacentTerritories: ['Siberia', 'Irkutsk', 'Kamchatka', 'Japan', 'China'],
    position: { x: 600, y: 150 },
  },
  {
    name: 'Japan',
    continent: 'Asia',
    adjacentTerritories: ['Kamchatka', 'Mongolia'],
    position: { x: 660, y: 170 },
  },
  {
    name: 'China',
    continent: 'Asia',
    adjacentTerritories: ['Afghanistan', 'Ural', 'Siberia', 'Mongolia', 'Siam', 'India'],
    position: { x: 570, y: 190 },
  },
  {
    name: 'India',
    continent: 'Asia',
    adjacentTerritories: ['Middle East', 'Afghanistan', 'China', 'Siam'],
    position: { x: 540, y: 230 },
  },
  {
    name: 'Siam',
    continent: 'Asia',
    adjacentTerritories: ['India', 'China', 'Indonesia'],
    position: { x: 590, y: 250 },
  },

  // Australia
  {
    name: 'Indonesia',
    continent: 'Australia',
    adjacentTerritories: ['Siam', 'New Guinea', 'Western Australia'],
    position: { x: 600, y: 300 },
  },
  {
    name: 'New Guinea',
    continent: 'Australia',
    adjacentTerritories: ['Indonesia', 'Western Australia', 'Eastern Australia'],
    position: { x: 660, y: 310 },
  },
  {
    name: 'Western Australia',
    continent: 'Australia',
    adjacentTerritories: ['Indonesia', 'New Guinea', 'Eastern Australia'],
    position: { x: 620, y: 370 },
  },
  {
    name: 'Eastern Australia',
    continent: 'Australia',
    adjacentTerritories: ['New Guinea', 'Western Australia'],
    position: { x: 670, y: 380 },
  },
]
