const baseYear = 2027;
const monthMap = [
  'Deepcold',
  'Thawmark',
  'Second Thaw',
  'Greenbreak',
  'Longday',
  'Longlight',
  'Highsummer',
  'Drywind',
  'Firstcut',
  'Pulling',
  'Darkfall',
  'Stillnight',
];
const dayMap = [
  'Feastday',
  'Firstday',
  'Workday',
  'Fieldday',
  'Meetday',
  'Tendday',
  'Marketday',
]

function getMapYear(year) {
  return year - baseYear;
}

/**
 * Get the day number in the year for a given date.
 * @param {Date} date - The date to evaluate.
 * @returns {number} - Day number in the year (1–366).
 */
function getDayOfYear(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Invalid Date object provided.");
    }

    // Create a date object for the start of the year
    const startOfYear = new Date(date.getFullYear(), 0, 1);

    // Calculate difference in milliseconds
    const diffInMs = date - startOfYear;

    // Convert milliseconds to days and add 1 (since Jan 1 is day 1)
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
}

function getDateMap(datestring) {
  const date = new Date(datestring);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDay();
  const mapYear = getMapYear(year);
  const mapMonth = monthMap[month];
  const mapDay = dayMap[day];
  const dayNumber = getDayOfYear(date);
  return `${mapDay}, Day ${dayNumber}, ${mapMonth} — Year ${mapYear}`;
}

module.exports = { getDateMap };

// CLI usage: node scripts/map-date.js 2027-04-17
if (require.main === module) {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/map-date.js <date>  e.g. 2027-04-17');
    process.exit(1);
  }
  console.log(getDateMap(arg));
}