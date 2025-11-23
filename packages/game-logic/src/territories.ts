import { Territory } from './types'

// Simplified Risk map with territories and their neighbors
export const INITIAL_TERRITORIES: Omit<Territory, 'ownerId' | 'armies'>[] = [
  // North America
  { id: 'alaska', name: 'Alaska', neighbors: ['northwest-territory', 'alberta', 'kamchatka'], continent: 'North America' },
  { id: 'northwest-territory', name: 'Northwest Territory', neighbors: ['alaska', 'alberta', 'ontario', 'greenland'], continent: 'North America' },
  { id: 'alberta', name: 'Alberta', neighbors: ['alaska', 'northwest-territory', 'ontario', 'western-us'], continent: 'North America' },
  { id: 'ontario', name: 'Ontario', neighbors: ['northwest-territory', 'alberta', 'western-us', 'eastern-us', 'quebec', 'greenland'], continent: 'North America' },
  { id: 'greenland', name: 'Greenland', neighbors: ['northwest-territory', 'ontario', 'quebec', 'iceland'], continent: 'North America' },
  { id: 'western-us', name: 'Western United States', neighbors: ['alberta', 'ontario', 'eastern-us', 'central-america'], continent: 'North America' },
  { id: 'eastern-us', name: 'Eastern United States', neighbors: ['ontario', 'western-us', 'central-america', 'quebec'], continent: 'North America' },
  { id: 'central-america', name: 'Central America', neighbors: ['western-us', 'eastern-us', 'venezuela'], continent: 'North America' },
  { id: 'quebec', name: 'Quebec', neighbors: ['ontario', 'eastern-us', 'greenland'], continent: 'North America' },

  // South America
  { id: 'venezuela', name: 'Venezuela', neighbors: ['central-america', 'peru', 'brazil'], continent: 'South America' },
  { id: 'peru', name: 'Peru', neighbors: ['venezuela', 'brazil', 'argentina'], continent: 'South America' },
  { id: 'brazil', name: 'Brazil', neighbors: ['venezuela', 'peru', 'argentina', 'north-africa'], continent: 'South America' },
  { id: 'argentina', name: 'Argentina', neighbors: ['peru', 'brazil'], continent: 'South America' },

  // Europe
  { id: 'iceland', name: 'Iceland', neighbors: ['greenland', 'great-britain', 'scandinavia'], continent: 'Europe' },
  { id: 'great-britain', name: 'Great Britain', neighbors: ['iceland', 'scandinavia', 'northern-europe', 'western-europe'], continent: 'Europe' },
  { id: 'scandinavia', name: 'Scandinavia', neighbors: ['iceland', 'great-britain', 'northern-europe', 'ukraine'], continent: 'Europe' },
  { id: 'northern-europe', name: 'Northern Europe', neighbors: ['great-britain', 'scandinavia', 'ukraine', 'southern-europe', 'western-europe'], continent: 'Europe' },
  { id: 'western-europe', name: 'Western Europe', neighbors: ['great-britain', 'northern-europe', 'southern-europe', 'north-africa'], continent: 'Europe' },
  { id: 'southern-europe', name: 'Southern Europe', neighbors: ['northern-europe', 'western-europe', 'ukraine', 'north-africa', 'egypt', 'middle-east'], continent: 'Europe' },
  { id: 'ukraine', name: 'Ukraine', neighbors: ['scandinavia', 'northern-europe', 'southern-europe', 'middle-east', 'afghanistan', 'ural'], continent: 'Europe' },

  // Africa
  { id: 'north-africa', name: 'North Africa', neighbors: ['brazil', 'western-europe', 'southern-europe', 'egypt', 'east-africa', 'congo'], continent: 'Africa' },
  { id: 'egypt', name: 'Egypt', neighbors: ['north-africa', 'southern-europe', 'middle-east', 'east-africa'], continent: 'Africa' },
  { id: 'east-africa', name: 'East Africa', neighbors: ['egypt', 'middle-east', 'north-africa', 'congo', 'south-africa', 'madagascar'], continent: 'Africa' },
  { id: 'congo', name: 'Congo', neighbors: ['north-africa', 'east-africa', 'south-africa'], continent: 'Africa' },
  { id: 'south-africa', name: 'South Africa', neighbors: ['congo', 'east-africa', 'madagascar'], continent: 'Africa' },
  { id: 'madagascar', name: 'Madagascar', neighbors: ['east-africa', 'south-africa'], continent: 'Africa' },

  // Asia
  { id: 'middle-east', name: 'Middle East', neighbors: ['southern-europe', 'ukraine', 'afghanistan', 'india', 'east-africa', 'egypt'], continent: 'Asia' },
  { id: 'afghanistan', name: 'Afghanistan', neighbors: ['ukraine', 'ural', 'china', 'india', 'middle-east'], continent: 'Asia' },
  { id: 'ural', name: 'Ural', neighbors: ['ukraine', 'siberia', 'china', 'afghanistan'], continent: 'Asia' },
  { id: 'siberia', name: 'Siberia', neighbors: ['ural', 'yakutsk', 'irkutsk', 'mongolia', 'china'], continent: 'Asia' },
  { id: 'yakutsk', name: 'Yakutsk', neighbors: ['siberia', 'kamchatka', 'irkutsk'], continent: 'Asia' },
  { id: 'kamchatka', name: 'Kamchatka', neighbors: ['yakutsk', 'irkutsk', 'mongolia', 'japan', 'alaska'], continent: 'Asia' },
  { id: 'irkutsk', name: 'Irkutsk', neighbors: ['siberia', 'yakutsk', 'kamchatka', 'mongolia'], continent: 'Asia' },
  { id: 'mongolia', name: 'Mongolia', neighbors: ['siberia', 'irkutsk', 'kamchatka', 'japan', 'china'], continent: 'Asia' },
  { id: 'japan', name: 'Japan', neighbors: ['kamchatka', 'mongolia'], continent: 'Asia' },
  { id: 'china', name: 'China', neighbors: ['afghanistan', 'ural', 'siberia', 'mongolia', 'india', 'siam'], continent: 'Asia' },
  { id: 'india', name: 'India', neighbors: ['middle-east', 'afghanistan', 'china', 'siam'], continent: 'Asia' },
  { id: 'siam', name: 'Siam', neighbors: ['india', 'china', 'indonesia'], continent: 'Asia' },

  // Australia
  { id: 'indonesia', name: 'Indonesia', neighbors: ['siam', 'new-guinea', 'western-australia'], continent: 'Australia' },
  { id: 'new-guinea', name: 'New Guinea', neighbors: ['indonesia', 'western-australia', 'eastern-australia'], continent: 'Australia' },
  { id: 'western-australia', name: 'Western Australia', neighbors: ['indonesia', 'new-guinea', 'eastern-australia'], continent: 'Australia' },
  { id: 'eastern-australia', name: 'Eastern Australia', neighbors: ['new-guinea', 'western-australia'], continent: 'Australia' },
]

export const CONTINENT_BONUSES: Record<string, number> = {
  'North America': 5,
  'South America': 2,
  'Europe': 5,
  'Africa': 3,
  'Asia': 7,
  'Australia': 2,
}
