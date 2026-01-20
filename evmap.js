// --------------------
// Basic setup
// --------------------
const width = 900;
const height = 700;

const svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select(".tooltip");
const errorBox = d3.select("#map-error");

// --------------------
// Data sources
// --------------------
const countyMapURL =
  "https://data.dumfriesva.gov/api/geospatial/4r96-sj9x?method=export&format=GeoJSON";

const evDataURL = "electric-vehicles-on-the-road.csv";

// --------------------
// Load both datasets
// --------------------
Promise.all([
  d3.json(countyMapURL),
  d3.csv(evDataURL, d => ({
    county: d.County,
    // CSV header is "EVs on the Road" and values include commas — sanitize
    evs: (function(raw){
      const v = raw || d['EVs on the Road'] || d['EVs on the Road '] || d.EVs || d['EVs'];
      if (v === undefined || v === null || v === "") return NaN;
      const num = Number(String(v).replace(/[,\"]/g, ''));
      return Number.isFinite(num) ? num : NaN;
    })(d['EVs on the Road'])
  }))
])
.then(([vaGeo, evData]) => {

  // Use fallback sample data if EV CSV is missing or empty
  let usingFallback = false;
  const evDataClean = (evData && evData.length)
    ? evData
    : (function() {
      usingFallback = true;
      const msg = `EV data file "${evDataURL}" loaded no rows — using generated fallback data.`;
      console.warn(msg);
      errorBox.text(msg);
      return vaGeo.features.map(f => ({
        county: f.properties && f.properties.name ? f.properties.name : "(unknown)",
        evs: Math.floor(Math.random() * 5000)
      }));
    })();

  // --------------------
  // Create lookup table (normalize county names for robust matching)
  // --------------------
  function normalizeCounty(name){
    return (name || '')
      .toString()
      .toLowerCase()
      .replace(/\b(county|city)\b/g, '')
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Aggregate EV counts by normalized county (sum over ZIP rows)
  const evCounts = new Map();
  evDataClean.forEach(d => {
    const key = normalizeCounty(d.county);
    if (!key) return;
    const val = Number.isFinite(d.evs) ? d.evs : 0;
    evCounts.set(key, (evCounts.get(key) || 0) + val);
  });
  const evByCounty = evCounts;

  // Build a list of normalized CSV county keys for fuzzy matching
  const evKeys = Array.from(evByCounty.keys());

  // Lookup helper with fuzzy strategies: direct, substring, reverse-substring
  function lookupEVsForGeo(rawName){
    const n = normalizeCounty(rawName);
    if (!n) return NaN;
    if (evByCounty.has(n)) return evByCounty.get(n);
    // try substring / compact matches
    for (const k of evKeys) {
      if (k.includes(n) || n.includes(k)) return evByCounty.get(k);
      if (k.replace(/\s+/g,'').includes(n.replace(/\s+/g,'')) || n.replace(/\s+/g,'').includes(k.replace(/\s+/g,''))) {
        return evByCounty.get(k);
      }
    }
    return NaN;
  }

  // Diagnostic: count matches vs misses and show a few examples
  const geoNames = vaGeo.features.map(f => f.properties && (f.properties.name || f.properties.NAME || f.properties.NAMELSAD || f.properties.County) || '(unknown)');
  const matched = [];
  const missed = [];
  for (const g of geoNames) {
    const v = lookupEVsForGeo(g);
    if (Number.isFinite(v) && v > 0) matched.push(g);
    else missed.push(g);
  }
  const diag = `Matched ${matched.length}/${geoNames.length} counties. Misses (sample): ${missed.slice(0,10).join(', ')}`;
  console.info(diag);
  errorBox.text(diag);

  // --------------------
  // Projection & path
  // --------------------
  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], vaGeo);

  const path = d3.geoPath()
    .projection(projection);

  // --------------------
  // Color scale
  // --------------------
  const maxEVs = d3.max(evDataClean, d => Number.isFinite(d.evs) ? d.evs : 0);

  const color = d3.scaleSequential()
    .domain([0, maxEVs])
    .interpolator(d3.interpolateBlues);

  // --------------------
  // Draw counties
  // --------------------
  svg.selectAll("path")
    .data(vaGeo.features)
    .join("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", d => {
        const countyName = d.properties.name || d.properties.NAME || d.properties.NAMELSAD || d.properties.County;
        const evs = lookupEVsForGeo(countyName);
        return Number.isFinite(evs) ? color(evs) : "#eee";
      })
      .on("mouseenter", (event, d) => {
        const county = d.properties.name || d.properties.NAME || d.properties.NAMELSAD || d.properties.County;
        const evsRaw = lookupEVsForGeo(county);
        const evs = Number.isFinite(evsRaw) ? evsRaw : null;

        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${county}</strong><br>
            EVs on the road: ${evs ? evs.toLocaleString() : 'N/A'}
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
      });

})
  .catch(err => {
    console.error("Failed to load map or data:", err);
    errorBox.text("Failed to load map or data. See console for details.");
  });
