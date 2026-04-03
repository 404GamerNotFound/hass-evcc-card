/**
 * evcc-card — Generische Home Assistant Lovelace Card für ha-evcc
 *
 * Datei:   evcc-card.js
 * Ablage:  /config/www/evcc-card/evcc-card.js
 *
 * Übersetzungen: /config/www/evcc-card/locales/de.json
 *                /config/www/evcc-card/locales/en.json
 */

const EVCC_CARD_VERSION = "0.5.3-1";

const FEATURES = [
  { suffix: "mode",                domain: "select",        type: "mode",          lp: true  },
  { suffix: "min_current",         domain: "select",        type: "select_slider", lp: true  },
  { suffix: "max_current",         domain: "select",        type: "select_slider", lp: true  },
  { suffix: "min_soc",             domain: "select",        type: "select_slider", lp: true  },
  { suffix: "limit_soc",           domain: "number",        type: "slider",        lp: true  },
  { suffix: "limit_energy",        domain: "number",        type: "slider",        lp: true  },
  { suffix: "smart_cost_limit",    domain: "number",        type: "slider",        lp: true  },
  { suffix: "priority",            domain: "number",        type: "slider",        lp: true  },
  { suffix: "phases_configured",   domain: "select",        type: "select",        lp: true  },
  { suffix: "vehicle_name",        domain: "select",        type: "select",        lp: true  },
  { suffix: "battery_boost_limit", domain: "select",        type: "select_slider", lp: true  },

  { suffix: "battery_boost",       domain: "switch",        type: "toggle",        lp: true  },

  { suffix: "charge_power",        domain: "sensor",        type: "power",         lp: true  },
  { suffix: "charge_current",      domain: "sensor",        type: "current",       lp: true  },
  { suffix: "charge_duration",     domain: "sensor",        type: "info",          lp: true  },
  { suffix: "charged_energy",      domain: "sensor",        type: "energy",        lp: true  },
  { suffix: "effective_limit_soc", domain: "sensor",        type: "info",          lp: true  },
  { suffix: "vehicle_soc",         domain: "sensor",        type: "soc",           lp: true  },
  { suffix: "vehicle_range",       domain: "sensor",        type: "range",         lp: true  },
  { suffix: "vehicle_odometer",    domain: "sensor",        type: "info",          lp: true  },
  { suffix: "session_energy",          domain: "sensor", type: "info", lp: true },
  { suffix: "session_price",           domain: "sensor", type: "info", lp: true },
  { suffix: "session_price_per_kwh",   domain: "sensor", type: "info", lp: true },
  { suffix: "session_co2_per_kwh",     domain: "sensor", type: "info", lp: true },
  { suffix: "session_solar_percentage",domain: "sensor", type: "info", lp: true },
  { suffix: "phases_active",       domain: "sensor",        type: "info",          lp: true  },

  { suffix: "effective_plan_soc",      domain: "sensor", type: "info", lp: true },
  { suffix: "effective_plan_time",     domain: "sensor", type: "info", lp: true },
  { suffix: "plan_projected_start",    domain: "sensor", type: "info", lp: true },
  { suffix: "plan_projected_end",      domain: "sensor", type: "info", lp: true },

  { suffix: "charging",            domain: "binary_sensor", type: "status_bool",   lp: true  },
  { suffix: "connected",           domain: "binary_sensor", type: "status_bool",   lp: true  },
  { suffix: "enabled",             domain: "binary_sensor", type: "status_bool",   lp: true  },
  { suffix: "smart_cost_active",   domain: "binary_sensor", type: "status_bool",   lp: true  },
  { suffix: "plan_active",         domain: "binary_sensor", type: "status_bool",   lp: true  },
  { suffix: "charger_feature_heating", domain: "binary_sensor", type: "status_bool", lp: true },
  { suffix: "charger_status_reason",   domain: "sensor",        type: "info",         lp: true },

  { suffix: "grid_power",          domain: "sensor",        type: "power",         lp: false },
  { suffix: "pv_power",            domain: "sensor",        type: "power",         lp: false },
  // pv_N_power / pv_N_energy: dynamisch erkannt in discoverEntities()
  { suffix: "home_power",          domain: "sensor",        type: "power",         lp: false },
  { suffix: "battery_power",        domain: "sensor",        type: "power",         lp: false },
  // battery_N_power / battery_N_soc: dynamisch erkannt in discoverEntities()
  { suffix: "battery_soc",         domain: "sensor",        type: "soc",           lp: false },
  // battery_N_soc: dynamisch erkannt in discoverEntities()
  { suffix: "battery_capacity",    domain: "sensor",        type: "info",          lp: false },
  { suffix: "pv_energy",           domain: "sensor",        type: "info",          lp: false },
  // pv_N_energy: dynamisch erkannt in discoverEntities()
  { suffix: "grid_energy",         domain: "sensor",        type: "info",          lp: false },
  { suffix: "battery_energy_charge",   domain: "sensor",    type: "info",          lp: false },
  { suffix: "battery_energy_discharge",domain: "sensor",    type: "info",          lp: false },
  { suffix: "tariff_grid",         domain: "sensor",        type: "info",          lp: false },
  { suffix: "tariff_feedin",       domain: "sensor",        type: "info",          lp: false },
  { suffix: "tariff_co2",          domain: "sensor",        type: "info",          lp: false },

  { suffix: "priority_soc",        domain: "select",        type: "select_slider", lp: false },
  { suffix: "buffer_soc",          domain: "select",        type: "select_slider", lp: false },
  { suffix: "buffer_start_soc",    domain: "select",        type: "select_slider", lp: false },
  { suffix: "residual_power",      domain: "number",        type: "slider",        lp: false },
  { suffix: "battery_discharge_control", domain: "switch",  type: "toggle",        lp: false },
  { suffix: "battery_grid_charge_active", domain: "binary_sensor", type: "status_bool", lp: false },
  { suffix: "battery_grid_charge_limit",  domain: "number",        type: "slider",      lp: false },
];

const _headerIcons = {
  evStation:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12V10Z"/></svg>`,
  home:          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg>`,
  transfer:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z"/></svg>`,
  grid:          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11,7.5L9.5,3H14.5L13,7.5H15L18,3H21L15,12H17L21,21H15L12,15L9,21H3L7,12H9L3,3H6L9,7.5H11M12,13.5L13.9,19H10.1L12,13.5Z"/></svg>`,
  battery:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z"/></svg>`,
  chartBar:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/></svg>`,
  calendarClock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11A5,5 0 0,0 11,16A5,5 0 0,0 16,21A5,5 0 0,0 21,16A5,5 0 0,0 16,11Z"/></svg>`,
  fire:          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z"/></svg>`,
};

const CHARGE_MODES = {
  "off":   { icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13,3H11V13H13V3M17.83,5.17L16.41,6.59C17.99,7.86 19,9.81 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,9.81 6.01,7.86 7.58,6.58L6.17,5.17C4.23,6.82 3,9.26 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.26 19.77,6.82 17.83,5.17Z"/></svg>`,  tKey: "modeOff"  },
  "pv":    { icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"/></svg>`,  tKey: "modePV"   },
  "minpv": { icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11 15H6L13 1V9H18L11 23V15Z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="position:relative;top:4px;left:-6px;opacity:0.8"><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"/></svg>`, tKey: "modeMinPV"},
  "now":   { icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11 15H6L13 1V9H18L11 23V15Z"/></svg>`,  tKey: "modeNow"  },
};

const _chevron = (up) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="${
    up ? "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
       : "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
  }"/></svg>`;

async function detectPrefix(hass) {
  try {
    const entities = await hass.callWS({ type: "config/entity_registry/list" });
    const evccEnts = entities.filter(e => e.platform === "evcc");
    if (evccEnts.length === 0) return "evcc_";

    const siteSuffixes = FEATURES.filter(f => !f.lp);
    for (const ent of evccEnts) {
      const dotIdx = ent.entity_id.indexOf(".");
      const domain = ent.entity_id.slice(0, dotIdx);
      const slug   = ent.entity_id.slice(dotIdx + 1);

      for (const feat of siteSuffixes) {
        if (feat.domain === domain && slug.endsWith(feat.suffix)) {
          const prefix = slug.slice(0, slug.length - feat.suffix.length);
          if (prefix.length > 0) return prefix;
        }
      }
    }
    return "evcc_";
  } catch (e) {
    console.warn("[evcc-card] Could not detect prefix from entity registry:", e);
    return "evcc_";
  }
}

function discoverEntities(hass, prefix = "evcc_") {
  const sortedFeatures = [...FEATURES].sort((a, b) => b.suffix.length - a.suffix.length);
  const prefixLen = prefix.length;

  const loadpoints = {};
  const site = {};

  for (const entityId of Object.keys(hass.states)) {
    const dotIdx = entityId.indexOf(".");
    const domain = entityId.slice(0, dotIdx);
    const slug   = entityId.slice(dotIdx + 1);

    if (!slug.startsWith(prefix)) continue;

    const rest = slug.slice(prefixLen);

    let matched = null;
    for (const feat of sortedFeatures) {
      if (feat.domain !== domain) continue;
      if (rest === feat.suffix) {
        matched = { feat, lpName: "" };
        break;
      }
      if (rest.endsWith("_" + feat.suffix)) {
        const lpName = rest.slice(0, rest.length - feat.suffix.length - 1);
        matched = { feat, lpName };
        break;
      }
    }

    if (!matched) continue;

    const { feat, lpName } = matched;

    if (!lpName) {
      site[feat.suffix] = entityId;
    } else {
      if (!loadpoints[lpName]) loadpoints[lpName] = {};
      if (!loadpoints[lpName][feat.suffix]) {
        loadpoints[lpName][feat.suffix] = entityId;
      }
    }
  }

  const CORE_FEATURES = ["mode", "charge_power", "connected", "charging", "vehicle_soc"];
  for (const lpName of Object.keys(loadpoints)) {
    const hasCore = CORE_FEATURES.some(f => loadpoints[lpName][f]);
    if (!hasCore) delete loadpoints[lpName];
  }

  // Dynamische Erkennung von Battery/PV-Device-Entities (title-basiert)
  // Pattern: sensor.{prefix}battery_{slug}_{key} → site.battery_N_{key}
  //          sensor.{prefix}pv_{slug}_{key}      → site.pv_N_{key}
  const battDevices = {};  // slug → { power: entityId, soc: entityId, capacity: entityId }
  const pvDevices = {};    // slug → { power: entityId, energy: entityId }
  const battSuffixes = ["power", "soc", "capacity"];
  const pvSuffixes = ["power", "energy"];

  for (const entityId of Object.keys(hass.states)) {
    const dotIdx = entityId.indexOf(".");
    const domain = entityId.slice(0, dotIdx);
    if (domain !== "sensor") continue;
    const slug = entityId.slice(dotIdx + 1);
    if (!slug.startsWith(prefix)) continue;
    const rest = slug.slice(prefixLen);

    // Battery device: battery_{slug}_{power|soc|capacity}
    if (rest.startsWith("battery_")) {
      const afterBattery = rest.slice(8); // after "battery_"
      for (const suf of battSuffixes) {
        if (afterBattery.endsWith("_" + suf)) {
          const devSlug = afterBattery.slice(0, afterBattery.length - suf.length - 1);
          if (devSlug) {
            if (!battDevices[devSlug]) battDevices[devSlug] = {};
            battDevices[devSlug][suf] = entityId;
          }
          break;
        }
      }
    }

    // PV device: pv_{slug}_{power|energy}
    if (rest.startsWith("pv_")) {
      const afterPv = rest.slice(3); // after "pv_"
      for (const suf of pvSuffixes) {
        if (afterPv.endsWith("_" + suf)) {
          const devSlug = afterPv.slice(0, afterPv.length - suf.length - 1);
          if (devSlug) {
            if (!pvDevices[devSlug]) pvDevices[devSlug] = {};
            pvDevices[devSlug][suf] = entityId;
          }
          break;
        }
      }
    }
  }

  // Battery-Devices auf Index-Keys mappen (battery_0_power, battery_0_soc, ...)
  const battSlugs = Object.keys(battDevices).filter(s => battDevices[s].power);
  battSlugs.forEach((slug, i) => {
    if (battDevices[slug].power)    site[`battery_${i}_power`]    = battDevices[slug].power;
    if (battDevices[slug].soc)      site[`battery_${i}_soc`]      = battDevices[slug].soc;
    if (battDevices[slug].capacity) site[`battery_${i}_capacity`] = battDevices[slug].capacity;
  });

  // PV-Devices auf Index-Keys mappen (pv_0_power, pv_0_energy, ...)
  const pvSlugs = Object.keys(pvDevices).filter(s => pvDevices[s].power);
  pvSlugs.forEach((slug, i) => {
    if (pvDevices[slug].power)  site[`pv_${i}_power`]  = pvDevices[slug].power;
    if (pvDevices[slug].energy) site[`pv_${i}_energy`] = pvDevices[slug].energy;
  });

  return { loadpoints, site };
}

function stateVal(hass, entityId) {
  return hass.states[entityId]?.state ?? null;
}

function attr(hass, entityId, key) {
  return hass.states[entityId]?.attributes?.[key] ?? null;
}

function unitStr(hass, entityId) {
  return attr(hass, entityId, "unit_of_measurement") ?? "";
}

function displayUnit(hass, entityId) {
  const rawUnit = unitStr(hass, entityId);
  return rawUnit || (entityId.includes("soc") ? "%" : "");
}

function isOn(hass, entityId) {
  const s = stateVal(hass, entityId);
  return s === "on" || s === "true";
}

/**
 * Dynamisch Device-Sources aus site-Objekt erzeugen.
 * Sucht nach Keys im Pattern {prefix}_{N}_{primarySuffix} und optional {prefix}_{N}_{secondarySuffix}.
 * @param {object} site - Das site-Objekt mit Entity-IDs
 * @param {string} prefix - "battery" oder "pv"
 * @param {string} primarySuffix - "power"
 * @param {string} [secondarySuffix] - "soc" oder "energy" (optional)
 * @returns {Array<{key: string, socKey?: string, energyKey?: string, idx: number}>}
 */
function _discoverDeviceSources(site, prefix, primarySuffix, secondarySuffix) {
  const sources = [];
  for (let i = 0; i < 32; i++) {
    const key = `${prefix}_${i}_${primarySuffix}`;
    if (!site[key]) break;
    const entry = { key, idx: i };
    if (secondarySuffix) {
      const secKey = `${prefix}_${i}_${secondarySuffix}`;
      if (secondarySuffix === "soc") entry.socKey = secKey;
      else if (secondarySuffix === "energy") entry.energyKey = secKey;
    }
    sources.push(entry);
  }
  return sources;
}

function socFillGradient(soc, minSoc, limitSoc) {
  const s   = Math.max(0.01, soc);
  const min = Math.max(0, minSoc  || 0);
  const lim = Math.min(100, limitSoc || 100);
  const amber = "var(--evcc-amber)", blue = "var(--evcc-blue)", green = "var(--evcc-green)";
  if (min <= 0 && lim >= 100) return blue;
  const stops = [];
  if (min > 0) {
    const minRel = Math.min((min / s) * 100, 100).toFixed(1);
    stops.push(`${amber} 0%`, `${amber} ${minRel}%`);
    if (s > min) stops.push(`${blue} ${minRel}%`);
  } else {
    stops.push(`${blue} 0%`);
  }
  if (lim < 100 && s > lim) {
    const limRel = Math.min((lim / s) * 100, 100).toFixed(1);
    stops.push(`${blue} ${limRel}%`, `${green} ${limRel}%`, `${green} 100%`);
  } else {
    stops.push(`${blue} 100%`);
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

function socTrackBg(minSoc, limitSoc) {
  const min = Math.max(0, minSoc  || 0);
  const lim = Math.min(100, limitSoc || 100);
  const base = "var(--divider-color, #e5e7eb)";
  if (min <= 0 && lim >= 100) return base;
  const stops = [];
  if (min > 0) stops.push(`rgba(245,158,11,.13) 0%`, `rgba(245,158,11,.13) ${min}%`, `${base} ${min}%`);
  else         stops.push(`${base} 0%`);
  if (lim < 100) stops.push(`${base} ${lim}%`, `rgba(34,197,94,.13) ${lim}%`, `rgba(34,197,94,.13) 100%`);
  else           stops.push(`${base} 100%`);
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

class EvccCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass          = null;
    this._config        = {};
    this._isDragging    = false;
    this._pendingRender = false;
    this._renderTimer   = null;
    this._lastRenderKey = null;
    this._planState     = {};
    this._tabState      = {};
    this._priorityOrder = null; // null = nutze discovered order; string[] = lpNames in Prio-Reihenfolge
    this._statsPeriod    = null;   // null = use config default
    this._statsMetric    = "energy";  // "energy" | "price" | "co2"
    this._statsFilter    = "total";   // "total" | "lp:{name}" | "v:{name}"
    this._statsOffset    = 0;         // 0 = current period, 1 = one back, etc.
    this._statsData      = null;      // {30d: {chargedKWh, solarPercentage, avgPrice, avgCo2}, ...}
    this._sessionsList   = null;
    this._statsChartCache = {};
    this._statsLoadpoints = [];
    this._statsVehicles   = [];
    this._statsLpVehicles = [];
    this._statsFetchTime  = 0;
    this._evccUrl         = undefined; // undefined = not yet detected, null = detection failed
    this._translations  = {};
    this._translationsReady = false;

    this._siteTableExpanded = undefined; // undefined = use config default
    this._currentBlockExpanded = {};
    this._detectedPrefix = null;
    this._cachedEntities   = null;  // { loadpoints, site } — invalidated when entity IDs change
    this._cachedEntityIdKey = null; // sorted join of evcc entity IDs + prefix

    this._onPlanReset = (e) => {
      const lpName = e.detail?.lpName;
      setTimeout(() => {
        if (lpName) delete this._planState[lpName];
        else this._planState = {};
        if (this._hass) this._render();
      }, 1500);
    };
    window.addEventListener("evcc-plan-reset", this._onPlanReset);
  }

  disconnectedCallback() {
    window.removeEventListener("evcc-plan-reset", this._onPlanReset);
  }

  async _loadTranslations() {
    const base = new URL("locales/", import.meta.url).href;

    let langs = ["de", "en"];
    try {
      const idxResp = await fetch(`${base}index.json?v=${EVCC_CARD_VERSION}`);
      if (idxResp.ok) langs = await idxResp.json();
      else console.warn("[evcc-card] locales/index.json not found, using fallback:", langs);
    } catch (e) {
      console.warn("[evcc-card] Could not load locales/index.json, using fallback:", langs);
    }

    const results = await Promise.allSettled(
      langs.map(lang =>
        fetch(`${base}${lang}.json?v=${EVCC_CARD_VERSION}`)
          .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
          .then(data => ({ lang, data }))
      )
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        this._translations[result.value.lang] = result.value.data;
      } else {
        console.warn("[evcc-card] Failed to load translation:", result.reason);
      }
    }

    this._translationsReady = true;
  }

  _getPrefix() {
    return this._config.prefix || this._detectedPrefix || "evcc_";
  }

  set hass(hass) {
    this._hass = hass;

    if (!this._detectedPrefix && !this._detectingPrefix && !this._config.prefix) {
      this._detectingPrefix = true;
      detectPrefix(hass).then(p => {
        this._detectingPrefix = false;
        if (p !== this._detectedPrefix) {
          this._detectedPrefix = p;
          this._lastRenderKey = null;
          this._render();
        }
      });
    }

    if (this._isDragging) {
      this._pendingRender = true;
      this._updateLiveValues();
      return;
    }
    const key = this._buildRenderKey(hass);
    if (key === this._lastRenderKey) return;

    if (this._renderTimer) return;
    this._renderTimer = setTimeout(() => {
      this._renderTimer   = null;
      this._lastRenderKey = this._buildRenderKey(this._hass);
      this._render();
    }, 300);
  }

  _buildRenderKey(hass) {
    if (!hass) return "";
    const prefix     = this._getPrefix();
    const stateCount = Object.keys(hass.states).length;

    // Re-filter evcc entity IDs only when entity count or prefix changes (not on every value update)
    if (!this._evccIds || this._evccIdsCount !== stateCount || this._evccIdsPrefix !== prefix) {
      this._evccIdsCount  = stateCount;
      this._evccIdsPrefix = prefix;
      this._evccIds       = Object.keys(hass.states).filter(id => id.split(".")[1]?.startsWith(prefix));
    }

    const lang = this._config.language || (hass.language ?? "de");
    return lang + "|" + this._evccIds.map(id => `${id}=${hass.states[id]?.state}`).join("|");
  }

  static getConfigElement() {
    return document.createElement("evcc-card-editor");
  }

  static getStubConfig() {
    return { mode: "loadpoint" };
  }

  setConfig(config) {
    this._config = config || {};

    if (!this._translationsReady && !this._loadingTranslations) {
      this._loadingTranslations = true;
      this._loadTranslations().then(() => {
        this._loadingTranslations = false;
        if (this._hass) this._render();
      });
    }
  }

  _toggleSite() {
    const wasExpanded = this._siteTableExpanded !== undefined
      ? this._siteTableExpanded
      : (this._config.site_details !== "collapsed");
    this._siteTableExpanded = !wasExpanded;

    const root = this.shadowRoot;
    const table = root?.querySelector(".site-table");
    if (table) table.style.display = wasExpanded ? "none" : "";
    const wrap = root?.querySelector(".flow-wrap-clickable");
    if (wrap) {
      wrap.title = !wasExpanded ? this._tInline("siteCollapse") : this._tInline("siteExpand");
    }
    const chevronPath = root?.querySelector(".sankey-center-chevron path");
    if (chevronPath) chevronPath.setAttribute("d", !wasExpanded
      ? "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
      : "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z");
  }

  _tInline(key) {
    return this._t(key);
  }

  _t(key, replacements = {}) {
    // Use pre-resolved strings from current render cycle; fall back to resolving on demand
    const strings = this._renderStrings ?? (() => {
      const lang = (this._config.language
        || (this._hass?.language ?? "de")).split("-")[0].toLowerCase();
      return this._translations[lang] || this._translations["en"] || {};
    })();

    let val = strings[key] ?? key;

    for (const [k, v] of Object.entries(replacements)) {
      val = val.replace(`{${k}}`, v);
    }

    return val;
  }

  _render() {
    if (!this._hass) return;
    if (!this._cardId) {
      this._cardId = Math.random().toString(36).slice(2);
      window.__evccCards = window.__evccCards || new Map();
      window.__evccCards.set(this._cardId, this);
    }

    if (!this._translationsReady) {
      this.shadowRoot.innerHTML = `
        <style>:host{display:block}
        .loading{padding:24px;text-align:center;color:var(--secondary-text-color);font-size:.9rem}</style>
        <ha-card><div class="loading">⏳</div></ha-card>`;
      return;
    }

    // Resolve language strings once per render — reused by all _t() calls
    const lang = (this._config.language
      || (this._hass?.language ?? "de")).split("-")[0].toLowerCase();
    this._renderStrings = this._translations[lang] || this._translations["en"] || {};

    const prefix = this._getPrefix();

    // Cache discoverEntities() — only re-run when the set of entity IDs changes (not on value updates)
    const evccIdKey = prefix + "|" + Object.keys(this._hass.states)
      .filter(id => id.split(".")[1]?.startsWith(prefix))
      .sort().join(",");
    if (evccIdKey !== this._cachedEntityIdKey) {
      this._cachedEntityIdKey = evccIdKey;
      this._cachedEntities    = discoverEntities(this._hass, prefix);
    }
    const { loadpoints: allLoadpoints, site } = this._cachedEntities;

    // Filter out site-level entities misidentified as loadpoints
    const SITE_PREFIXES = /^(battery|grid|pv|home)(_|$)/;
    const loadpoints = Object.fromEntries(
      Object.entries(allLoadpoints).filter(([lp]) => !SITE_PREFIXES.test(lp))
    );

    const filterRaw = this._config.loadpoints;
    const filter = filterRaw
      ? (Array.isArray(filterRaw) ? filterRaw : [filterRaw])
      : null;
    let visible = filter && filter.length > 0
      ? Object.fromEntries(
          Object.entries(loadpoints).filter(([lp]) => filter.includes(lp))
        )
      : loadpoints;

    // Heating vs. Loadpoint separation: heating mode shows only heaters, loadpoint/compact hide heaters
    const isHeater = (ents) => ents.charger_feature_heating && isOn(this._hass, ents.charger_feature_heating);
    const mode = this._config.mode || "loadpoint";
    if (mode === "heating") {
      visible = Object.fromEntries(Object.entries(visible).filter(([, ents]) => isHeater(ents)));
    } else if (["loadpoint", "compact"].includes(mode)) {
      visible = Object.fromEntries(Object.entries(visible).filter(([, ents]) => !isHeater(ents)));
    }
    // "priority": kein Filter → alle loadpoints bleiben sichtbar

    this.shadowRoot.innerHTML = `
      <style>${this._styles()}</style>
      <div class="evcc-scale-wrap"><ha-card>
        <div class="card-content">
        ${this._config.mode === "battery"
            ? this._renderBatteryBlock(site)
            : this._config.mode === "site"
              ? this._renderSiteBlock(site, loadpoints)
              : this._config.mode === "flow"
              ? this._renderFlowBlock(site, loadpoints)
              : (this._config.mode === "grid" || this._config.mode === "site2")
              ? this._renderSiteBlock2(site, loadpoints)
              : this._config.mode === "stats"
              ? this._renderStatsBlock()
              : this._config.mode === "priority"
              ? this._renderPriorityMode(visible)
              : this._config.mode === "plan"
                ? this._renderPlanMode(visible)
                : this._config.mode === "compact"
                  ? (Object.keys(visible).length === 0
                      ? this._renderEmpty(loadpoints)
                      : Object.entries(visible)
                          .map(([lp, ents]) => this._renderCompactLoadpoint(lp, ents))
                          .join(""))
                  : this._config.mode === "heating"
                    ? (Object.keys(visible).length === 0
                        ? this._renderEmpty(loadpoints)
                        : Object.entries(visible)
                            .map(([lp, ents]) => this._renderHeatingLoadpoint(lp, ents))
                            .join(""))
                    : Object.keys(visible).length === 0
                ? this._renderEmpty(loadpoints)
                : Object.entries(visible)
                    .map(([lp, ents]) => this._renderLoadpoint(lp, ents))
                    .join("")
          }
        </div>
      </ha-card></div>
    `;
    this._attachListeners();
  }

  _updateLiveValues() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-live-entity]").forEach(el => {
      const entityId = el.dataset.liveEntity;
      const type     = el.dataset.liveType;
      if (!entityId) return;

      if (type === "soc-fill") {
        const soc      = parseFloat(stateVal(this._hass, entityId)) || 0;
        const minSoc   = parseFloat(el.dataset.minSoc)   || 0;
        const limitSoc = parseFloat(el.dataset.limitSoc) || 100;
        el.style.width      = `${soc}%`;
        el.style.background = socFillGradient(soc, minSoc, limitSoc);
      } else if (type === "soc-pct") {
        const soc = parseFloat(stateVal(this._hass, entityId)) || 0;
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z"/></svg> ${Math.round(soc)} ${unitStr(this._hass, entityId)}`;
      } else if (type === "power") {
        el.textContent = `${parseFloat(stateVal(this._hass, entityId)).toFixed(1)} ${unitStr(this._hass, entityId)}`;
      }
    });
  }

  _renderLoadpoint(lpName, ents) {
    const charging   = ents.charging  ? isOn(this._hass, ents.charging)  : false;
    const connected  = ents.connected ? isOn(this._hass, ents.connected) : false;
    const statusLabel = charging ? this._t("charging") : connected ? this._t("connected") : this._t("ready");
    const statusClass = charging ? "charging" : connected ? "connected" : "ready";
    const lpTitle = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;

    const noPlan = Array.isArray(this._config.no_plan) && this._config.no_plan.includes(lpName);

    return `
      <div class="loadpoint">
        <div class="lp-header">
          <span class="lp-name">${_headerIcons.evStation} ${this._config.title || lpTitle}</span>
          <span class="lp-badge ${statusClass}">
            ${statusLabel}
          </span>
        </div>
        ${this._renderModeSelector(ents)}
        ${this._renderVehicleInfo(ents, charging, lpName)}
        ${this._renderPowerRow(ents, charging)}
        ${this._renderSliders(ents)}
        ${this._renderCurrentBlock(ents, lpName)}
        ${this._renderToggles(ents)}
        ${noPlan ? "" : this._renderPlanBlock(lpName, ents)}
        ${this._renderSessionInfo(ents, charging)}
      </div>
    `;
  }

  _renderCompactLoadpoint(lpName, ents) {
    const charging    = ents.charging  ? isOn(this._hass, ents.charging)  : false;
    const connected   = ents.connected ? isOn(this._hass, ents.connected) : false;
    const statusLabel = charging ? this._t("charging") : connected ? this._t("connected") : this._t("ready");
    const statusClass = charging ? "charging" : connected ? "connected" : "ready";
    const lpTitle     = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;
    const noPlan      = Array.isArray(this._config.no_plan) && this._config.no_plan.includes(lpName);

    const _reasonRaw = ents.charger_status_reason ? stateVal(this._hass, ents.charger_status_reason) : null;
    const reasonRaw = (_reasonRaw && _reasonRaw !== "unknown" && _reasonRaw !== "unavailable") ? _reasonRaw : null;
    const reasonText = reasonRaw ? (() => {
      const tKey = `statusReason.${reasonRaw}`;
      const t = this._t(tKey);
      return t !== tKey ? t : reasonRaw;
    })() : null;

    if (this._tabState[lpName] === undefined) this._tabState[lpName] = 0;
    const activeTab = this._tabState[lpName];

    const tabs = [
      { key: "tabControl",  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 15H6L13 1V9H18L11 23V15Z"/></svg>` },
      { key: "tabSettings", icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z"/></svg>` },
      { key: "tabPlan",     icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/></svg>` },
      { key: "tabSession",  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/></svg>` },
    ];

    const tabBar = `
      <div class="compact-tabs">
        ${tabs.map((tab, i) => `
          <button class="compact-tab ${activeTab === i ? "active" : ""}"
                  data-lp="${lpName}" data-tab="${i}">
            <span class="compact-tab-icon">${tab.icon}</span>
            <span class="compact-tab-label">${this._t(tab.key)}</span>
          </button>
        `).join("")}
      </div>`;

    const tabContent = [
      `<div class="compact-panel" ${activeTab !== 0 ? 'hidden' : ''}>
        ${this._renderModeSelector(ents)}
        ${this._renderVehicleInfo(ents, charging, lpName)}
        ${this._renderPowerRow(ents, charging)}
      </div>`,
      `<div class="compact-panel" ${activeTab !== 1 ? 'hidden' : ''}>
        ${this._renderSliders(ents)}
        ${this._renderCurrentBlock(ents, lpName)}
        ${this._renderToggles(ents)}
      </div>`,
      `<div class="compact-panel" ${activeTab !== 2 ? 'hidden' : ''}>
        ${noPlan ? "" : this._renderPlanBlock(lpName, ents)}
      </div>`,
      `<div class="compact-panel" ${activeTab !== 3 ? 'hidden' : ''}>
        ${this._renderSessionInfo(ents, charging)}
      </div>`,
    ].join("");

    return `
      <div class="loadpoint" data-lp-compact="${lpName}">
        <div class="lp-header">
          <span class="lp-name">${_headerIcons.evStation} ${this._config.title || lpTitle}</span>
          <span class="lp-badge ${statusClass}">
            ${statusLabel}
          </span>
        </div>
        ${tabBar}
        ${tabContent}
      </div>
    `;
  }

  _renderHeatingLoadpoint(lpName, ents) {
    const isHeating  = ents.charging ? isOn(this._hass, ents.charging) : false;
    const lpTitle    = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;

    const fireIcon = _headerIcons.fire;
    const statusLabel = isHeating ? this._t("heating") : this._t("heatingIdle");
    const statusClass = isHeating ? "heating" : "idle";

    // Temperature display + bar (analog zum SOC-Block)
    let tempHtml = "";
    if (this._hass.states[ents.vehicle_soc]) {
      const currentTemp = parseFloat(stateVal(this._hass, ents.vehicle_soc));
      const currentUnit = unitStr(this._hass, ents.vehicle_soc) || "°C";
      const targetTemp  = ents.limit_soc
        ? parseFloat(stateVal(this._hass, ents.limit_soc)) : null;

      // Bar range: slider min/max or config overrides, fallback 0-100
      const sliderMin = this._config.target_temp_min
        ?? attr(this._hass, ents.limit_soc, "min") ?? 0;
      const sliderMax = this._config.target_temp_max
        ?? attr(this._hass, ents.limit_soc, "max") ?? 100;
      const barRange  = sliderMax - sliderMin;
      const fillPct   = barRange > 0
        ? Math.min(100, Math.max(0, ((currentTemp - sliderMin) / barRange) * 100))
        : 0;
      const limitPct  = (targetTemp !== null && !isNaN(targetTemp) && barRange > 0)
        ? Math.min(100, Math.max(0, ((targetTemp - sliderMin) / barRange) * 100))
        : null;

      const tempColor = currentTemp >= 60 ? "var(--evcc-red)"
                      : currentTemp >= 40 ? "var(--evcc-amber)"
                      : "var(--evcc-blue)";

      tempHtml = `
        <div class="temp-display">
          <div class="temp-current" style="color:${tempColor}">
            ${isNaN(currentTemp) ? "—" : Math.round(currentTemp)} ${currentUnit}
          </div>
          ${targetTemp !== null && !isNaN(targetTemp) ? `
            <div class="temp-target-label">
              ${this._t("targetTemp")}: ${Math.round(targetTemp)} ${currentUnit}
            </div>` : ""}
        </div>
        <div class="soc-track" style="background:var(--divider-color,#e5e7eb);margin-bottom:12px">
          <div class="soc-fill ${isHeating ? "charging" : ""}"
               style="width:${fillPct}%;background:${tempColor}"></div>
          ${limitPct !== null ? `<div class="soc-limit-marker" style="left:${limitPct}%"></div>` : ""}
        </div>`;
    }

    // Target temperature slider
    let targetSliderHtml = "";
    if (ents.limit_soc) {
      const overrides = { step: 1 };
      if (this._config.target_temp_min != null) overrides.min = this._config.target_temp_min;
      if (this._config.target_temp_max != null) overrides.max = this._config.target_temp_max;
      targetSliderHtml = `<div class="sliders">${this._sliderRow(ents.limit_soc, this._t("targetTemp"), null, overrides)}</div>`;
    }

    return `
      <div class="loadpoint">
        <div class="lp-header">
          <span class="lp-name">${fireIcon} ${this._config.title || lpTitle}</span>
          <span class="lp-badge ${statusClass}">${statusLabel}</span>
        </div>
        ${this._renderModeSelector(ents)}
        ${tempHtml}
        ${targetSliderHtml}
        ${this._renderPowerRow(ents, isHeating, "heating")}
        ${this._renderCurrentBlock(ents, lpName)}
        ${this._config.show_session_energy ? this._renderSessionInfo(ents, isHeating) : ""}
      </div>
    `;
  }

  _renderModeSelector(ents) {
    if (!ents.mode) return "";
    const current = stateVal(this._hass, ents.mode);
    const buttons = Object.entries(CHARGE_MODES).map(([val, cfg]) => `
      <button class="mode-btn ${current === val ? "active" : ""}"
              data-entity="${ents.mode}" data-value="${val}">
        <span class="mode-icon">${cfg.icon}</span>
        <span class="mode-label">${this._t(cfg.tKey)}</span>
      </button>
    `).join("");
    return `<div class="mode-row">${buttons}</div>`;
  }

  _renderSocBar(ents, charging = false) {
    if (!ents.vehicle_soc) return "";
    const soc   = parseFloat(stateVal(this._hass, ents.vehicle_soc)) || 0;
    const range = ents.vehicle_range
      ? Math.round(parseFloat(stateVal(this._hass, ents.vehicle_range))) : null;
    const limit = ents.limit_soc
      ? parseFloat(stateVal(this._hass, ents.limit_soc)) : null;
    const color = soc > 80 ? "var(--evcc-green)" : soc > 30 ? "var(--evcc-blue)" : "var(--evcc-amber)";

    return `
      <div class="soc-section">
        <div class="soc-label-row">
          <span data-live-entity="${ents.vehicle_soc}" data-live-type="soc-pct">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="var(--secondary-text-color)"><path d="M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z"/></svg> ${Math.round(soc)} ${unitStr(this._hass, ents.vehicle_soc)}
          </span>
          ${range !== null ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="var(--secondary-text-color)"><path d="M11.5 0L9 8H11V16H13V8H15L11.5 0M3 18V20H21V18L11.5 16L3 18Z"/></svg> ${range} km</span>` : ""}
        </div>
        <div class="soc-track">
          <div class="soc-fill ${charging ? 'charging' : ''}"
               data-live-entity="${ents.vehicle_soc}" data-live-type="soc-fill"
               style="width:${soc}%;background:${color}"></div>
          ${limit !== null
            ? `<div class="soc-limit-marker" style="left:${Math.min(limit,100)}%"></div>`
            : ""}
        </div>
      </div>
    `;
  }

  _renderVehicleInfo(ents, charging = false, lpName = "") {
    if (!ents.vehicle_soc && !ents.vehicle_name) return "";
    const vehicleAttrs = ents.vehicle_name
      ? (this._hass.states[ents.vehicle_name]?.attributes ?? {}) : {};
    const vehicleName    = vehicleAttrs.vehicle?.name || null;
    const currentVehicle = ents.vehicle_name
      ? (this._hass.states[ents.vehicle_name]?.state ?? null) : null;
    const isGuestActive  = currentVehicle === "null" || currentVehicle === "—";
    const validName      = (vehicleName && vehicleName !== "null")
      ? vehicleName
      : (isGuestActive ? this._t("guestVehicle") : null);

    if (!ents.vehicle_soc && !validName) return "";

    const soc   = ents.vehicle_soc ? parseFloat(stateVal(this._hass, ents.vehicle_soc)) || 0 : null;
    const range = ents.vehicle_range
      ? Math.round(parseFloat(stateVal(this._hass, ents.vehicle_range))) : null;
    const limitEntity  = this._resolveVehicleEntity(ents, "limit_soc") || ents.limit_soc;
    const minSocEntity = this._resolveVehicleEntity(ents, "min_soc")   || ents.min_soc;
    const limit  = limitEntity  ? parseFloat(stateVal(this._hass, limitEntity))   : null;
    const minSoc = minSocEntity ? parseFloat(stateVal(this._hass, minSocEntity))  : null;
    const fillBg  = soc !== null ? socFillGradient(soc, minSoc ?? 0, limit ?? 100) : "var(--evcc-blue)";
    const trackBg = socTrackBg(minSoc ?? 0, limit ?? 100);

    const _rawLimit  = ents.smart_cost_limit ? parseFloat(stateVal(this._hass, ents.smart_cost_limit)) : NaN;
    const smartLimit = ents.smart_cost_limit && !isNaN(_rawLimit) ? _rawLimit : null;
    const smartUnit  = smartLimit !== null
      ? (attr(this._hass, ents.smart_cost_limit, "unit_of_measurement") ?? "") : "";
    const isCo2Chip  = smartUnit === "g/kWh";
    const prefix     = this._getPrefix();
    const tariffId   = isCo2Chip ? `sensor.${prefix}tariff_co2` : `sensor.${prefix}tariff_grid`;
    const tariffVal  = parseFloat(this._hass.states[tariffId]?.state ?? "NaN");
    const smartActive = smartLimit !== null && !isNaN(tariffVal) && tariffVal <= smartLimit;
    const leafIcon   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>`;
    const euroIcon   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M15,18.5C12.49,18.5 10.32,17.08 9.24,15H15V13H8.58C8.53,12.67 8.5,12.34 8.5,12C8.5,11.66 8.53,11.33 8.58,11H15V9H9.24C10.32,6.92 12.5,5.5 15,5.5C16.61,5.5 18.09,6.09 19.23,7.07L21,5.3C19.41,3.87 17.3,3 15,3C11.08,3 7.76,5.51 6.52,9H3V11H6.06C6.02,11.33 6,11.66 6,12C6,12.34 6.02,12.67 6.06,13H3V15H6.52C7.76,18.49 11.08,21 15,21C17.31,21 19.41,20.13 21,18.7L19.22,16.93C18.09,17.91 16.61,18.5 15,18.5Z"/></svg>`;
    const smartChip  = smartLimit !== null ? `
      <button class="smart-cost-chip ${smartActive ? "active" : ""}"
              data-lp-smart-cost-open="${lpName}">
        ${isCo2Chip ? leafIcon : euroIcon} ≤ ${smartLimit} ${isCo2Chip ? "g" : smartUnit}
      </button>` : "";

    return `
      <div class="soc-section">
        <div class="soc-label-row">
          ${validName ? `<span class="vehicle-name"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="var(--secondary-text-color)"><path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/></svg> ${validName}</span>` : ""}
          ${soc !== null ? `<span data-live-entity="${ents.vehicle_soc}" data-live-type="soc-pct"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="var(--secondary-text-color)"><path d="M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z"/></svg> ${Math.round(soc)} ${unitStr(this._hass, ents.vehicle_soc)}</span>` : ""}
          ${range !== null ? `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="var(--secondary-text-color)"><path d="M11.5 0L9 8H11V16H13V8H15L11.5 0M3 18V20H21V18L11.5 16L3 18Z"/></svg> ${range} km</span>` : ""}
        </div>
        ${soc !== null ? `
        <div class="soc-track" style="background:${trackBg}">
          <div class="soc-fill ${charging ? 'charging' : ''}"
               data-live-entity="${ents.vehicle_soc}" data-live-type="soc-fill"
               data-min-soc="${minSoc ?? 0}" data-limit-soc="${limit ?? 100}"
               style="width:${soc}%;background:${fillBg}"></div>
          ${minSoc !== null ? `<div class="soc-min-marker"   style="left:${Math.min(minSoc,100)}%"></div>` : ""}
          ${limit  !== null ? `<div class="soc-limit-marker" style="left:${Math.min(limit,100)}%"></div>`  : ""}
        </div>` : ""}
        ${smartChip ? `<div class="smart-cost-row">${smartChip}</div>` : ""}
      </div>
    `;
  }

  _renderPowerRow(ents, charging, activeClass = "charging") {
    if (!ents.charge_power) return "";
    const power   = parseFloat(stateVal(this._hass, ents.charge_power)).toFixed(1);
    const unit    = unitStr(this._hass, ents.charge_power);
    const current = ents.charge_current
      ? stateVal(this._hass, ents.charge_current) : null;
    const phases  = ents.phases_active
      ? parseInt(stateVal(this._hass, ents.phases_active)) || null : null;
    const phasesLabel = phases === 1 ? this._t("phasesSingle")
                      : phases === 3 ? this._t("phasesTriple")
                      : phases !== null ? `${phases}` : null;

    return `
      <div class="power-row ${charging ? activeClass : ""}">
        <span class="power-value"
              data-live-entity="${ents.charge_power}" data-live-type="power">
          ${power} ${unit}
        </span>
        ${current !== null ? `<span class="power-sep">·</span><span class="power-current">${current} A</span>` : ""}
        ${phasesLabel !== null ? `<span class="power-sep">·</span><span class="power-phases">${phasesLabel}</span>` : ""}
      </div>
    `;
  }

  _resolveVehicleEntity(ents, suffix) {
    if (!ents.vehicle_name) return null;
    const vAttrs = this._hass.states[ents.vehicle_name]?.attributes ?? {};
    const vState = this._hass.states[ents.vehicle_name]?.state ?? null;
    if (!vState || vState === "null" || vState === "—") return null;
    const rawId = (vAttrs.vehicle_ids ?? {})[vState] ?? null;
    if (rawId == null) return null;
    const dbId = String(rawId).replace(/^db:/, "");
    const prefix = this._getPrefix();
    for (const domain of ["number", "select"]) {
      const candidate = `${domain}.${prefix}vehicle_db_${dbId}_${suffix}`;
      if (this._hass.states[candidate]) return candidate;
    }
    return null;
  }

  _renderSliders(ents) {
    const SLIDER_FEATURES = [
      { key: "limit_soc", label: this._t("targetSoc"), preferLoadpoint: false },
      { key: "min_soc",   label: this._t("minSoc"),    preferLoadpoint: false },
    ];

    const rows = SLIDER_FEATURES
      .map(({ key, label, preferLoadpoint }) => {
        const vehicleEntity   = this._resolveVehicleEntity(ents, key);
        const loadpointEntity = ents[key];
        const entity = preferLoadpoint
          ? (loadpointEntity || vehicleEntity)
          : (vehicleEntity   || loadpointEntity);
        return entity ? this._sliderRow(entity, label) : null;
      })
      .filter(Boolean);

    return rows.length ? `<div class="sliders">${rows.join("")}</div>` : "";
  }

  _renderCurrentBlock(ents, lpName = "") {
    const hasPhases     = !!ents.phases_configured;
    const hasCurrent    = ents.min_current || ents.max_current;
    const hasSmartCost  = !!ents.smart_cost_limit;
    const hasPriority   = !!ents.priority;
    if (!hasPhases && !hasCurrent && !hasSmartCost && !hasPriority) return "";

    const configDefault = this._config.charge_current_settings === "expanded";
    const expanded = this._currentBlockExpanded[lpName] !== undefined
      ? this._currentBlockExpanded[lpName]
      : configDefault;

    let phasesHtml = "";
    if (hasPhases) {
      const entityId = ents.phases_configured;
      const current  = stateVal(this._hass, entityId);
      const options  = this._hass.states[entityId]?.attributes?.options ?? [];
      const PHASE_LABELS = {
        "automatischer Wechsel": "Auto", "automatic": "Auto", "auto": "Auto", "0": "Auto",
        "1-phasig": "1", "1": "1",
        "3-phasig": "3", "3": "3",
      };
      const buttons = options.map(opt => `
        <button class="phase-btn ${opt === current ? "active" : ""}"
                data-entity="${entityId}" data-value="${opt}">
          ${PHASE_LABELS[opt] ?? opt}
        </button>`).join("");
      phasesHtml = `
        <div class="select-row">
          <span>${this._t("phases")}</span>
          <div class="phase-btn-group">${buttons}</div>
        </div>`;
    }

    const currentRows = [
      ents.max_current ? this._sliderRow(ents.max_current, this._t("maxCurrent")) : "",
      ents.min_current ? this._sliderRow(ents.min_current, this._t("minCurrent")) : "",
    ].join("");

    const gearIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>`;

    return `
      <div class="current-block" data-lp-current="${lpName}">
        <div class="block-title-row">
          <span class="block-title">${this._t("chargeSettings")}</span>
          <button class="current-toggle-btn ${expanded ? "active" : ""}"
                  data-lp-current-toggle="${lpName}"
                  title="${expanded ? "Hide settings" : "Show settings"}">
            ${gearIcon}
          </button>
        </div>
        <div class="current-block-body" ${expanded ? "" : "hidden"}>
          ${phasesHtml}
          ${currentRows}
          ${(hasPhases || hasCurrent) && (hasPriority || hasSmartCost) ? `<hr class="settings-divider">` : ""}
          ${hasPriority ? this._sliderRow(ents.priority, this._t("priority")) : ""}
          ${hasPriority && hasSmartCost ? `<hr class="settings-divider">` : ""}
          ${hasSmartCost ? (() => {
            const unit      = attr(this._hass, ents.smart_cost_limit, "unit_of_measurement") ?? "";
            const isCo2     = unit === "g/kWh";
            const label     = isCo2 ? this._t("smartCostLimitCo2") : this._t("smartCostLimitPrice");
            const scTariffId = isCo2 ? `sensor.${this._getPrefix()}tariff_co2` : `sensor.${this._getPrefix()}tariff_grid`;
            const scTariff   = parseFloat(this._hass.states[scTariffId]?.state ?? "NaN");
            const active     = !isNaN(scTariff) && scTariff <= parseFloat(stateVal(this._hass, ents.smart_cost_limit) || 0);
            const clearId   = ents.smart_cost_limit.replace(/^number\./, "button.");
            const hasClear  = !!this._hass.states[clearId];
            return `<div class="smart-cost-section" data-lp-smart-cost-section="${lpName}">` +
              this._sliderRow(ents.smart_cost_limit, label) +
              (active ? `<div class="smart-active-hint">⚡ ${this._t("smartCostActive")}</div>` : "") +
              (hasClear ? `<div class="smart-cost-clear-row"><button class="smart-cost-clear-btn" data-entity="${clearId}">✕ ${this._t("smartCostClear")}</button></div>` : "") +
              `</div>`;
          })() : ""}
        </div>
      </div>`;
  }

  _sliderRow(entityId, label, zeroLabel = null, overrides = {}) {
    const domain  = entityId.split(".")[0];
    const _v      = parseFloat(stateVal(this._hass, entityId));
    const val     = isNaN(_v) ? 0 : _v;
    const unit    = displayUnit(this._hass, entityId);
    let min, max, step;

    if (domain === "select") {
      const opts = (attr(this._hass, entityId, "options") ?? [])
        .map(o => parseFloat(o)).filter(o => !isNaN(o)).sort((a, b) => a - b);
      min  = opts[0]  ?? 0;
      max  = opts[opts.length - 1] ?? 100;
      step = opts.length > 1
        ? opts.slice(1).reduce((s, v, i) => Math.min(s, v - opts[i]), Infinity)
        : 5;
    } else {
      min  = attr(this._hass, entityId, "min")  ?? 0;
      max  = attr(this._hass, entityId, "max")  ?? 100;
      step = attr(this._hass, entityId, "step") ?? 1;
    }
    if (overrides.min  != null) min  = overrides.min;
    if (overrides.max  != null) max  = overrides.max;
    if (overrides.step != null) step = overrides.step;

    return `
      <div class="slider-row">
        <label>${label}</label>
        <div class="slider-control">
          <input type="range"
                 min="${min}" max="${max}" step="${step}" value="${val}"
                 data-entity="${entityId}"
                 data-domain="${domain}" />
          <span class="slider-val">${zeroLabel && val === 0 ? zeroLabel : `${val} ${unit}`}</span>
        </div>
      </div>`;
  }

  _boostCommit(input) {
    this._isDragging = false;
    if (this._pendingRender) { this._pendingRender = false; this._render(); return; }
    const val      = parseInt(input.value, 10);
    const entityId = input.dataset.boostEntity;

    if (input.dataset.boostType === "switch") {
      this._hass.callService("switch", val >= 50 ? "turn_on" : "turn_off", { entity_id: entityId });
      return;
    }

    const options = JSON.parse(input.dataset.options || "[]");
    const numOpts = options.map(o => parseInt(o)).filter(o => !isNaN(o));
    const nearest = numOpts.reduce((p, c) =>
      Math.abs(c - val) < Math.abs(p - val) ? c : p, numOpts[0] ?? val);
    this._hass.callService("select", "select_option", {
      entity_id: entityId,
      option:    String(nearest),
    });
  }

  _renderBatteryBoost(ents) {
    if (ents.battery_boost_limit) {
      const entityId = ents.battery_boost_limit;
      const current  = stateVal(this._hass, entityId);
      const options  = this._hass.states[entityId]?.attributes?.options ?? [];
      const pctOpts  = options.map(o => parseInt(o)).filter(o => !isNaN(o)).sort((a, b) => a - b);
      const min      = pctOpts[0] ?? 0;
      const max      = pctOpts[pctOpts.length - 1] ?? 100;
      const step     = pctOpts.length > 1 ? (pctOpts[1] - pctOpts[0]) : 5;
      const curPct   = (!current || current === "unknown") ? 100 : parseInt(current);
      const label    = curPct === 100 ? "Off" : curPct === 0 ? "0 % (full discharge)" : `${curPct} %`;
      return `
        <div class="slider-row">
          <label>Battery boost</label>
          <div class="slider-control">
            <input type="range"
                   min="${min}" max="${max}" step="${step}" value="${curPct}"
                   data-boost-entity="${entityId}"
                   data-options='${JSON.stringify(options)}' />
            <span class="slider-val boost-val">${label}</span>
          </div>
        </div>`;
    }
    if (!ents.battery_boost_limit) return "";
  }

  _renderToggles(ents) {
    const TOGGLE_FEATURES = [];
    const rows = TOGGLE_FEATURES
      .filter(({ key }) => ents[key])
      .map(({ key, label }) => {
        const entityId = ents[key];
        const on       = isOn(this._hass, entityId);
        const domain   = entityId.split(".")[0];
        return `
          <div class="toggle-row">
            <span>${label}</span>
            <button class="toggle ${on ? "on" : ""}"
                    data-entity="${entityId}"
                    data-domain="${domain}"
                    data-on="${on}">
              ${on ? "On" : "Off"}
            </button>
          </div>
        `;
      });
    return rows.length ? `<div class="toggles">${rows.join("")}</div>` : "";
  }

  _renderSelects(ents) {
    const SELECT_FEATURES = [
      { key: "phases_configured", label: this._t("phases") },
    ];
    const PHASE_LABELS = {
      "automatischer Wechsel": "Auto", "automatic": "Auto", "auto": "Auto", "0": "Auto",
      "1-phasig": "1", "1": "1", "3-phasig": "3", "3": "3",
    };
    const rows = SELECT_FEATURES
      .filter(({ key }) => ents[key])
      .map(({ key, label }) => {
        const entityId = ents[key];
        const current  = stateVal(this._hass, entityId);
        const options  = this._hass.states[entityId]?.attributes?.options ?? [];
        const buttons  = options.map(opt => `
          <button class="phase-btn ${opt === current ? "active" : ""}"
                  data-entity="${entityId}" data-value="${opt}">
            ${PHASE_LABELS[opt] ?? opt}
          </button>`).join("");
        return `
          <div class="select-row">
            <span>${label}</span>
            <div class="phase-btn-group">${buttons}</div>
          </div>`;
      });
    return rows.length ? `<div class="selects">${rows.join("")}</div>` : "";
  }

  _renderPlanBlock(lpName, ents, force = false) {
    const hasVehicle    = !!ents.vehicle_soc;
    const vehicleSocValid = hasVehicle && !isNaN(parseFloat(stateVal(this._hass, ents.vehicle_soc)));
    const planActive = ents.plan_active ? isOn(this._hass, ents.plan_active) : false;
    const planTime   = ents.effective_plan_time
      ? stateVal(this._hass, ents.effective_plan_time) : null;
    const planSoc    = ents.effective_plan_soc
      ? stateVal(this._hass, ents.effective_plan_soc) : null;
    const projStart  = ents.plan_projected_start
      ? stateVal(this._hass, ents.plan_projected_start) : null;
    const projEnd    = ents.plan_projected_end
      ? stateVal(this._hass, ents.plan_projected_end) : null;

    if (!ents.effective_plan_soc || !this._hass.states[ents.effective_plan_soc]) return "";
    if (!force && !hasVehicle && !planActive) return "";

    const lpTitle = this._hass.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;

    const vehicleEntityId    = ents.vehicle_name || null;
    const vehicleAttrs       = vehicleEntityId ? (this._hass.states[vehicleEntityId]?.attributes ?? {}) : {};
    const vehicleIds         = vehicleAttrs.vehicle_ids ?? {};
    const GUEST_VALUES = ["null", "—"];
    const GUEST_LABEL  = this._t("guestVehicle");
    const rawOptions   = vehicleAttrs.options ?? [];
    const hasGuest     = rawOptions.some(o => GUEST_VALUES.includes(o));
    const namedOptions = rawOptions.filter(o => !GUEST_VALUES.includes(o));
    const guestValue   = rawOptions.find(o => GUEST_VALUES.includes(o)) ?? "—";
    const allOptions   = hasGuest ? [...namedOptions, guestValue] : namedOptions;
    const vehicleAttr        = vehicleAttrs.vehicle ?? null;

    if (!this._planState[lpName]) {
      this._planState[lpName] = { soc: null, energy: null, time: null, vehicle: null };
    }

    if (this._planState[lpName].soc == null) {
      const vehicleLimitSoc = vehicleAttr?.limitSoc > 0 ? vehicleAttr.limitSoc : null;
      const entityLimitSoc  = ents.effective_limit_soc
        ? Math.round(parseFloat(stateVal(this._hass, ents.effective_limit_soc))) : null;
      const parsedPlanSoc = parseFloat(planSoc);
      this._planState[lpName].soc = (parsedPlanSoc > 0)
        ? Math.round(parsedPlanSoc)
        : vehicleLimitSoc ?? (entityLimitSoc > 0 ? entityLimitSoc : 80);
    }

    if (this._planState[lpName].energy == null) {
      this._planState[lpName].energy = 10;
    }

    if (this._planState[lpName].time == null) {
      let initDt = "";
      if (planTime && planTime !== "unknown" && planTime !== "unavailable") {
        try {
          const d = new Date(planTime);
          const offset = d.getTimezoneOffset() * 60000;
          initDt = new Date(d - offset).toISOString().slice(0, 16);
        } catch(e) {}
      }
      if (!initDt) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(7, 0, 0, 0);
        const offset = tomorrow.getTimezoneOffset() * 60000;
        initDt = new Date(tomorrow - offset).toISOString().slice(0, 16);
      }
      this._planState[lpName].time = initDt;
    }

    const defaultSoc     = this._planState[lpName].soc;
    const defaultEnergy  = this._planState[lpName].energy ?? 10;
    const defaultDt      = this._planState[lpName].time;
    const planSaveStatus = this._planState[lpName]._status ?? null;
    const planSaveMsg    = this._planState[lpName]._statusMsg ?? null;

    const currentVehicleTitle = vehicleEntityId ? this._hass.states[vehicleEntityId]?.state : null;
    if (currentVehicleTitle) {
      const isGuest = currentVehicleTitle === "null" || currentVehicleTitle === "—";
      const prev    = this._planState[lpName].vehicle;
      if (!isGuest) {
        if (prev && prev !== currentVehicleTitle) {
          this._planState[lpName].soc    = null;
          this._planState[lpName].energy = null;
          this._planState[lpName].time   = null;
        }
        this._planState[lpName].vehicle = currentVehicleTitle;
      } else if (!GUEST_VALUES.includes(prev)) {
        this._planState[lpName].energy = null;
        this._planState[lpName].time   = null;
        this._planState[lpName].vehicle = guestValue;
      }
    }
    const defaultVehicle = this._planState[lpName].vehicle;

    const vehicleSelectHtml = allOptions.length > 0 ? `
      <div class="plan-row">
        <label>${this._t("vehicle")}</label>
        <select class="plan-vehicle-select" data-lp="${lpName}" data-entity="${vehicleEntityId ?? ""}">
          ${allOptions.map(val => {
            const label = GUEST_VALUES.includes(val) ? GUEST_LABEL : val;
            return `<option value="${val}" ${val === defaultVehicle ? "selected" : ""}>${label}</option>`;
          }).join("")}
        </select>
      </div>` : "";

    const fmtDt = (iso) => {
      if (!iso || iso === "unknown" || iso === "unavailable") return null;
      try {
        return new Date(iso).toLocaleString(this._config.language || this._hass?.language || "en", {
          weekday: "short", day: "2-digit", month: "2-digit",
          hour: "2-digit", minute: "2-digit"
        });
      } catch(e) { return null; }
    };

    const startStr = fmtDt(projStart);
    const endStr   = fmtDt(projEnd);

    const planBadge = planActive
      ? `<span class="plan-badge active">${this._t("chargingByPlan")}</span>`
      : (planTime && planTime !== "unknown" && planTime !== "unavailable")
        ? `<span class="plan-badge planned">${this._t("planned")}</span>`
        : `<span class="plan-badge">${this._t("noPlan")}</span>`;

    const projectionHtml = (startStr || endStr) ? `
      <div class="plan-projection">
        ${startStr ? `<span style="display:flex;align-items:center;gap:4px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M16.06,3.5L17.5,2.08L18.92,3.5L17.5,4.92L16.06,3.5M7.06,3.5L5.64,2.08L4.22,3.5L5.64,4.92L7.06,3.5M12,6A4,4 0 0,1 16,10V16H13V22H11V16H8V10A4,4 0 0,1 12,6Z"/></svg> Start: <strong>${startStr}</strong></span>` : ""}
        ${endStr   ? `<span>✅ End: <strong>${endStr}</strong></span>`      : ""}
      </div>` : "";

    return `
      <div class="plan-block" data-lp="${lpName}">
        <div class="plan-header">
          <span class="session-title">${this._t("chargePlan")}</span>
          ${planBadge}
        </div>
        ${projectionHtml}
        <div class="plan-inputs">
          ${vehicleSelectHtml}
          <div class="plan-row">
            <label>${this._t("finishBy")}</label>
            <input type="datetime-local" class="plan-time-input"
                   value="${defaultDt}" data-lp="${lpName}" />
          </div>
          ${(() => {
            const prefix = this._getPrefix();
            // LP-Ebene direkt über lpName konstruieren
            const lpContinuousId   = `switch.${prefix}${lpName}_plan_continuous`;
            const lpPreconditionId = `select.${prefix}${lpName}_plan_precondition`;
            // Fahrzeug-Ebene wenn ein benanntes Fahrzeug ausgewählt ist
            let vhContinuousId   = null;
            let vhPreconditionId = null;
            const vState = vehicleEntityId
              ? (this._hass.states[vehicleEntityId]?.state ?? null) : null;
            if (vState && vState !== "null" && vState !== "—") {
              const rawId = vehicleIds[vState] ?? null;
              if (rawId != null) {
                const slug = String(rawId).toLowerCase()
                  .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
                vhContinuousId   = `switch.${prefix}vehicle_${slug}_plan_continuous`;
                vhPreconditionId = `select.${prefix}vehicle_${slug}_plan_precondition`;
              }
            }
            // Fahrzeug-Entity bevorzugen wenn vorhanden, sonst LP-Entity
            const continuousEntity   = (vhContinuousId   && this._hass.states[vhContinuousId])
              ? vhContinuousId   : (this._hass.states[lpContinuousId]   ? lpContinuousId   : null);
            const preconditionEntity = (vhPreconditionId && this._hass.states[vhPreconditionId])
              ? vhPreconditionId : (this._hass.states[lpPreconditionId] ? lpPreconditionId : null);
            const PRECONDITION_LABELS = { "0": "—", "900": "15 min", "1800": "30 min", "3600": "1h", "7200": "2h", "604800": "7d" };
            const continuousHtml = continuousEntity ? (() => {
              const continuous = isOn(this._hass, continuousEntity);
              return `
                <div class="plan-row">
                  <label>${this._t("planContinuous")}</label>
                  <button class="plan-toggle ${continuous ? 'on' : ''}"
                          data-entity="${continuousEntity}" data-domain="switch" data-on="${continuous}">
                    ${continuous ? this._t("planContinuousOn") : this._t("planContinuousOff")}
                  </button>
                </div>`;
            })() : "";
            const preconditionHtml = preconditionEntity ? (() => {
              const options = this._hass.states[preconditionEntity]?.attributes?.options ?? Object.keys(PRECONDITION_LABELS);
              const current = stateVal(this._hass, preconditionEntity) ?? "0";
              return `
                <div class="plan-row">
                  <label>${this._t("planPrecondition")}</label>
                  <select class="plan-precondition-select" data-entity="${preconditionEntity}">
                    ${options.map(o => `<option value="${o}" ${o === current ? "selected" : ""}>${PRECONDITION_LABELS[o] ?? o}</option>`).join("")}
                  </select>
                </div>`;
            })() : "";
            if (!continuousHtml && !preconditionHtml) return "";
            return `<div class="plan-row-group">${continuousHtml}${preconditionHtml}</div>`;
          })()}
          ${((defaultVehicle && defaultVehicle !== "null" && defaultVehicle !== "—") || vehicleSocValid) ? `
          <div class="plan-row">
            <label>${this._t("targetSoc")}</label>
            <div class="plan-soc-control">
              <input type="range" class="plan-soc-range"
                     min="20" max="100" step="5" value="${defaultSoc}"
                     data-lp="${lpName}" />
              <span class="plan-soc-val">${defaultSoc} %</span>
            </div>
          </div>` : `
          <div class="plan-row">
            <label>${this._t("targetEnergy")}</label>
            <div class="plan-soc-control">
              <input type="range" class="plan-energy-range"
                     min="5" max="100" step="5" value="${defaultEnergy}"
                     data-lp="${lpName}" />
              <span class="plan-energy-val">${defaultEnergy} kWh</span>
            </div>
          </div>`}
        </div>
        <div class="plan-actions">
          <button class="plan-btn save" data-lp="${lpName}" data-lp-title="${lpTitle}">${this._t("setPlan")}</button>
          ${(planActive || (planTime && planTime !== "unknown" && planTime !== "unavailable"))
            ? `<button class="plan-btn delete" data-lp="${lpName}" data-lp-title="${lpTitle}">${this._t("deletePlan")}</button>`
            : ""}
          ${planSaveStatus === "error"
            ? `<div class="plan-error">❌ ${planSaveMsg}</div>`
            : ""}
        </div>
      </div>
    `;
  }

  _renderSessionInfo(ents, charging = false) {
    const hasAny = ents.session_energy || ents.session_price || ents.session_price_per_kwh || ents.session_co2_per_kwh || ents.session_solar_percentage;
    if (!hasAny) return "";

    const fmtVal = (entityId, decimals = 2) => {
      const v = parseFloat(stateVal(this._hass, entityId));
      if (isNaN(v)) return "—";
      const unit = unitStr(this._hass, entityId);
      return `${v.toFixed(decimals)}${unit ? " " + unit : ""}`;
    };

    const energy      = ents.session_energy          ? (() => { const v = parseFloat(stateVal(this._hass, ents.session_energy)); if (isNaN(v)) return "—"; const unit = unitStr(this._hass, ents.session_energy) || "kWh"; if (unit === "Wh") { return v >= 1000 ? `${(v / 1000).toFixed(2)} kWh` : `${Math.round(v)} Wh`; } return `${v.toFixed(2)} ${unit}`; })() : null;
    const price       = ents.session_price           ? (() => { const v = parseFloat(stateVal(this._hass, ents.session_price)); const u = unitStr(this._hass, ents.session_price) || "€"; return isNaN(v) ? "—" : `${v.toFixed(2)} ${u}`; })() : null;
    const fmtPerKwh = (entityId, decimals) => {
      const v = parseFloat(stateVal(this._hass, entityId));
      if (isNaN(v)) return "—";
      const unit = (unitStr(this._hass, entityId) || "").replace("/kWh", "").trim();
      return `${v.toFixed(decimals)}${unit ? " " + unit : ""}`;
    };
    const pricePerKwh = ents.session_price_per_kwh   ? fmtPerKwh(ents.session_price_per_kwh, 3) : null;
    const co2PerKwh   = ents.session_co2_per_kwh     ? fmtPerKwh(ents.session_co2_per_kwh, 0)   : null;
    const solar       = ents.session_solar_percentage? (() => { const v = parseFloat(stateVal(this._hass, ents.session_solar_percentage)); return isNaN(v) ? "—" : `${Math.round(v)} %`; })() : null;

    const items = [
      energy      ? `<div class="session-item"><span class="si-label">${this._t("energy")}</span><span class="si-value">${energy}</span></div>`          : "",
      price       ? `<div class="session-item"><span class="si-label">${this._t("cost")}</span><span class="si-value">${price}</span></div>`              : "",
      pricePerKwh ? `<div class="session-item"><span class="si-label">${this._t("sessionPricePerKwh")}</span><span class="si-value">${pricePerKwh}</span></div>` : "",
      co2PerKwh   ? `<div class="session-item"><span class="si-label">${this._t("sessionCo2PerKwh")}</span><span class="si-value">${co2PerKwh}</span></div>`     : "",
      solar       ? `<div class="session-item"><span class="si-label">${this._t("sessionSolar")}</span><span class="si-value">${solar}</span></div>`           : "",
    ].filter(Boolean);

    return `
      <div class="session-block">
        <div class="session-title">${charging ? this._t("chargeSessionCurrent") : this._t("chargeSessionLast")}</div>
        <div class="session-grid">${items.join("")}</div>
      </div>
    `;
  }

  _renderPlanMode(loadpoints) {
    if (Object.keys(loadpoints).length === 0) return this._renderEmpty(loadpoints);
    return Object.entries(loadpoints).map(([lpName, ents]) => {
      const planHtml    = this._renderPlanBlock(lpName, ents, true);
      const sessionHtml = this._renderSessionInfo(ents);
      if (!planHtml) return "";
      return `
        <div class="loadpoint">
          <div class="lp-header">
            <span class="lp-name">${_headerIcons.calendarClock} ${this._config.title || (this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName)}</span>
          </div>
          ${planHtml}
          ${sessionHtml}
        </div>`;
    }).join("");
  }

  _renderPriorityMode(loadpoints) {
    const lpKeys = Object.keys(loadpoints);
    if (this._priorityOrder === null || !this._priorityOrder.every(k => lpKeys.includes(k))) {
      this._priorityOrder = lpKeys;
    }
    const isHeater = (ents) => ents.charger_feature_heating && isOn(this._hass, ents.charger_feature_heating);
    const items = this._priorityOrder.map((lpName, idx) => {
      const ents = loadpoints[lpName] || {};
      const title = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;
      const heater = isHeater(ents);
      const typeIcon = heater
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c0 4-4 5-4 9a4 4 0 0 0 8 0c0-4-4-5-4-9z"/><path d="M12 22v-3"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h2l3 3v4h-5V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;
      return `<div class="priority-item" draggable="true" data-lp="${lpName}">
        <span class="drag-handle">⠿</span>
        <span class="priority-badge">${idx + 1}</span>
        <span class="priority-title">${title}</span>
        <span class="priority-type">${typeIcon}</span>
      </div>`;
    }).join("");
    return `<div class="loadpoint">
      <div class="lp-header">
        <span class="lp-name">${_headerIcons.evStation} ${this._config.title || this._t("priorityTitle")}</span>
      </div>
      <div class="priority-mode">
        <div class="priority-hint">${this._t("priorityHint")}</div>
        <div class="priority-list">${items}</div>
        <div class="priority-actions">
          <button class="priority-save-btn">${this._t("prioritySave")}</button>
        </div>
      </div>
    </div>`;
  }

  _renderSiteBlock(site, loadpoints = {}) {
    const kw = id => {
      if (!id) return 0;
      const raw  = parseFloat(stateVal(this._hass, id)) || 0;
      const unit = unitStr(this._hass, id);
      return unit === "kW" ? raw : raw / 1000;
    };
    const kwh = id => id ? parseFloat(stateVal(this._hass, id)) || 0 : null;
    const ct  = id => id ? parseFloat(stateVal(this._hass, id)) || 0 : null;

    const nameFromEntity = (entityId) => entityId ? (attr(this._hass, entityId, "title") ?? null) : null;
    const pvSources = _discoverDeviceSources(site, "pv", "power", "energy").map(s => ({
      ...s,
      label: nameFromEntity(site[s.key]) ?? `PV ${s.idx + 1}`,
    }));
    const pvPow = pvSources.length > 0
      ? pvSources.reduce((sum, s) => sum + kw(site[s.key]), 0)
      : kw(site.pv_power);
    const pvKwh = pvSources.length > 0
      ? pvSources.reduce((sum, s) => sum + (kwh(site[s.energyKey]) ?? 0), 0)
      : kwh(site.pv_energy);
    const battSources = _discoverDeviceSources(site, "battery", "power", "soc").map(s => ({
      ...s,
      label: nameFromEntity(site[s.key]) ?? `${this._t("battery")} ${s.idx + 1}`,
    }));
    const gridPow = kw(site.grid_power);
    const battPow = kw(site.battery_power);
    const homePow = kw(site.home_power);

    const chargePow = Object.values(loadpoints)
      .reduce((sum, ents) => sum + kw(ents.charge_power), 0);

    const feedinPow     = gridPow < 0 ? Math.abs(gridPow) : 0;
    const bezugPow      = gridPow > 0 ? gridPow : 0;
    const battChargePow = battPow < 0 ? Math.abs(battPow) : 0;
    const battDischPow  = battPow > 0 ? battPow : 0;

    const totalIn  = Math.max(pvPow + battDischPow + bezugPow, 0.001);

    const pvPct      = Math.round(pvPow      / totalIn * 100);
    const battDPct   = Math.round(battDischPow / totalIn * 100);
    const gridInPct  = Math.round(bezugPow   / totalIn * 100);

    const houseOnlyPow = homePow;
    const totalOut = Math.max(houseOnlyPow + chargePow + battChargePow + feedinPow, 0.001);
    const homePct   = Math.round(houseOnlyPow  / totalOut * 100);
    const chargePct = Math.round(chargePow     / totalOut * 100);
    const battCPct  = Math.round(battChargePow / totalOut * 100);
    const feedinPct = Math.round(feedinPow     / totalOut * 100);

    const pvSurplusPow = Math.min(feedinPow, pvPow);
    const pvSelfPow    = Math.max(pvPow - pvSurplusPow, 0);
    const pvSelfPct    = Math.round(pvSelfPow    / totalIn * 100);
    const pvSurplusPct = Math.round(pvSurplusPow / totalIn * 100);

    const fmt     = v => v < 10 ? v.toFixed(1) : Math.round(v).toString();
    const useWatt = Math.max(totalIn, totalOut) < 1;
    const fmtPow  = v => useWatt ? `${Math.round(v * 1000)} W` : `${fmt(v)} kW`;
    const fmtKw   = v => `${fmt(v)} kW`;
    const fmtKwh  = v => v === null ? "–" : `${fmt(v)} kWh`;

    const batterySoc = kwh(site.battery_soc);
    const gridKwh    = kwh(site.grid_energy);
    const battCKwh   = kwh(site.battery_energy_charge);
    const battDKwh   = kwh(site.battery_energy_discharge);

    const tariffGrid   = ct(site.tariff_grid);
    const tariffFeedin = ct(site.tariff_feedin);

    const hasBatt   = site.battery_power && (battDischPow > 0.05 || battChargePow > 0.05);
    const hasGrid   = bezugPow > 0.05 || feedinPow > 0.05;
    const hasPV     = pvPow > 0.05;
    const hasCharge = chargePow > 0.05;

    const segments = [
      { cls: "seg-pv",         pct: pvSelfPct,    label: fmtPow(pvSelfPow),    color: "var(--evcc-green)",  show: pvSelfPow > 0.05 },
      { cls: "seg-pv-surplus", pct: pvSurplusPct, label: fmtPow(pvSurplusPow), color: "var(--evcc-yellow)", show: pvSurplusPow > 0.05 },
      { cls: "seg-battd",   pct: battDPct,  label: fmtPow(battDischPow),color: "var(--evcc-orange)", show: battDischPow > 0.05 },
      { cls: "seg-gridin",  pct: gridInPct, label: fmtPow(bezugPow),    color: "var(--evcc-red)",    show: bezugPow > 0.05 },
    ].filter(s => s.pct > 0);;

    const segTotal = segments.reduce((s, x) => s + x.pct, 0);
    if (segTotal > 0 && segTotal !== 100) {
      const scale = 100 / segTotal;
      segments.forEach(s => s.pct = Math.round(s.pct * scale));
      const diff = 100 - segments.reduce((s, x) => s + x.pct, 0);
      if (segments.length) segments[segments.length - 1].pct += diff;
    }

    const topLabels = [
      hasPV         ? { icon: "☀️",  val: fmtKw(pvPow),        pct: pvPct / 2 } : null,
      battDischPow > 0.05 ? { icon: "🔋↑", val: fmtKw(battDischPow), pct: pvPct + battDPct / 2 } : null,
      bezugPow > 0.05     ? { icon: "⚡↓", val: fmtKw(bezugPow),     pct: pvPct + battDPct + gridInPct / 2 } : null,
    ].filter(Boolean);

    const bottomSegs = [
      { icon: "🏠",  val: fmtPow(houseOnlyPow), pct: homePct,   show: houseOnlyPow > 0.05 },
      { icon: "🔌",  val: fmtPow(chargePow),     pct: chargePct, show: hasCharge },
      { icon: "🔋",  val: fmtPow(battChargePow), pct: battCPct,  show: battChargePow > 0.05 },
      { icon: "🗼",  val: fmtPow(feedinPow),     pct: feedinPct, show: feedinPow > 0.05 },
    ].filter(s => s.show);

    let cumPct = 0;
    bottomSegs.forEach(s => {
      s.midPct = cumPct + s.pct / 2;
      cumPct += s.pct;
    });

    const SVG_W        = 1000;
    const LABEL_W      = 60;
    const BRACE_TOP_H  = 52;
    const BAR_H        = 48;
    const BRACE_BOT_H  = 52;
    const BAR_Y        = BRACE_TOP_H;
    const BAR_X0       = 0;
    const BAR_X1       = SVG_W - LABEL_W;
    const BAR_W        = BAR_X1 - BAR_X0;
    const SVG_H        = BRACE_TOP_H + BAR_H + BRACE_BOT_H;
    const R            = 5;
    const TICK         = 7;

    const TOP_TIP_Y    = BAR_Y - BRACE_TOP_H + 10;
    const BOT_TIP_Y    = BAR_Y + BAR_H + BRACE_BOT_H - 10;

    const COL_BRACE    = "currentColor";
    const COL_TEXT     = "currentColor";
    const COL_LABEL    = "currentColor";

    const bracePath = (x0, x1, barEdgeY, tipY) => {
      const yEnd = barEdgeY + (tipY > barEdgeY ? TICK : -TICK);
      return [
        `M ${x0} ${barEdgeY}`,
        `L ${x0} ${yEnd}`,
        `Q ${x0} ${tipY} ${(x0 + x1) / 2} ${tipY}`,
        `Q ${x1} ${tipY} ${x1} ${yEnd}`,
        `L ${x1} ${barEdgeY}`,
      ].join(" ");
    };

    let cumX = BAR_X0;
    const segsWithX = segments.map(s => {
      const w  = Math.round(s.pct / 100 * BAR_W);
      const x0 = cumX;
      const x1 = cumX + w;
      cumX = x1;
      return { ...s, x0, x1, xMid: (x0 + x1) / 2, w };
    });
    if (segsWithX.length) segsWithX[segsWithX.length - 1].x1 = BAR_X1;

    let cumXB = BAR_X0;
    const botSegsWithX = bottomSegs.map(s => {
      const w  = Math.round(s.pct / 100 * BAR_W);
      const x0 = cumXB;
      const x1 = cumXB + w;
      cumXB = x1;
      return { ...s, x0, x1, xMid: (x0 + x1) / 2 };
    });
    if (botSegsWithX.length) botSegsWithX[botSegsWithX.length - 1].x1 = BAR_X1;
    botSegsWithX.forEach(s => { s.xMid = (s.x0 + s.x1) / 2; });

    const barRects = segsWithX.map(s =>
      `<rect x="${s.x0}" y="${BAR_Y}" width="${s.x1 - s.x0}" height="${BAR_H}" fill="${s.color}" />`
    ).join("");

    const barClip = `
      <defs>
        <clipPath id="bar-clip">
          <rect x="${BAR_X0}" y="${BAR_Y}" width="${BAR_W}" height="${BAR_H}" rx="${R}" ry="${R}" />
        </clipPath>
      </defs>
      <g clip-path="url(#bar-clip)">${barRects}</g>`;

    const barDividers = segsWithX.slice(0, -1).map(s =>
      `<line x1="${s.x1}" y1="${BAR_Y}" x2="${s.x1}" y2="${BAR_Y + BAR_H}"
             stroke="rgba(0,0,0,0.20)" stroke-width="2" />`
    ).join("");

    const barLabels = segsWithX.map(s => {
      if (s.w < 80) return "";
      return `<text x="${s.xMid}" y="${BAR_Y + BAR_H / 2 + 8}"
                    text-anchor="middle" font-size="24" font-weight="700"
                    fill="rgba(255,255,255,0.95)">${s.label}</text>`;
    }).join("");

    const MDI = {
      solar:   "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
      battery: "M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z",
      tower:   "M11,7.5L9.5,3H14.5L13,7.5H15L18,3H21L15,12H17L21,21H15L12,15L9,21H3L7,12H9L3,3H6L9,7.5H11M12,13.5L13.9,19H10.1L12,13.5Z",
      home:    "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
      ev:      "M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12V10Z",
      solpan:  "M4,6H20A2,2 0 0,1 22,8V16A2,2 0 0,1 20,18H4A2,2 0 0,1 2,16V8A2,2 0 0,1 4,6M4,8V16H20V8H4M5,9H11V13H5V9M12,9H19V13H12V9M5,14H11V16H5V14M12,14H19V16H12V14Z",
      heat:    "M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 12,22A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V14.08C14.16,14.54 15,15.67 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17C9,15.67 9.84,14.54 11,14.08V5A1,1 0 0,1 12,4Z",
    };
    const srcPathMap = { "seg-pv": MDI.solar, "seg-battd": MDI.battery, "seg-gridin": MDI.tower };
    segsWithX.forEach(s => { s.srcPath = srcPathMap[s.cls] || ""; });
    const botPathMap = { "🏠": MDI.home, "🔌": MDI.ev, "🔋": MDI.battery, "🗼": MDI.tower };
    botSegsWithX.forEach(s => { s.mdiPath = botPathMap[s.icon] || ""; });

    const SVG_ICON_HALF = 12;

    const topBraces = segsWithX.map(s => {
      const path  = bracePath(s.x0 + 2, s.x1 - 2, BAR_Y, TOP_TIP_Y);
      const ix = s.xMid - SVG_ICON_HALF, iy = TOP_TIP_Y - SVG_ICON_HALF;
      return `
        <path d="${path}" fill="none"
              style="stroke:var(--primary-text-color,#212121);opacity:0.45"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <g transform="translate(${ix},${iy})" style="opacity:0.85">
          <path d="${s.srcPath}" style="fill:var(--primary-text-color,#212121)" />
        </g>`;
    }).join("");

    const botBraces = botSegsWithX.map(s => {
      const path  = bracePath(s.x0 + 2, s.x1 - 2, BAR_Y + BAR_H, BOT_TIP_Y);
      const ix = s.xMid - SVG_ICON_HALF, iy = BOT_TIP_Y - SVG_ICON_HALF;
      return `
        <path d="${path}" fill="none"
              style="stroke:var(--primary-text-color,#212121);opacity:0.45"
              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <g transform="translate(${ix},${iy})" style="opacity:0.85">
          <path d="${s.mdiPath}" style="fill:var(--primary-text-color,#212121)" />
        </g>`;
    }).join("");

    const LX = BAR_X1 + 18;
    const sideLabels = `
      <text x="${LX}" y="${TOP_TIP_Y}" text-anchor="start" dominant-baseline="central"
            font-size="19" font-weight="700"
            style="fill:var(--secondary-text-color,#757575)">IN</text>
      <text x="${LX}" y="${BOT_TIP_Y}" text-anchor="start" dominant-baseline="central"
            font-size="19" font-weight="700"
            style="fill:var(--secondary-text-color,#757575)">OUT</text>`;

    const flowBar = `
      <div class="flow-wrap">
        <svg viewBox="0 0 ${SVG_W} ${SVG_H}" width="100%"
             style="display:block;overflow:visible;font-family:inherit">
          ${barClip}
          ${barDividers}
          ${barLabels}
          ${topBraces}
          ${botBraces}
          ${sideLabels}
        </svg>
      </div>
    `;

    const row = (icon, label, sub, pw, pwClass = "", indent = false, entityId = null) => `
      <div class="site-row ${indent ? "site-row-indent" : ""}${entityId ? " site-row-clickable" : ""}"${entityId ? ` data-more-info="${entityId}"` : ""}>
        <span class="site-row-icon">${icon}</span>
        <span class="site-row-label">
          <span class="site-row-name">${label}</span>
          ${sub ? `<span class="site-row-sub">${sub}</span>` : ""}
        </span>
        <span class="site-row-pw ${pwClass}">${fmtPow(pw)}</span>
      </div>`;

    const section = (title, total, rows) => `
      <div class="site-section">
        <div class="site-section-head">
          <span class="site-section-title">${title}</span>
          <span class="site-section-total">${fmtPow(total)}</span>
        </div>
        ${rows}
      </div>`;

    const inTotal  = pvPow + battDischPow + bezugPow;
    const outTotal = homePow + chargePow + battChargePow + feedinPow;

    const lpRows = Object.entries(loadpoints)
      .filter(([, ents]) => kw(ents.charge_power) > 0.05)
      .map(([lpName, ents]) => {
        const lpPow  = kw(ents.charge_power);
        const unit   = ents.vehicle_soc ? unitStr(this._hass, ents.vehicle_soc) : "";
        const val    = ents.vehicle_soc
          ? `${Math.round(parseFloat(stateVal(this._hass, ents.vehicle_soc)) || 0)} ${unit}`
          : "";
        const lpTitle = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;
        const label  = val ? `${lpTitle} – ${val}` : lpTitle;
        const icon   = unit.includes("°")
          ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="var(--secondary-text-color)" style="vertical-align:middle"><path d="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 12,22A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V14.08C14.16,14.54 15,15.67 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17C9,15.67 9.84,14.54 11,14.08V5A1,1 0 0,1 12,4Z"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="var(--secondary-text-color)" style="vertical-align:middle"><path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12V10Z"/></svg>`;
        return row(icon, label, "", lpPow, "site-pw-blue", true, ents.charge_power);
      }).join("");

    const pvRows = pvSources.length > 1
      ? pvSources.map(s => {
          const p = kw(site[s.key]);
          return p > 0.005 ? row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M4,6H20A2,2 0 0,1 22,8V16A2,2 0 0,1 20,18H4A2,2 0 0,1 2,16V8A2,2 0 0,1 4,6M4,8V16H20V8H4M5,9H11V13H5V9M12,9H19V13H12V9M5,14H11V16H5V14M12,14H19V16H12V14Z\"/></svg>", s.label, "", p, "site-pw-green", true, site[s.key]) : "";
        }).join("")
      : "";

    const battRowIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z\"/></svg>";
    const battDischRows = battSources.length > 1
      ? battSources.map(s => {
          const p = kw(site[s.key]);
          const bSoc = site[s.socKey] ? Math.round(parseFloat(stateVal(this._hass, site[s.socKey])) || 0) : null;
          const label = bSoc !== null ? `${s.label} – ${bSoc} %` : s.label;
          return p > 0.05 ? row(battRowIcon, label, "", p, "", true, site[s.key]) : "";
        }).join("")
      : "";
    const battChargeRows = battSources.length > 1
      ? battSources.map(s => {
          const p = kw(site[s.key]);
          const bSoc = site[s.socKey] ? Math.round(parseFloat(stateVal(this._hass, site[s.socKey])) || 0) : null;
          const label = bSoc !== null ? `${s.label} – ${bSoc} %` : s.label;
          return p < -0.05 ? row(battRowIcon, label, "", Math.abs(p), "", true, site[s.key]) : "";
        }).join("")
      : "";

    const inSection = section(this._t("in") || "In", inTotal, [
      row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z\"/></svg>", this._t("generation"), "", pvPow, "site-pw-green", false, site.pv_power),
      pvRows,
      battDischPow > 0.05
        ? row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z\"/></svg>",
              batterySoc !== null ? `${this._t("battDischarge")} – ${Math.round(batterySoc)} %` : this._t("battDischarge"),
              "", battDischPow, "", false, site.battery_power) : "",
      battDischRows,
      bezugPow > 0.05
        ? row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M11,7.5L9.5,3H14.5L13,7.5H15L18,3H21L15,12H17L21,21H15L12,15L9,21H3L7,12H9L3,3H6L9,7.5H11M12,13.5L13.9,19H10.1L12,13.5Z\"/></svg>", this._t("gridImport"), "", bezugPow, "", false, site.grid_power) : "",
    ].join(""));

    const outSection = section(this._t("out") || "Out", outTotal, [
      row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z\"/></svg>", this._t("consumption"), "", homePow, "", false, site.home_power),
      chargePow > 0.05
        ? row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12V10Z\"/></svg>", this._t("chargePoint"), "", chargePow, "site-pw-blue") + lpRows : "",
      battChargePow > 0.05
        ? row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z\"/></svg>",
              batterySoc !== null ? `${this._t("battCharge")} – ${Math.round(batterySoc)} %` : this._t("battCharge"),
              "", battChargePow, "", false, site.battery_power) : "",
      battChargeRows,
      feedinPow > 0.05
        ? row("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"currentColor\" style=\"vertical-align:middle\"><path d=\"M11,7.5L9.5,3H14.5L13,7.5H15L18,3H21L15,12H17L21,21H15L12,15L9,21H3L7,12H9L3,3H6L9,7.5H11M12,13.5L13.9,19H10.1L12,13.5Z\"/></svg>", this._t("gridExport"), "", feedinPow, "site-pw-yellow", false, site.grid_power) : "",
    ].join(""));

    const siteExpanded = this._siteTableExpanded !== undefined
      ? this._siteTableExpanded
      : (this._config.site_details !== "collapsed");

    return `
      <div class="site-block">
        <div class="lp-header">
          <span class="lp-name">${_headerIcons.home} ${this._config.title || this._t("overview")}</span>
        </div>
        <div class="flow-wrap-clickable" role="button" tabindex="0"
             onclick="window.__evccCards.get('${this._cardId}')._toggleSite()"
             title="${siteExpanded ? this._tInline("siteCollapse") : this._tInline("siteExpand")}">
          ${flowBar}
        </div>
        <div class="site-table" style="${siteExpanded ? '' : 'display:none'}">
          ${inSection}
          <div class="site-section-gap"></div>
          ${outSection}
        </div>
        ${this._renderStatsFooter()}
      </div>`;
  }

  _renderFlowBlock(site, loadpoints = {}) {
    const kw = id => {
      if (!id) return 0;
      const raw  = parseFloat(stateVal(this._hass, id)) || 0;
      const unit = unitStr(this._hass, id);
      return unit === "kW" ? raw : raw / 1000;
    };
    const kwh = id => id ? parseFloat(stateVal(this._hass, id)) || 0 : null;

    const nameFromEntity = (entityId) => entityId ? (attr(this._hass, entityId, "title") ?? null) : null;
    const pvSources = _discoverDeviceSources(site, "pv", "power", "energy").map(s => ({
      ...s,
      label: nameFromEntity(site[s.key]) ?? `PV ${s.idx + 1}`,
    }));
    const pvPow = pvSources.length > 0
      ? pvSources.reduce((sum, s) => sum + kw(site[s.key]), 0)
      : kw(site.pv_power);
    const battSources = _discoverDeviceSources(site, "battery", "power", "soc").map(s => ({
      ...s,
      label: nameFromEntity(site[s.key]) ?? `${this._t("battery")} ${s.idx + 1}`,
    }));
    const gridPow = kw(site.grid_power);
    const battPow = kw(site.battery_power);
    const homePow = kw(site.home_power);
    const chargePow = Object.values(loadpoints)
      .reduce((sum, ents) => sum + kw(ents.charge_power), 0);

    const feedinPow     = gridPow < 0 ? Math.abs(gridPow) : 0;
    const bezugPow      = gridPow > 0 ? gridPow : 0;
    const battChargePow = battPow < 0 ? Math.abs(battPow) : 0;
    const battDischPow  = battPow > 0 ? battPow : 0;

    const batterySoc = kwh(site.battery_soc);

    const fmt     = v => v < 10 ? v.toFixed(1) : Math.round(v).toString();
    const useWatt = Math.max(pvPow + battDischPow + bezugPow, homePow + chargePow + battChargePow + feedinPow) < 1;
    const fmtPow  = v => useWatt ? `${Math.round(v * 1000)} W` : `${fmt(v)} kW`;
    const fmtKw   = v => `${fmt(v)} kW`;
    const fmtKwh  = v => v === null ? "–" : `${fmt(v)} kWh`;

    // --- Source nodes (top) ---
    const sources = [];
    if (pvPow > 0.01)        sources.push({ id: "pv",   label: this._t("generation"),    pow: pvPow,        color: "var(--evcc-green)",  entity: site.pv_power });
    if (battDischPow > 0.01) sources.push({ id: "batt", label: batterySoc !== null ? `${this._t("battDischarge")} ${Math.round(batterySoc)} %` : this._t("battDischarge"), pow: battDischPow, color: "var(--evcc-orange)", entity: site.battery_power });
    if (bezugPow > 0.01)     sources.push({ id: "grid", label: this._t("gridImport"),    pow: bezugPow,     color: "var(--evcc-red)",    entity: site.grid_power });

    // --- Consumer nodes (bottom) ---
    const consumers = [];
    if (homePow > 0.01)       consumers.push({ id: "home",   label: this._t("consumption"),  pow: homePow,       color: "var(--secondary-text-color)", entity: site.home_power });
    // Individual loadpoints
    Object.entries(loadpoints).forEach(([lpName, ents]) => {
      const lpPow = kw(ents.charge_power);
      if (lpPow > 0.01) {
        const unit = ents.vehicle_soc ? unitStr(this._hass, ents.vehicle_soc) : "";
        const soc  = ents.vehicle_soc ? Math.round(parseFloat(stateVal(this._hass, ents.vehicle_soc)) || 0) : null;
        const isHeat = unit.includes("°");
        consumers.push({
          id: isHeat ? "heat" : "ev",
          label: lpName,
          pow: lpPow,
          color: "var(--evcc-blue)",
          entity: ents.charge_power,
          sub: soc !== null ? `${soc} ${unit}` : "",
        });
      }
    });
    if (battChargePow > 0.01) consumers.push({ id: "battc",  label: batterySoc !== null ? `${this._t("battCharge")} ${Math.round(batterySoc)} %` : this._t("battCharge"), pow: battChargePow, color: "var(--evcc-orange)", entity: site.battery_power });
    if (feedinPow > 0.01)     consumers.push({ id: "feedin", label: this._t("gridExport"),   pow: feedinPow,     color: "var(--evcc-yellow)",          entity: site.grid_power });

    if (sources.length === 0)   sources.push({ id: "none", label: "–", pow: 0.001, color: "var(--secondary-text-color)", entity: null });
    if (consumers.length === 0) consumers.push({ id: "none", label: "–", pow: 0.001, color: "var(--secondary-text-color)", entity: null });

    const totalSrc = sources.reduce((s, n) => s + n.pow, 0);
    const totalDst = consumers.reduce((s, n) => s + n.pow, 0);

    // --- PV-first flow distribution ---
    // flows[i][j] = power from source i to consumer j
    const flows = sources.map(() => consumers.map(() => 0));

    // Distribute PV first, then battery, then grid
    const srcOrder = ["pv", "batt", "grid", "none"];
    const sortedSrcIdx = [...sources.keys()].sort((a, b) =>
      srcOrder.indexOf(sources[a].id) - srcOrder.indexOf(sources[b].id)
    );

    const remaining = consumers.map(c => c.pow);
    for (const si of sortedSrcIdx) {
      let avail = sources[si].pow;
      for (let ci = 0; ci < consumers.length && avail > 0.001; ci++) {
        const take = Math.min(avail, remaining[ci]);
        if (take > 0.001) {
          flows[si][ci] = take;
          avail -= take;
          remaining[ci] -= take;
        }
      }
    }

    // --- Horizontal Sankey SVG (HA-style with icons) ---
    const MDI_ICON = {
      pv:     "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
      batt:   "M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z",
      grid:   "M11,7.5L9.5,3H14.5L13,7.5H15L18,3H21L15,12H17L21,21H15L12,15L9,21H3L7,12H9L3,3H6L9,7.5H11M12,13.5L13.9,19H10.1L12,13.5Z",
      home:   "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
      ev:     "M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12V10Z",
      heat:   "M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 12,22A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V14.08C14.16,14.54 15,15.67 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17C9,15.67 9.84,14.54 11,14.08V5A1,1 0 0,1 12,4Z",
    };
    // Map node id to icon
    const srcIconMap = { pv: MDI_ICON.pv, batt: MDI_ICON.batt, grid: MDI_ICON.grid };
    const dstIconMap = { home: MDI_ICON.home, ev: MDI_ICON.ev, heat: MDI_ICON.heat, battc: MDI_ICON.batt, feedin: MDI_ICON.grid };

    // Short sub-label: SoC for battery nodes (LP nodes already have sub set)
    sources.forEach(s => {
      s.sub = (s.id === "batt" && batterySoc !== null) ? `${Math.round(batterySoc)} %` : "";
    });
    consumers.forEach(c => {
      if (c.sub === undefined) c.sub = (c.id === "battc" && batterySoc !== null) ? `${Math.round(batterySoc)} %` : "";
    });

    const NODE_W = 8;
    const NODE_GAP = 6;
    const ICON_SIZE = 16;
    const LABEL_PAD = 6;
    const FLOW_GAP = 140;
    const SVG_PAD = 4;

    // Compute total heights proportional to power
    const maxH = 120;
    const scaleH = maxH / Math.max(totalSrc, totalDst, 0.001);

    const srcHeights = sources.map(s => Math.max(10, s.pow * scaleH));
    const dstHeights = consumers.map(c => Math.max(10, c.pow * scaleH));

    const srcTotalH = srcHeights.reduce((a, b) => a + b, 0) + (sources.length - 1) * NODE_GAP;
    const dstTotalH = dstHeights.reduce((a, b) => a + b, 0) + (consumers.length - 1) * NODE_GAP;
    const contentH  = Math.max(srcTotalH, dstTotalH, 50);

    // Label area: icon(16) + gap(4) + text(~55) = ~75
    const srcLabelW = 80;
    const dstLabelW = 80;
    const SVG_W = srcLabelW + NODE_W + FLOW_GAP + NODE_W + dstLabelW;
    const SVG_H = contentH + 2 * SVG_PAD;

    const srcX = srcLabelW;
    const dstX = srcLabelW + NODE_W + FLOW_GAP;

    const srcStartY = SVG_PAD + (contentH - srcTotalH) / 2;
    const dstStartY = SVG_PAD + (contentH - dstTotalH) / 2;

    let cumSrcY = srcStartY;
    const srcNodes = sources.map((s, i) => {
      const y = cumSrcY;
      const h = srcHeights[i];
      cumSrcY += h + NODE_GAP;
      return { ...s, x: srcX, y, h, cy: y + h / 2 };
    });

    let cumDstY = dstStartY;
    const dstNodes = consumers.map((c, i) => {
      const y = cumDstY;
      const h = dstHeights[i];
      cumDstY += h + NODE_GAP;
      return { ...c, x: dstX, y, h, cy: y + h / 2 };
    });

    const sankeyId = `sankey-${this._cardId}`;

    // --- Flow paths ---
    const srcRightOffsets = srcNodes.map(() => 0);
    const dstLeftOffsets  = dstNodes.map(() => 0);
    const flowPaths = [];

    for (let si = 0; si < sources.length; si++) {
      for (let ci = 0; ci < consumers.length; ci++) {
        const f = flows[si][ci];
        if (f < 0.001) continue;

        const sn = srcNodes[si];
        const dn = dstNodes[ci];

        const srcBandH = (f / sn.pow) * sn.h;
        const dstBandH = (f / dn.pow) * dn.h;

        const sy0 = sn.y + srcRightOffsets[si];
        const sy1 = sy0 + srcBandH;
        const dy0 = dn.y + dstLeftOffsets[ci];
        const dy1 = dy0 + dstBandH;

        srcRightOffsets[si] += srcBandH;
        dstLeftOffsets[ci]  += dstBandH;

        const sx = srcX + NODE_W;
        const dx = dstX;
        const cx1 = sx + FLOW_GAP * 0.45;
        const cx2 = dx - FLOW_GAP * 0.45;

        const path = [
          `M ${sx} ${sy0}`,
          `C ${cx1} ${sy0}, ${cx2} ${dy0}, ${dx} ${dy0}`,
          `L ${dx} ${dy1}`,
          `C ${cx2} ${dy1}, ${cx1} ${sy1}, ${sx} ${sy1}`,
          `Z`
        ].join(" ");

        flowPaths.push(`<path d="${path}" fill="${sn.color}" opacity="0.35"/>`);
      }
    }

    // --- Node rects + labels as clickable groups ---
    const svgMdi = (path, x, y, color) =>
      `<g transform="translate(${x},${y}) scale(0.667)"><path d="${path}" fill="${color}"/></g>`;

    const srcGroups = srcNodes.map(s => {
      const iconPath = srcIconMap[s.id] || "";
      const iconX = s.x - LABEL_PAD - ICON_SIZE;
      const iconY = s.cy - ICON_SIZE / 2;
      const textX = iconX - 4;
      const sub = s.sub ? `
        <text x="${textX}" y="${s.cy + 12}" text-anchor="end" dominant-baseline="central"
              font-size="9" style="fill:var(--secondary-text-color)">${s.sub}</text>` : "";
      const inner = `
        <rect x="${s.x}" y="${s.y}" width="${NODE_W}" height="${s.h}" rx="3" fill="${s.color}"/>
        ${iconPath ? svgMdi(iconPath, iconX, iconY, s.color) : ""}
        <text x="${textX}" y="${s.cy - (s.sub ? 2 : 0)}" text-anchor="end" dominant-baseline="central"
              font-size="11" font-weight="700" style="fill:var(--primary-text-color)">${fmtPow(s.pow)}</text>
        ${sub}`;
      return s.entity
        ? `<g data-more-info="${s.entity}" style="cursor:pointer" class="sankey-node">${inner}</g>`
        : inner;
    }).join("");

    const dstGroups = dstNodes.map(d => {
      const iconPath = dstIconMap[d.id] || "";
      const iconX = d.x + NODE_W + LABEL_PAD;
      const iconY = d.cy - ICON_SIZE / 2;
      const textX = iconX + ICON_SIZE + 4;
      const sub = d.sub ? `
        <text x="${textX}" y="${d.cy + 12}" text-anchor="start" dominant-baseline="central"
              font-size="9" style="fill:var(--secondary-text-color)">${d.sub}</text>` : "";
      const inner = `
        <rect x="${d.x}" y="${d.y}" width="${NODE_W}" height="${d.h}" rx="3" fill="${d.color}"/>
        ${iconPath ? svgMdi(iconPath, iconX, iconY, d.color) : ""}
        <text x="${textX}" y="${d.cy - (d.sub ? 2 : 0)}" text-anchor="start" dominant-baseline="central"
              font-size="11" font-weight="700" style="fill:var(--primary-text-color)">${fmtPow(d.pow)}</text>
        ${sub}`;
      return d.entity
        ? `<g data-more-info="${d.entity}" style="cursor:pointer" class="sankey-node">${inner}</g>`
        : inner;
    }).join("");

    const siteExpanded = this._siteTableExpanded !== undefined
      ? this._siteTableExpanded
      : (this._config.site_details !== "collapsed");

    const chevronX = srcLabelW + NODE_W + FLOW_GAP / 2 - 9;
    const chevronY = SVG_H / 2 - 9;
    const chevronD = siteExpanded
      ? "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
      : "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";

    const sankeySvg = `
      <div class="sankey-wrap" role="button" tabindex="0" style="cursor:pointer"
           onclick="if(!event.target.closest('[data-more-info]'))window.__evccCards.get('${this._cardId}')._toggleSite()">
        <svg viewBox="0 0 ${SVG_W} ${SVG_H}" width="100%" preserveAspectRatio="xMidYMid meet"
             style="display:block;overflow:visible;font-family:inherit">
          ${flowPaths.join("")}
          ${srcGroups}
          ${dstGroups}
          <g class="sankey-center-chevron" transform="translate(${chevronX},${chevronY}) scale(0.75)"
             style="fill:var(--primary-text-color);opacity:0.35;pointer-events:none">
            <path d="${chevronD}"/>
          </g>
        </svg>
      </div>
    `;

    // --- MDI icon paths for table ---
    const MDI = {
      solar:   "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
      battery: "M15.67,4H14V2H10V4H8.33C7.6,4 7,4.6 7,5.33V20.67C7,21.4 7.6,22 8.33,22H15.67C16.4,22 17,21.4 17,20.67V5.33C17,4.6 16.4,4 15.67,4M13,18H11V16H9L12,11V14H14L13,18Z",
      tower:   "M11,7.5L9.5,3H14.5L13,7.5H15L18,3H21L15,12H17L21,21H15L12,15L9,21H3L7,12H9L3,3H6L9,7.5H11M12,13.5L13.9,19H10.1L12,13.5Z",
      home:    "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
      ev:      "M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12V10Z",
      heat:    "M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 12,22A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V14.08C14.16,14.54 15,15.67 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17C9,15.67 9.84,14.54 11,14.08V5A1,1 0 0,1 12,4Z",
    };

    // --- IN/OUT table ---
    const row = (icon, label, sub, pw, pwClass = "", indent = false, entityId = null) => `
      <div class="site-row ${indent ? "site-row-indent" : ""}${entityId ? " site-row-clickable" : ""}"${entityId ? ` data-more-info="${entityId}"` : ""}>
        <span class="site-row-icon">${icon}</span>
        <span class="site-row-label">
          <span class="site-row-name">${label}</span>
          ${sub ? `<span class="site-row-sub">${sub}</span>` : ""}
        </span>
        <span class="site-row-pw ${pwClass}">${fmtPow(pw)}</span>
      </div>`;

    const section = (title, total, rows) => `
      <div class="site-section">
        <div class="site-section-head">
          <span class="site-section-title">${title}</span>
          <span class="site-section-total">${fmtPow(total)}</span>
        </div>
        ${rows}
      </div>`;

    const inTotal  = pvPow + battDischPow + bezugPow;
    const outTotal = homePow + chargePow + battChargePow + feedinPow;

    const lpRows = Object.entries(loadpoints)
      .filter(([, ents]) => kw(ents.charge_power) > 0.05)
      .map(([lpName, ents]) => {
        const lpPow  = kw(ents.charge_power);
        const unit   = ents.vehicle_soc ? unitStr(this._hass, ents.vehicle_soc) : "";
        const val    = ents.vehicle_soc
          ? `${Math.round(parseFloat(stateVal(this._hass, ents.vehicle_soc)) || 0)} ${unit}`
          : "";
        const lpTitle = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;
        const label  = val ? `${lpTitle} – ${val}` : lpTitle;
        const icon   = unit.includes("°")
          ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="var(--secondary-text-color)" style="vertical-align:middle"><path d="${MDI.heat || "M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 12,22A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V14.08C14.16,14.54 15,15.67 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17C9,15.67 9.84,14.54 11,14.08V5A1,1 0 0,1 12,4Z"}"/></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="var(--secondary-text-color)" style="vertical-align:middle"><path d="${MDI.ev}"/></svg>`;
        return row(icon, label, "", lpPow, "site-pw-blue", true, ents.charge_power);
      }).join("");

    const pvRows = pvSources.length > 1
      ? pvSources.map(s => {
          const p = kw(site[s.key]);
          return p > 0.005 ? row(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:middle"><path d="M4,6H20A2,2 0 0,1 22,8V16A2,2 0 0,1 20,18H4A2,2 0 0,1 2,16V8A2,2 0 0,1 4,6M4,8V16H20V8H4M5,9H11V13H5V9M12,9H19V13H12V9M5,14H11V16H5V14M12,14H19V16H12V14Z"/></svg>`, s.label, "", p, "site-pw-green", true, site[s.key]) : "";
        }).join("")
      : "";

    const battRowIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:middle"><path d="${MDI.battery}"/></svg>`;
    const battDischRows = battSources.length > 1
      ? battSources.map(s => {
          const p = kw(site[s.key]);
          const bSoc = site[s.socKey] ? Math.round(parseFloat(stateVal(this._hass, site[s.socKey])) || 0) : null;
          const label = bSoc !== null ? `${s.label} – ${bSoc} %` : s.label;
          return p > 0.05 ? row(battRowIcon, label, "", p, "", true, site[s.key]) : "";
        }).join("")
      : "";
    const battChargeRows = battSources.length > 1
      ? battSources.map(s => {
          const p = kw(site[s.key]);
          const bSoc = site[s.socKey] ? Math.round(parseFloat(stateVal(this._hass, site[s.socKey])) || 0) : null;
          const label = bSoc !== null ? `${s.label} – ${bSoc} %` : s.label;
          return p < -0.05 ? row(battRowIcon, label, "", Math.abs(p), "", true, site[s.key]) : "";
        }).join("")
      : "";

    const svgIcon = (path) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align:middle"><path d="${path}"/></svg>`;

    const inSection = section(this._t("in") || "In", inTotal, [
      row(svgIcon(MDI.solar), this._t("generation"), "", pvPow, "site-pw-green", false, site.pv_power),
      pvRows,
      battDischPow > 0.05
        ? row(svgIcon(MDI.battery),
              batterySoc !== null ? `${this._t("battDischarge")} – ${Math.round(batterySoc)} %` : this._t("battDischarge"),
              "", battDischPow, "", false, site.battery_power) : "",
      battDischRows,
      bezugPow > 0.05
        ? row(svgIcon(MDI.tower), this._t("gridImport"), "", bezugPow, "", false, site.grid_power) : "",
    ].join(""));

    const outSection = section(this._t("out") || "Out", outTotal, [
      row(svgIcon(MDI.home), this._t("consumption"), "", homePow, "", false, site.home_power),
      chargePow > 0.05
        ? row(svgIcon(MDI.ev), this._t("chargePoint"), "", chargePow, "site-pw-blue") + lpRows : "",
      battChargePow > 0.05
        ? row(svgIcon(MDI.battery),
              batterySoc !== null ? `${this._t("battCharge")} – ${Math.round(batterySoc)} %` : this._t("battCharge"),
              "", battChargePow, "", false, site.battery_power) : "",
      battChargeRows,
      feedinPow > 0.05
        ? row(svgIcon(MDI.tower), this._t("gridExport"), "", feedinPow, "site-pw-yellow", false, site.grid_power) : "",
    ].join(""));

    return `
      <div class="site-block">
        <div class="lp-header">
          <span class="lp-name">${_headerIcons.transfer} ${this._config.title || this._t("energyFlow") || this._t("overview")}</span>
        </div>
        ${sankeySvg}
        <div class="site-table" style="${siteExpanded ? '' : 'display:none'}">
          ${inSection}
          <div class="site-section-gap"></div>
          ${outSection}
        </div>
        ${this._renderStatsFooter()}
      </div>`;
  }

  _renderSiteBlock2(site, loadpoints = {}) {
    const kw = id => {
      if (!id) return 0;
      const raw  = parseFloat(stateVal(this._hass, id)) || 0;
      const unit = unitStr(this._hass, id);
      return unit === "kW" ? raw : raw / 1000;
    };

    const pvSources = _discoverDeviceSources(site, "pv", "power");

    const battSources = _discoverDeviceSources(site, "battery", "power", "soc").map(s => ({
      ...s,
      label: (site[s.key] ? (attr(this._hass, site[s.key], "title") ?? null) : null) ?? `${this._t("battery")} ${s.idx + 1}`,
    }));

    const pvPow         = pvSources.length > 0
      ? pvSources.reduce((sum, s) => sum + kw(site[s.key]), 0)
      : kw(site.pv_power);
    const gridPow       = kw(site.grid_power);
    const battPow       = kw(site.battery_power);
    const homePow       = kw(site.home_power);
    const feedinPow     = gridPow < 0 ? Math.abs(gridPow) : 0;
    const bezugPow      = gridPow > 0 ? gridPow : 0;
    const battDischPow  = battPow > 0 ? battPow : 0;
    const battChargePow = battPow < 0 ? Math.abs(battPow) : 0;

    const totalIn = pvPow + battDischPow + bezugPow;
    const pvShare = totalIn > 0.05 ? Math.round(pvPow / totalIn * 100) : 0;

    const fmt   = v => v < 10 ? v.toFixed(1) : Math.round(v).toString();
    const fmtKw = v => `${fmt(v)} kW`;

    const importing = bezugPow > 0.05;
    const exporting = feedinPow > 0.05;
    const netColor  = importing ? "var(--evcc-red)" : exporting ? "var(--evcc-green)" : "var(--secondary-text-color)";
    const netAbs    = importing ? bezugPow : feedinPow;
    const netValStr = (importing || exporting)
      ? `${importing ? "+" : "−"}${fmtKw(netAbs)}`
      : "–";
    const netLabel  = importing
      ? this._t("gridImport")
      : exporting
        ? this._t("gridExport")
        : this._t("gridNeutral") || "–";

    const pvBadge = pvShare > 0
      ? `<div class="s2-pv-badge">
           <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z"/></svg>
           ${pvShare} % ${this._t("solar") || "Solar"}
         </div>`
      : "";

    const chip = (dot, label, sub, entityId = null) =>
      `<div class="s2-chip${entityId ? " s2-chip-clickable" : ""}"${entityId ? ` data-more-info="${entityId}"` : ""}>
        <span class="s2-chip-dot" style="background:${dot}"></span>
        <span class="s2-chip-name">${label}</span>
        ${sub ? `<span class="s2-chip-sub">${sub}</span>` : ""}
      </div>`;

    const lpChips = Object.entries(loadpoints)
      .filter(([, ents]) => kw(ents.charge_power) > 0.05)
      .map(([lpName, ents]) => {
        const lpPow = kw(ents.charge_power);
        const unit  = ents.vehicle_soc ? unitStr(this._hass, ents.vehicle_soc) : "";
        const soc   = ents.vehicle_soc
          ? `${Math.round(parseFloat(stateVal(this._hass, ents.vehicle_soc)) || 0)} ${unit}`
          : "";
        const lpTitle = this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;
        return chip("var(--evcc-blue)", lpTitle, soc ? `${fmtKw(lpPow)} · ${soc}` : fmtKw(lpPow), ents.charge_power);
      }).join("");

    const aggBattSoc = site.battery_soc ? Math.round(parseFloat(stateVal(this._hass, site.battery_soc)) || 0) : null;

    const battDischChips = battSources.length > 1
      ? battSources.flatMap(s => {
          const p = kw(site[s.key]);
          if (p <= 0.05) return [];
          const bSoc = site[s.socKey] ? Math.round(parseFloat(stateVal(this._hass, site[s.socKey])) || 0) : null;
          return [chip("var(--evcc-orange)", s.label, bSoc !== null ? `${fmtKw(p)} · ${bSoc} %` : fmtKw(p), site[s.key])];
        })
      : battDischPow > 0.05 ? [chip("var(--evcc-orange)", this._t("battDischarge"), aggBattSoc !== null ? `${fmtKw(battDischPow)} · ${aggBattSoc} %` : fmtKw(battDischPow), site.battery_power)] : [];

    const battChargeChips = battSources.length > 1
      ? battSources.flatMap(s => {
          const p = kw(site[s.key]);
          if (p >= -0.05) return [];
          const bSoc = site[s.socKey] ? Math.round(parseFloat(stateVal(this._hass, site[s.socKey])) || 0) : null;
          return [chip("var(--evcc-orange)", s.label, bSoc !== null ? `${fmtKw(Math.abs(p))} · ${bSoc} %` : fmtKw(Math.abs(p)), site[s.key])];
        })
      : battChargePow > 0.05 ? [chip("var(--evcc-orange)", this._t("battCharge"), aggBattSoc !== null ? `${fmtKw(battChargePow)} · ${aggBattSoc} %` : fmtKw(battChargePow), site.battery_power)] : [];

    const srcChips = [
      pvPow        > 0.05 ? chip("var(--evcc-green)",  this._t("generation"),    fmtKw(pvPow),    site.pv_power)    : "",
      bezugPow     > 0.05 ? chip("var(--evcc-red)",    this._t("gridImport"),    fmtKw(bezugPow), site.grid_power)  : "",
      ...battDischChips,
    ].filter(Boolean).join("");

    const dstChips = [
      homePow      > 0.05 ? chip("var(--secondary-text-color)", this._t("consumption"), fmtKw(homePow),   site.home_power)  : "",
      lpChips,
      ...battChargeChips,
      feedinPow    > 0.05 ? chip("var(--evcc-yellow)", this._t("gridExport"),   fmtKw(feedinPow), site.grid_power)  : "",
    ].filter(Boolean).join("");

    const section = (labelKey, chips) => chips
      ? `<div class="s2-section">
           <div class="s2-section-label">${this._t(labelKey)}</div>
           <div class="s2-chips">${chips}</div>
         </div>`
      : "";

    return `
      <div class="s2-block">
        <div class="lp-header">
          <span class="lp-name">${_headerIcons.grid} ${this._config.title || this._t("grid")}</span>
        </div>
        <div class="s2-net">
          <div class="s2-net-label">${this._t("gridStatus") || "Netzstatus"}</div>
          <div class="s2-net-value" style="color:${netColor}">${netValStr}</div>
          <div class="s2-net-status" style="color:${netColor}">${netLabel}</div>
          ${pvBadge}
        </div>
        ${section("generation", srcChips)}
        ${section("consumption", dstChips)}
        ${this._renderStatsFooter()}
      </div>`;
  }

  _getStatEntityIds(period) {
    const per  = period ?? this._statsPeriod ?? "total";
    const base = `sensor.${this._getPrefix()}`;
    // Try multiple entity name candidates, return first that exists
    const findFirst = (...ids) => ids.find(id => this._hass?.states[id]) ?? null;

    // New integration: stats_{period_key}_{metric_key}
    // Old integration: stat30_*, stat365_*, stat_this_year_*, stat_total_*
    const newOldMap = {
      total:    {
        kwh:   ["stats_total_charged_kwh",    "stat_total_charged_kwh"],
        solar: ["stats_total_solar_percentage","stat_total_solar_percentage"],
        price: ["stats_total_avg_price",       "stat_total_avg_price"],
      },
      month:    {
        kwh:   ["stats_30d_charged_kwh",    "stat30_charged_kwh"],
        solar: ["stats_30d_solar_percentage","stat30_solar_percentage"],
        price: ["stats_30d_avg_price",       "stat30_avg_price"],
      },
      year:     {
        kwh:   ["stats_this_year_charged_kwh",    "stat_this_year_charged_kwh"],
        solar: ["stats_this_year_solar_percentage","stat_this_year_solar_percentage"],
        price: ["stats_this_year_avg_price",       "stat_this_year_avg_price"],
      },
    };
    const s = newOldMap[per] ?? newOldMap.total;
    return {
      kwhId:      findFirst(...s.kwh.map(n => `${base}${n}`)),
      solarId:    findFirst(...s.solar.map(n => `${base}${n}`)),
      priceId:    findFirst(...s.price.map(n => `${base}${n}`)),
      solarKwhId: findFirst(`${base}stats_total_solar_kwh`, `${base}stat_total_solar_k_wh_template`),
    };
  }


  _renderBarChart(data, yUnit = "kWh", showRollingAvg = false) {
    const ML = 22, MR = showRollingAvg ? 26 : 6, MT = 20, MB = 18;
    const W = 280, H = 110;
    const CW = W - ML - MR, CH = H - MT - MB;
    const n = data.length;
    const GAP = n > 20 ? 1 : 2;
    // Uniform bar width; center the bar group within CW
    const bw     = Math.floor((CW - GAP * (n - 1)) / n);
    const offset = Math.round((CW - (bw * n + GAP * (n - 1))) / 2);
    const barX0  = i => ML + offset + i * (bw + GAP);
    const barX1  = i => barX0(i) + bw;
    const maxVal = Math.max(...data.map(d => d.delta ?? 0), 0.1);

    // Nice Y-axis: round step up to 1/2/5/10/20/50… then derive tick count
    const rawStep  = maxVal / 5;
    const stepExp  = Math.floor(Math.log10(Math.max(rawStep, 0.001)));
    const stepBase = Math.pow(10, stepExp);
    const stepF    = rawStep / stepBase;
    const tickStep = (stepF <= 1 ? 1 : stepF <= 2 ? 2 : stepF <= 5 ? 5 : 10) * stepBase;
    const numTicks = Math.ceil(maxVal / tickStep);
    const niceMax  = tickStep * numTicks;
    const toY = v => MT + CH - Math.round((v / niceMax) * CH);

    // Grid lines + Y-axis labels (labels left-external, right-aligned)
    const grid = Array.from({ length: numTicks + 1 }, (_, i) => {
      const v = i * tickStep;
      const y = toY(v);
      const lbl = tickStep >= 1 ? Math.round(v) : v.toFixed(1);
      return `<line x1="${ML}" y1="${y}" x2="${W - MR}" y2="${y}"
                stroke="var(--divider-color,#374151)" stroke-width="${i === 0 ? 1 : 0.5}"
                opacity="${i === 0 ? 0.9 : 0.35}"/>
              <text x="${ML - 3}" y="${y + 3}" text-anchor="end" font-size="6.5"
                fill="var(--secondary-text-color,#888)">${lbl}</text>`;
    }).join("");

    // Unit label above the topmost tick, like HA
    const kwhLbl = `<text x="${ML - 3}" y="${MT - 8}" text-anchor="end" font-size="6.5"
      fill="var(--secondary-text-color,#888)">${yUnit}</text>`;

    // X-axis label spacing
    const showEvery = n > 15 ? Math.ceil(n / 7) : 1;

    const rollingAvgs = [];

    const bars = data.map((d, i) => {
      const x0        = barX0(i);
      const x1        = barX1(i);
      const cx        = (x0 + x1) / 2;
      const isCurrent = d.isCurrent ?? (i === n - 1);
      const opacity   = isCurrent ? "0.9" : "0.55";
      const R         = bw >= 4 ? 1.5 : 0;

      let barRect = "";
      if (d.segments?.length > 0) {
        // Stacked bars – bottom to top
        let stackY = MT + CH;
        d.segments.slice().reverse().forEach(seg => {
          if (seg.value == null || seg.value <= 0) return;
          const segPx = Math.max(1, Math.round((seg.value / niceMax) * CH));
          stackY -= segPx;
          barRect += `<rect x="${x0}" y="${stackY}" width="${bw}" height="${segPx}" fill="${seg.color}" opacity="${opacity}" rx="${R}"/>`;
        });
      } else if (d.delta != null && d.delta > 0) {
        const totalPx = Math.max(2, Math.round((d.delta / niceMax) * CH));
        const topY    = toY(d.delta);
        const hasSolar = d.solarDelta != null && d.solarDelta > 0;
        if (hasSolar) {
          const solarPx = Math.min(totalPx, Math.round((d.solarDelta / d.delta) * totalPx));
          const gridPx  = totalPx - solarPx;
          barRect =
            (solarPx > 0 ? `<rect x="${x0}" y="${topY}"            width="${bw}" height="${solarPx}" fill="var(--evcc-green,#22c55e)"    opacity="${opacity}" rx="${R}"/>` : "") +
            (gridPx  > 0 ? `<rect x="${x0}" y="${topY + solarPx}"  width="${bw}" height="${gridPx}"  fill="var(--primary-color,#3b82f6)" opacity="${opacity}" rx="${R}"/>` : "");
        } else {
          barRect = `<rect x="${x0}" y="${topY}" width="${bw}" height="${totalPx}"
            fill="var(--primary-color,#3b82f6)" opacity="${opacity}" rx="${R}"/>`;
        }
      }

      const showLabel = (i % showEvery === 0) || i === n - 1;
      const labelSvg  = showLabel
        ? `<text x="${cx}" y="${H - MB + 12}" text-anchor="middle" font-size="6.5"
             fill="var(--secondary-text-color,#888)" opacity="${isCurrent ? "1" : "0.75"}">${d.labelStr}</text>`
        : "";

      const segsAttr = d.segments
        ? d.segments.map(s => `${s.label}|${s.value != null ? s.value.toFixed(2) : ""}|${s.color}`).join("~")
        : "";
      const hitRect = `<rect class="evcc-bar" x="${x0}" y="${MT}" width="${bw}" height="${CH}"
        fill="transparent" style="cursor:pointer"
        data-label="${d.labelStr.replace(/"/g, "&quot;")}"
        data-total="${d.delta != null ? d.delta.toFixed(2) : ""}"
        data-solar="${d.solarDelta != null ? d.solarDelta.toFixed(2) : ""}"
        data-totalval="${d.totalVal != null ? d.totalVal.toFixed(4) : ""}"
        data-segs="${segsAttr.replace(/"/g, "&quot;")}"/>`;

      return `${barRect}${hitRect}${labelSvg}`;
    }).join("");

    // totalVal line (ct/kWh or g/kWh) + right axis
    let tvLineSvg = "";
    let rightAxisSvg = "";
    if (showRollingAvg) {
      const tvVals = data.map(d => d.totalVal).filter(v => v != null && v > 0);
      if (tvVals.length > 0) {
        const tvMax = Math.max(...tvVals);
        const rawStep2 = tvMax / 4;
        const se2 = Math.floor(Math.log10(Math.max(rawStep2, 0.001)));
        const sb2 = Math.pow(10, se2);
        const sf2 = rawStep2 / sb2;
        const ts2 = (sf2 <= 1 ? 1 : sf2 <= 2 ? 2 : sf2 <= 5 ? 5 : 10) * sb2;
        const nt2 = Math.ceil(tvMax / ts2);
        const nm2 = ts2 * nt2;
        const toY2 = v => MT + CH - Math.round((v / nm2) * CH);
        const rightUnit = yUnit === "€" ? "ct" : "g";
        rightAxisSvg =
          Array.from({ length: nt2 + 1 }, (_, i) => {
            const v = i * ts2;
            const lbl = ts2 >= 1 ? Math.round(v) : v.toFixed(1);
            return `<text x="${W - MR + 3}" y="${toY2(v) + 3}" text-anchor="start" font-size="6.5" fill="var(--secondary-text-color,#888)">${lbl}</text>`;
          }).join("") +
          `<text x="${W - MR + 3}" y="${MT - 8}" text-anchor="start" font-size="6.5" fill="var(--secondary-text-color,#888)">${rightUnit}</text>`;
        const tvPts = [];
        data.forEach((d, i) => {
          if (d.totalVal == null || d.totalVal <= 0) return;
          tvPts.push({ x: (barX0(i) + barX1(i)) / 2, y: toY2(d.totalVal) });
        });
        if (tvPts.length > 1) {
          let pd = `M ${tvPts[0].x} ${tvPts[0].y}`;
          for (let k = 1; k < tvPts.length; k++) {
            const p = tvPts[k - 1], q = tvPts[k];
            const mx = (p.x + q.x) / 2;
            pd += ` C ${mx},${p.y} ${mx},${q.y} ${q.x},${q.y}`;
          }
          tvLineSvg = `<path d="${pd}" fill="none" stroke="var(--secondary-text-color,#888)" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>`;
        }
      }
    }

    // Legend for stacked charts
    const legendGroups = data.find(d => d.segments?.length > 0)?.segments ?? [];
    const legendHtml = legendGroups.length > 1
      ? `<div class="evcc-chart-legend">${legendGroups.map(s =>
          `<span class="ecl-item"><span class="ecl-dot" style="background:${s.color}"></span>${s.label}</span>`
        ).join("")}</div>`
      : "";

    return `<div class="evcc-chart-wrap" data-yunit="${yUnit}">
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block">
        ${grid}${kwhLbl}${bars}${tvLineSvg}${rightAxisSvg}
      </svg>
      <div class="evcc-chart-tooltip" hidden></div>
      ${legendHtml}
    </div>`;
  }

  _renderStatsFooter() {
    const period = this._config.stats_period ?? "total";
    if (period === "none") return "";
    const { kwhId, solarId, priceId } = this._getStatEntityIds(period);
    if (!kwhId && !solarId && !priceId) return "";

    const val = id => id ? (parseFloat(stateVal(this._hass, id)) || 0) : null;
    const kwh   = val(kwhId);
    const solar = val(solarId);
    const price = val(priceId);

    const periodTKey = { "month": "statsPeriodMonth", "year": "statsPeriodYear", "total": "statsPeriodTotal" }[period] ?? "statsPeriodTotal";
    const periodLabel = this._t(periodTKey);

    const items = [
      kwhId   ? `<span class="sf-item"><span class="sf-val">${Math.round(kwh)} kWh</span><span class="sf-lbl">${this._t("statsCharged")}</span></span>` : "",
      solarId ? `<span class="sf-item"><span class="sf-val" style="color:var(--evcc-green)">${Math.round(solar)} %</span><span class="sf-lbl">${this._t("statsSolarShare")}</span></span>` : "",
      priceId ? `<span class="sf-item"><span class="sf-val">${(price * 100).toFixed(1)} ct</span><span class="sf-lbl">${this._t("statsAvgPrice")}</span></span>` : "",
    ].filter(Boolean);

    if (items.length === 0) return "";
    return `<div class="stats-footer"><div class="sf-period">${periodLabel}</div><div class="sf-items">${items.join('<span class="sf-sep"></span>')}</div></div>`;
  }

  // ── Sessions Mode (direct EVCC API) ──────────────────────────────────────

  async _detectEvccUrl() {
    if (this._evccUrl !== undefined) return this._evccUrl;
    try {
      // hass-evcc stores the URL as the config entry's unique_id (set via async_set_unique_id(url))
      // The EVCC site device stores configuration_url = base_url in the device registry
      const devices = await this._hass.callWS({ type: "config/device_registry/list" });
      const evccDev = devices.find(d =>
        d.configuration_url &&
        Array.isArray(d.identifiers) &&
        d.identifiers.some(id => id[0] === "evcc")
      );
      this._evccUrl = evccDev?.configuration_url ?? null;
    } catch(e) {
      console.warn("[evcc-card] Could not detect EVCC URL:", e);
      this._evccUrl = null;
    }
    return this._evccUrl;
  }

  async _fetchStatsData() {
    const url = await this._detectEvccUrl();
    if (!url) return;
    if (Date.now() - this._statsFetchTime < 5 * 60 * 1000) return;
    this._statsFetchTime = Date.now();
    try {
      const [stateResp, sessResp] = await Promise.all([
        fetch(`${url}/api/state`),
        fetch(`${url}/api/sessions`),
      ]);
      const state    = await stateResp.json();
      const sessions = await sessResp.json();
      this._statsData = state.statistics ?? null;
      this._sessionsList  = Array.isArray(sessions) ? sessions : (sessions?.result ?? []);
      this._buildStatsChartCache();
      this._render();
    } catch(e) {
      console.warn("[evcc-card] sessions fetch error", e);
    }
  }

  _buildStatsChartCache() {
    const sessions = this._sessionsList;
    if (!sessions?.length) return;
    const lang = (this._config?.language || this._hass?.language || "de").split("-")[0];
    const now  = new Date();

    const getDate    = s => new Date(s.created ?? s.start ?? 0);
    const toDayKey   = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const toMonthKey = d => `${d.getFullYear()}-${d.getMonth()}`;
    const toYearKey  = d => `${d.getFullYear()}`;

    // Collect unique loadpoints and vehicles
    const loadpoints  = [...new Set(sessions.map(s => s.loadpoint).filter(Boolean))];
    const allVehicles = [...new Set(sessions.map(s => s.vehicle).filter(Boolean))];
    const vehicles    = allVehicles.filter(v => !loadpoints.includes(v));
    // Loadpoints that also appear as a vehicle name (e.g. heat pumps like WP)
    const lpVehicles  = loadpoints.filter(lp => allVehicles.includes(lp));
    this._statsLoadpoints = loadpoints;
    this._statsVehicles   = vehicles;
    this._statsLpVehicles = lpVehicles;

    // All filter keys — include v: key for LP-vehicles so byFilter carries their data
    const filterKeys = [
      "total",
      ...loadpoints.map(lp => `lp:${lp}`),
      ...vehicles.map(v => `v:${v}`),
      ...lpVehicles.map(v => `v:${v}`),
    ];

    const emptyBucket = () => ({ kwhTotal: 0, kwhSolar: 0, priceTotal: null, co2Total: null });

    // Generic aggregation: group sessions by timeKeyFn, with per-filter breakdown
    const aggregate = (timeKeyFn) => {
      const byKey = {};
      sessions.forEach(s => {
        const d  = getDate(s);
        const tk = timeKeyFn(d);
        const kwh  = s.chargedEnergy ?? 0;
        const solar = kwh * (s.solarPercentage ?? 0) / 100;
        const price = s.price ?? null;
        const co2pk = s.co2PerKwh ?? s.co2PerKWh ?? s.sessionCo2PerKWh ?? null;
        const co2   = co2pk !== null ? kwh * co2pk : null;

        const fKeys = ["total"];
        if (s.loadpoint) fKeys.push(`lp:${s.loadpoint}`);
        if (s.vehicle)   fKeys.push(`v:${s.vehicle}`);

        if (!byKey[tk]) {
          byKey[tk] = {};
          filterKeys.forEach(fk => { byKey[tk][fk] = emptyBucket(); });
        }
        fKeys.forEach(fk => {
          if (!byKey[tk][fk]) byKey[tk][fk] = emptyBucket();
          byKey[tk][fk].kwhTotal  += kwh;
          byKey[tk][fk].kwhSolar  += solar;
          if (price !== null) byKey[tk][fk].priceTotal = (byKey[tk][fk].priceTotal ?? 0) + price;
          if (co2   !== null) byKey[tk][fk].co2Total   = (byKey[tk][fk].co2Total   ?? 0) + co2;
        });
      });
      return byKey;
    };

    const makeBucket = (timeData, key, label, labelStr, isCurrent) => {
      const byFilter = {};
      filterKeys.forEach(fk => { byFilter[fk] = timeData[key]?.[fk] ?? emptyBucket(); });
      return { label, labelStr, isCurrent, byFilter };
    };

    // Store aggregations and helpers for on-demand period computation
    const dailyData   = aggregate(toDayKey);
    const monthlyData = aggregate(toMonthKey);
    const dataYears = [...new Set(sessions.map(s => getDate(s).getFullYear()))].sort();
    const yearlyData  = aggregate(toYearKey);
    this._statsAgg = { dailyData, monthlyData, yearlyData, filterKeys, lang, makeBucket,
      toDayKey, toMonthKey, dataYears };

    // "total" – yearly, always at least 3 years (pad with empty bars if needed)
    const fromYear = Math.min(dataYears[0] ?? now.getFullYear(), now.getFullYear() - 2);
    const toYear   = Math.max(dataYears[dataYears.length - 1] ?? now.getFullYear(), now.getFullYear());
    const allYears = [];
    for (let y = fromYear; y <= toYear; y++) allYears.push(y);
    this._statsChartCache["total"] = allYears.map(y => makeBucket(
      yearlyData, String(y), new Date(y, 0, 1), String(y), y === now.getFullYear()));
  }

  _computeChartBuckets(period, offset) {
    if (period === "total") return this._statsChartCache["total"] ?? null;
    const agg = this._statsAgg;
    if (!agg) return null;
    const { dailyData, monthlyData, filterKeys, lang, makeBucket, toDayKey, toMonthKey } = agg;
    const now = new Date();

    if (period === "month") {
      // Target month = now - offset months
      const targetYear  = now.getFullYear() + Math.floor((now.getMonth() - offset) / 12);
      const targetMonth = ((now.getMonth() - offset) % 12 + 12) % 12;
      const targetYearAdj = new Date(now.getFullYear(), now.getMonth() - offset, 1).getFullYear();
      const targetMonthAdj = new Date(now.getFullYear(), now.getMonth() - offset, 1).getMonth();
      const daysInMonth = new Date(targetYearAdj, targetMonthAdj + 1, 0).getDate();
      const isCurrentMonth = offset === 0;
      const lastDay = isCurrentMonth ? now.getDate() : daysInMonth;
      const buckets = [];
      for (let d = 1; d <= lastDay; d++) {
        const day = new Date(targetYearAdj, targetMonthAdj, d);
        buckets.push(makeBucket(dailyData, toDayKey(day), day,
          day.toLocaleDateString(lang, { day: "numeric", month: "numeric" }),
          isCurrentMonth && d === now.getDate()));
      }
      return buckets;
    }

    if (period === "year") {
      const targetYear = now.getFullYear() - offset;
      const isCurrentYear = offset === 0;
      const lastMonth = isCurrentYear ? now.getMonth() : 11;
      const buckets = [];
      for (let m = 0; m <= lastMonth; m++) {
        const day = new Date(targetYear, m, 1);
        buckets.push(makeBucket(monthlyData, toMonthKey(day), day,
          day.toLocaleDateString(lang, { month: "short" }),
          isCurrentYear && m === now.getMonth()));
      }
      return buckets;
    }

    return null;
  }

  _renderStatsBlock() {
    // Trigger async data fetch (no-op if fresh)
    this._fetchStatsData();

    const period = this._statsPeriod ?? this._config.stats_period ?? "month";
    const metric = this._statsMetric ?? "energy";
    const filter = this._statsFilter ?? "total";
    const offset = (period === "total") ? 0 : (this._statsOffset ?? 0);

    if (this._evccUrl === null) {
      return `<div class="loadpoint">
        <div class="lp-header"><span class="lp-name">${_headerIcons.chartBar} ${this._config.title || this._t("statistics")}</span></div>
        <div class="stats-no-data">${this._t("statsNoUrl")}</div>
      </div>`;
    }

    // KPI computation
    // Use apiStats only for current period (offset=0) total filter
    const periodApiMap = { "month": "30d", "year": "thisYear", "total": "total" };
    const apiPeriod = periodApiMap[period];
    const apiStats = (offset === 0 && filter === "total" && apiPeriod) ? (this._statsData?.[apiPeriod] ?? null) : null;

    // Compute chart buckets for this period+offset
    const chartBuckets = this._computeChartBuckets(period, offset);
    // For stacked views (loadpoints/vehicles), KPIs show the grand total
    const kpiFilterKey = (filter === "loadpoints" || filter === "vehicles") ? "total" : filter;
    const filterBuckets = chartBuckets?.map(b => b.byFilter?.[kpiFilterKey] ?? { kwhTotal: 0, kwhSolar: 0, priceTotal: null, co2Total: null });

    const sumBuckets = (buckets) => {
      if (!buckets?.length) return null;
      let kwhTotal = 0, kwhSolar = 0, priceTotal = null, co2Total = null;
      buckets.forEach(b => {
        kwhTotal += b.kwhTotal ?? 0;
        kwhSolar += b.kwhSolar ?? 0;
        if (b.priceTotal !== null) priceTotal = (priceTotal ?? 0) + b.priceTotal;
        if (b.co2Total   !== null) co2Total   = (co2Total   ?? 0) + b.co2Total;
      });
      return { kwhTotal, kwhSolar, priceTotal, co2Total };
    };
    const bucketSum = sumBuckets(filterBuckets);

    let kwh, solar, avgPrice, avgCo2, totalCostEur, totalCo2g;
    if (apiStats) {
      kwh         = apiStats.chargedKWh      ?? null;
      solar       = apiStats.solarPercentage ?? null;
      avgPrice    = apiStats.avgPrice != null ? apiStats.avgPrice * 100 : null;  // €/kWh → ct/kWh
      avgCo2      = apiStats.avgCo2          ?? null;  // g/kWh
      totalCostEur = (kwh !== null && avgPrice !== null) ? kwh * avgPrice / 100 : null;
      totalCo2g    = (kwh !== null && avgCo2   !== null) ? kwh * avgCo2         : null;
    } else if (bucketSum) {
      kwh          = bucketSum.kwhTotal  || null;
      solar        = kwh ? (bucketSum.kwhSolar / kwh) * 100 : null;
      totalCostEur = bucketSum.priceTotal;
      avgPrice     = (totalCostEur !== null && kwh) ? (totalCostEur / kwh) * 100 : null;  // ct/kWh
      totalCo2g    = bucketSum.co2Total;
      avgCo2       = (totalCo2g !== null && kwh) ? totalCo2g / kwh : null;  // g/kWh
    }

    const kpi = (v, label, fmt, color) => `
      <div class="stats-kpi">
        <div class="stats-kpi-val"${color ? ` style="color:${color}"` : ""}>${v !== null && v !== undefined ? fmt(v) : "–"}</div>
        <div class="stats-kpi-lbl">${label}</div>
      </div>`;

    let kpis = "";
    if (metric === "energy") {
      kpis = [
        kpi(kwh,      this._t("statsTotalCharged"), v => `${Math.round(v)} kWh`, null),
        kpi(solar,    this._t("statsSolarShare"),   v => `${Math.round(v)} %`,   solar > 0 ? "var(--evcc-green)" : null),
        kpi(avgPrice, this._t("statsAvgPrice"),     v => `${v.toFixed(1)} ct`,   null),
      ].join("");
    } else if (metric === "price") {
      kpis = [
        kpi(totalCostEur, this._t("statsTotalCost"),   v => `${v.toFixed(2)} €`,   null),
        kpi(avgPrice,     this._t("statsAvgPrice"),    v => `${v.toFixed(1)} ct`,  null),
        kpi(kwh,          this._t("statsTotalCharged"), v => `${Math.round(v)} kWh`, null),
      ].join("");
    } else if (metric === "co2") {
      const co2kg = totalCo2g !== null ? totalCo2g / 1000 : null;
      kpis = [
        kpi(co2kg,  this._t("statsTotalCo2"),      v => `${v.toFixed(1)} kg`,     null),
        kpi(avgCo2, this._t("statsAvgCo2"),         v => `${Math.round(v)} g/kWh`, null),
        kpi(kwh,    this._t("statsTotalCharged"),  v => `${Math.round(v)} kWh`,   null),
      ].join("");
    }

    // Period buttons (top-left)
    const periodDefs = [
      { key: "month", tKey: "statsPeriodMonth" },
      { key: "year",  tKey: "statsPeriodYear"  },
      { key: "total", tKey: "statsPeriodTotal" },
    ];
    const periodBtns = periodDefs.map(d =>
      `<button class="stats-ctrl-btn${d.key === period ? " active" : ""}" data-period="${d.key}">${this._t(d.tKey)}</button>`
    ).join("");

    // Time navigation (top-right, month/year only)
    let timeNavHtml = "";
    if (period !== "total") {
      const lang = (this._config?.language || this._hass?.language || "de").split("-")[0];
      const now  = new Date();
      const periodLabel = period === "month"
        ? new Date(now.getFullYear(), now.getMonth() - offset, 1).toLocaleDateString(lang, { month: "long", year: "numeric" })
        : String(now.getFullYear() - offset);
      const minYear   = this._statsAgg?.dataYears?.[0] ?? (now.getFullYear() - 5);
      const maxOffset = period === "month"
        ? (now.getFullYear() - minYear) * 12 + now.getMonth()
        : now.getFullYear() - minYear;
      const svgL = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>`;
      const svgR = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`;
      timeNavHtml = `<div class="stats-time-nav">
        <button class="stn-btn" data-nav="prev" ${offset >= maxOffset ? "disabled" : ""}>${svgL}</button>
        <span class="stn-label">${periodLabel}</span>
        <button class="stn-btn" data-nav="next" ${offset === 0 ? "disabled" : ""}>${svgR}</button>
      </div>`;
    }

    // Metric buttons (bottom-left)
    const metricDefs = [
      { key: "energy", tKey: "statsMetricEnergy" },
      { key: "price",  tKey: "statsMetricPrice"  },
      { key: "co2",    tKey: "statsMetricCo2"    },
    ];
    const metricBtns = metricDefs.map(d =>
      `<button class="stats-ctrl-btn${d.key === metric ? " active" : ""}" data-metric="${d.key}">${this._t(d.tKey)}</button>`
    ).join("");

    // Filter buttons: Gesamt / Ladepunkte / Fahrzeuge (no individual device names)
    const hasLp = this._statsLoadpoints.length > 0;
    const hasV  = this._statsVehicles.length > 0 || this._statsLpVehicles.length > 0;
    const filterBtn = (key, label) =>
      `<button class="stats-ctrl-btn${key === filter ? " active" : ""}" data-filter="${key}">${label}</button>`;
    let filterBtns = filterBtn("total", this._t("statsFilterTotal"));
    if (hasLp) filterBtns += filterBtn("loadpoints", this._t("statsFilterLoadpoints"));
    if (hasV)  filterBtns += filterBtn("vehicles",   this._t("statsFilterVehicles"));
    const filterBtnsHtml = (hasLp || hasV) ? `<div class="stats-filter-group">${filterBtns}</div>` : "";

    // Stacking: driven by filter="loadpoints" or "vehicles"
    const STACK_COLORS = ["var(--primary-color,#3b82f6)", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"];
    const stackGroups = filter === "loadpoints" ? this._statsLoadpoints
                      : filter === "vehicles"   ? [...this._statsVehicles, ...this._statsLpVehicles]
                      : [];
    // Show segments+legend whenever a group filter is active (even for 1 group)
    const isStacked = stackGroups.length > 0;

    // Chart – transform buckets to {delta, solarDelta, totalVal, segments} by metric
    const yUnit = metric === "energy" ? "kWh" : metric === "price" ? "€" : "kg";
    const getFd  = (b, fk) => b.byFilter?.[fk] ?? { kwhTotal: 0, kwhSolar: 0, priceTotal: null, co2Total: null };
    const metricVal = (fd) => {
      if (metric === "energy") return fd.kwhTotal > 0 ? fd.kwhTotal : null;
      if (metric === "price")  return fd.priceTotal != null ? fd.priceTotal : null;
      return fd.co2Total != null ? fd.co2Total / 1000 : null;
    };
    const calcTotalVal = (fd) => {
      if (metric === "price") return (fd.priceTotal != null && fd.kwhTotal > 0) ? (fd.priceTotal / fd.kwhTotal) * 100 : null;
      if (metric === "co2")   return (fd.co2Total   != null && fd.kwhTotal > 0) ? fd.co2Total / fd.kwhTotal : null;
      return null;
    };
    const chartData = chartBuckets?.map(b => {
      const lpPrefix = filter === "loadpoints" ? "lp:" : filter === "vehicles" ? "v:" : null;
      // For totalVal: use single group fd if only 1 group, else total
      const tvFd = (isStacked && stackGroups.length === 1 && lpPrefix)
        ? getFd(b, `${lpPrefix}${stackGroups[0]}`) : getFd(b, "total");
      const fd   = getFd(b, "total");
      let delta, solarDelta, totalVal;
      if (metric === "energy") {
        delta      = fd.kwhTotal > 0 ? fd.kwhTotal : null;
        solarDelta = !isStacked && fd.kwhSolar > 0 ? fd.kwhSolar : null;
        totalVal   = null;
      } else if (metric === "price") {
        delta    = fd.priceTotal;
        totalVal = calcTotalVal(tvFd);
        solarDelta = null;
      } else {
        delta    = fd.co2Total != null ? fd.co2Total / 1000 : null;
        totalVal = calcTotalVal(tvFd);
        solarDelta = null;
      }
      let segments = null;
      if (isStacked && lpPrefix) {
        segments = stackGroups.map((g, gi) => ({
          label: g,
          value: metricVal(getFd(b, `${lpPrefix}${g}`)),
          color: STACK_COLORS[gi % STACK_COLORS.length],
        }));
        const segTotal = segments.reduce((s, seg) => s + (seg.value ?? 0), 0);
        if (segTotal > 0) delta = segTotal;
        solarDelta = null;
      }
      return { ...b, delta, solarDelta, totalVal, segments };
    });

    const chart = `<div class="stats-chart-section">
      ${chartData ? this._renderBarChart(chartData, yUnit, metric !== "energy") : '<div class="stats-chart-loading">…</div>'}
    </div>`;

    // Build EVCC sessions link
    const _now = new Date();
    const _baseUrl = (this._evccUrl || "").replace(/\/$/, "");
    let _sessionsUrl = "";
    if (_baseUrl) {
      if (period === "month") {
        const _td = new Date(_now.getFullYear(), _now.getMonth() - offset, 1);
        _sessionsUrl = `${_baseUrl}/#/sessions?period&month=${_td.getMonth() + 1}&year=${_td.getFullYear()}`;
      } else if (period === "year") {
        _sessionsUrl = `${_baseUrl}/#/sessions?period&year=${_now.getFullYear() - offset}`;
      } else {
        _sessionsUrl = `${_baseUrl}/#/sessions`;
      }
    }
    const sessionsLinkHtml = _sessionsUrl
      ? `<a href="${_sessionsUrl}" target="_blank" rel="noopener" class="stats-sessions-link" title="EVCC Statistik"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg></a>`
      : "";

    return `<div>
      <div class="lp-header"><span class="lp-name">${_headerIcons.chartBar} ${this._config.title || this._t("statistics")}</span>${sessionsLinkHtml}</div>
      <div class="stats-header-row">
        <div class="stats-ctrl">${periodBtns}</div>
        ${timeNavHtml}
      </div>
      <div class="stats-header-row">
        <div class="stats-ctrl">${metricBtns}</div>
        ${filterBtnsHtml}
      </div>
      <div class="stats-kpi-row">${kpis}</div>
      ${chart}
    </div>`;
  }


  _renderBatteryBlock(site) {
    const socId         = site.battery_soc;
    const powerId       = site.battery_power;
    const capId         = site.battery_capacity;
    const dischargeId   = site.battery_discharge_control;
    const prioritySocId = site.priority_soc;
    const bufferSocId   = site.buffer_soc;

    if (!socId) return "";

    const soc         = parseFloat(stateVal(this._hass, socId)) || 0;
    const power       = powerId ? parseFloat(stateVal(this._hass, powerId)) || 0 : null;
    const cap         = capId   ? parseFloat(stateVal(this._hass, capId))   || 0 : null;
    const dischargeOn = dischargeId ? isOn(this._hass, dischargeId) : null;
    const socColor    = soc > 80 ? "var(--evcc-green)" : soc > 30 ? "var(--evcc-blue)" : "var(--evcc-amber)";

    const getVal  = id => id ? (parseFloat(stateVal(this._hass, id)) || 0) : null;
    const getOpts = id => id ? (attr(this._hass, id, "options") ?? [])
      .map(o => parseFloat(o)).filter(o => !isNaN(o)).sort((a, b) => a - b) : [];

    const priorityVal = getVal(prioritySocId);
    const bufferVal   = getVal(bufferSocId);

    const inlineSlider = (entityId, val) => {
      if (!entityId || val === null) return "";
      const opts = getOpts(entityId);
      const min  = opts[0] ?? 0;
      const max  = opts[opts.length - 1] ?? 100;
      const step = opts.length > 1 ? opts[1] - opts[0] : 5;
      return `<span class="batt-inline-val"
                    data-batt-inline="${entityId}"
                    data-min="${min}" data-max="${max}" data-step="${step}"
                    data-val="${val}">${val} %</span>`;
    };

    const splitPct    = priorityVal ?? 0;
    const carZonePct  = 100 - splitPct;
    const hausZonePct = splitPct;
    const socFillH    = Math.min(soc, 100);

    const visual = `
      <div class="batt-visual">
        <div class="batt-cap-tip"></div>
        <div class="batt-body">
          ${splitPct > 0 && splitPct < 100 ? `
            <div class="batt-zone batt-zone-car" style="flex:${carZonePct}">
              <span class="batt-zone-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,0.5)"><path d="M16,6L19,10H5L8,6H16M16,4H8L3,10V16H5V18H8V16H16V18H19V16H21V10L16,4M7,12A1,1 0 0,1 8,11A1,1 0 0,1 9,12A1,1 0 0,1 8,13A1,1 0 0,1 7,12M15,12A1,1 0 0,1 16,11A1,1 0 0,1 17,12A1,1 0 0,1 16,13A1,1 0 0,1 15,12Z"/></svg></span>
            </div>
            <div class="batt-divider-line"></div>
            <div class="batt-zone batt-zone-haus" style="flex:${hausZonePct}">
              <span class="batt-zone-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,0.5)"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg></span>
            </div>` : `
            <div class="batt-zone batt-zone-car" style="flex:1">
              <span class="batt-zone-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="rgba(255,255,255,0.5)"><path d="M16,6L19,10H5L8,6H16M16,4H8L3,10V16H5V18H8V16H16V18H19V16H21V10L16,4M7,12A1,1 0 0,1 8,11A1,1 0 0,1 9,12A1,1 0 0,1 8,13A1,1 0 0,1 7,12M15,12A1,1 0 0,1 16,11A1,1 0 0,1 17,12A1,1 0 0,1 16,13A1,1 0 0,1 15,12Z"/></svg></span>
            </div>`}
          <div class="batt-soc-overlay" style="height:${socFillH}%;background:${socColor}"></div>
        </div>
      </div>`;

    const powerStr = power !== null
      ? (Math.abs(power) < 50 ? this._t("battReady")
        : `${(Math.abs(power)/1000).toFixed(2)} kW ${power > 0 ? "↑" : "↓"}`)
      : "";
    const info = `
      <div class="batt-info-col">
        <div class="batt-info-label">${this._t("battLevel")}</div>
        <div class="batt-info-pct" style="color:${socColor}">${Math.round(soc)} %</div>
        ${cap ? `<div class="batt-info-kwh">${(soc/100*cap).toFixed(1)} kWh / ${cap} kWh</div>` : ""}
        ${powerStr ? `<div class="batt-info-power">${powerStr}</div>` : ""}
      </div>`;

    const dischargeHtml = dischargeOn !== null ? `
      <div class="batt-discharge-row">
        <button class="batt-discharge-toggle ${dischargeOn ? "on" : ""}"
                data-entity="${dischargeId}" data-domain="switch" data-on="${dischargeOn}">
          <span class="batt-toggle-knob"></span>
        </button>
        <span>${this._t("battDischargeLabel")}</span>
      </div>` : "";

    const tabUsage = `
      <div class="batt-usage-content">
        <div class="batt-main-row">
          <div class="batt-text-col">
            ${bufferSocId ? `
            <div class="batt-text-item">
              <span class="batt-text-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style="fill:var(--evcc-bolt)"><path d="M11 15H6L13 1V9H18L11 23V15Z"/></svg></span>
              <div>
                <div class="batt-text-title">${this._t("battBoostTitle")}</div>
                <div class="batt-text-desc">${this._t("battBoostDesc", { val: inlineSlider(bufferSocId, bufferVal) })}</div>
              </div>
            </div>` : ""}
            ${prioritySocId ? `
            <div class="batt-text-item">
              <span class="batt-text-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style="fill:var(--evcc-blue)"><path d="M16,6L19,10H5L8,6H16M16,4H8L3,10V16H5V18H8V16H16V18H19V16H21V10L16,4M7,12A1,1 0 0,1 8,11A1,1 0 0,1 9,12A1,1 0 0,1 8,13A1,1 0 0,1 7,12M15,12A1,1 0 0,1 16,11A1,1 0 0,1 17,12A1,1 0 0,1 16,13A1,1 0 0,1 15,12Z"/></svg></span>
              <div>
                <div class="batt-text-title">${this._t("battCarPrioTitle")}</div>
                <div class="batt-text-desc">${this._t("battCarPrioDesc", { val: inlineSlider(prioritySocId, priorityVal) })}</div>
              </div>
            </div>
            <div class="batt-text-item">
              <span class="batt-text-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="var(--secondary-text-color)"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/></svg></span>
              <div>
                <div class="batt-text-title">${this._t("battHomePrioTitle")}</div>
                <div class="batt-text-desc">${this._t("battHomePrioDesc", { val: inlineSlider(prioritySocId, priorityVal) })}</div>
              </div>
            </div>` : ""}
          </div>
          <div class="batt-visual-col">
            ${bufferVal !== null ? `<span class="batt-marker-top">${bufferVal} %</span>` : ""}
            ${visual}
            ${info}
          </div>
        </div>
        ${dischargeHtml}
        <div class="batt-inline-popup" hidden>
          <input type="range" class="batt-inline-input" />
          <span class="batt-inline-label"></span>
        </div>
      </div>`;

    return `
      <div class="battery-block">
        <div class="lp-header">
          <span class="lp-name">${_headerIcons.battery} ${this._config.title || this._t("homeBattery")}</span>
        </div>
        ${tabUsage}
      </div>`;
  }

  _renderEmpty(allLoadpoints = {}) {
    const available = Object.keys(allLoadpoints);
    const hint = available.length > 0
      ? `<p>${this._t("availableLoadpoints", { list: `<code>${available.join(", ")}</code>` })}</p>`
      : "";
    return `
      <div class="empty">
        <p>${this._t("noLoadpoints")}</p>
        ${hint}
      </div>
    `;
  }

  _attachListeners() {
    this.shadowRoot.querySelectorAll("[data-more-info]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: el.dataset.moreInfo }, bubbles: true, composed: true,
        }));
      });
    });

    this.shadowRoot.querySelectorAll("[data-lp-current-toggle]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const lpName   = btn.dataset.lpCurrentToggle;
        const expanded = this._currentBlockExpanded[lpName] === true;
        this._currentBlockExpanded[lpName] = !expanded;

        const block = this.shadowRoot.querySelector(`[data-lp-current="${lpName}"]`);
        if (!block) return;
        const body = block.querySelector(".current-block-body");
        if (body) {
          if (!expanded) body.removeAttribute("hidden");
          else body.setAttribute("hidden", "");
        }
        btn.classList.toggle("active", !expanded);
      });
    });

    this.shadowRoot.querySelectorAll("[data-lp-smart-cost-open]").forEach(chip => {
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const lpName = chip.dataset.lpSmartCostOpen;
        const block  = this.shadowRoot.querySelector(`[data-lp-current="${lpName}"]`);
        if (!block) return;
        const body = block.querySelector(".current-block-body");
        if (body) body.removeAttribute("hidden");
        this._currentBlockExpanded[lpName] = true;
        const toggleBtn = block.querySelector("[data-lp-current-toggle]");
        if (toggleBtn) toggleBtn.classList.add("active");
        const section = block.querySelector(`[data-lp-smart-cost-section="${lpName}"]`);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "nearest" });
          section.classList.add("smart-cost-highlight");
          setTimeout(() => section.classList.remove("smart-cost-highlight"), 1500);
        }
      });
    });

    this.shadowRoot.querySelectorAll("button.compact-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        const lpName   = btn.dataset.lp;
        const tabIdx   = parseInt(btn.dataset.tab);
        this._tabState[lpName] = tabIdx;

        const block = btn.closest("[data-lp-compact]");
        block.querySelectorAll("button.compact-tab").forEach((b, i) =>
          b.classList.toggle("active", i === tabIdx));
        block.querySelectorAll(".compact-panel").forEach((p, i) =>
          i === tabIdx ? p.removeAttribute("hidden") : p.setAttribute("hidden", ""));
      });
    });

    this.shadowRoot.querySelectorAll("button.stats-ctrl-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.dataset.period) { this._statsPeriod = btn.dataset.period; this._statsOffset = 0; }
        if (btn.dataset.metric) { this._statsMetric = btn.dataset.metric; }
        if (btn.dataset.filter) { this._statsFilter = btn.dataset.filter; }
        this._render();
      });
    });

    this.shadowRoot.querySelectorAll("button.stn-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const dir = btn.dataset.nav;
        if (dir === "prev") this._statsOffset = (this._statsOffset ?? 0) + 1;
        else if (dir === "next") this._statsOffset = Math.max(0, (this._statsOffset ?? 0) - 1);
        this._render();
      });
    });

    const chartWrap = this.shadowRoot.querySelector(".evcc-chart-wrap");
    if (chartWrap) {
      const tooltip = chartWrap.querySelector(".evcc-chart-tooltip");
      const unit = chartWrap.dataset.yunit || "kWh";
      const showTooltip = (bar) => {
        const total    = bar.dataset.total;
        if (!total) { tooltip.hidden = true; return; }
        const totalNum = parseFloat(total);
        const solar    = bar.dataset.solar    ? parseFloat(bar.dataset.solar)    : null;
        const grid     = solar != null        ? (totalNum - solar).toFixed(2)    : null;
        const totalval = bar.dataset.totalval ? parseFloat(bar.dataset.totalval) : null;
        const dot = (color) => `<span class="ectt-dot" style="background:${color}"></span>`;
        const solarColor = getComputedStyle(chartWrap).getPropertyValue("--evcc-green").trim()          || "#22c55e";
        const gridColor  = getComputedStyle(chartWrap).getPropertyValue("--primary-color").trim()       || "#3b82f6";
        const avgColor   = getComputedStyle(chartWrap).getPropertyValue("--secondary-text-color").trim() || "#888";

        let html = `<div class="ectt-header">${bar.dataset.label}</div>`;
        if (bar.dataset.segs) {
          // Stacked: per-segment breakdown + unit-specific detail
          const segs = bar.dataset.segs.split("~").map(s => { const [l, v, c] = s.split("|"); return { label: l, value: v, color: c }; });
          html += segs.filter(s => s.value).map(s =>
            `<div class="ectt-row">${dot(s.color)}<span class="ectt-name">${s.label}</span><span class="ectt-val">${parseFloat(s.value).toFixed(2)} ${unit}</span></div>`
          ).join("") + `<div class="ectt-summary">${totalNum.toFixed(2)} ${unit} ${this._t("total")}</div>`;
          if (unit === "€" && totalval != null)
            html += `<div class="ectt-row ectt-avg-row">${dot(avgColor)}<span class="ectt-name">Ø</span><span class="ectt-val">${totalval.toFixed(1)} ct/kWh</span></div>`;
          if (unit === "kg" && totalval != null)
            html += `<div class="ectt-row ectt-avg-row">${dot(avgColor)}<span class="ectt-name">Ø</span><span class="ectt-val">${Math.round(totalval)} g/kWh</span></div>`;
        } else if (unit === "€") {
          // Price: total € + ct/kWh rate
          const intensity = totalval != null ? `${totalval.toFixed(1)} ct/kWh` : "–";
          html +=
            `<div class="ectt-summary">${totalNum.toFixed(2)} € ${this._t("total")}</div>` +
            `<div class="ectt-row ectt-avg-row">${dot(avgColor)}<span class="ectt-name">Ø</span><span class="ectt-val">${intensity}</span></div>`;
        } else if (unit === "kg") {
          // CO2: total kg + g/kWh intensity
          const intensity = totalval != null ? `${Math.round(totalval)} g/kWh` : "–";
          html +=
            `<div class="ectt-summary">${totalNum.toFixed(2)} kg CO₂ ${this._t("total")}</div>` +
            `<div class="ectt-row ectt-avg-row">${dot(avgColor)}<span class="ectt-name">Ø</span><span class="ectt-val">${intensity}</span></div>`;
        } else {
          // Energy: solar / grid / total
          html +=
            (solar != null ? `<div class="ectt-row">${dot(solarColor)}<span class="ectt-name">${this._t("solar")}</span><span class="ectt-val">${bar.dataset.solar} ${unit}</span></div>` : "") +
            (grid  != null ? `<div class="ectt-row">${dot(gridColor)}<span class="ectt-name">${this._t("grid")}</span><span class="ectt-val">${grid} ${unit}</span></div>` : "") +
            `<div class="ectt-summary">${total} ${unit} ${this._t("total")}</div>`;
        }
        tooltip.innerHTML = html;
        const barRect  = bar.getBoundingClientRect();
        const wrapRect = chartWrap.getBoundingClientRect();
        const rawLeft  = barRect.left - wrapRect.left + barRect.width / 2;
        tooltip.hidden = false;
        const ttW  = tooltip.getBoundingClientRect().width;
        const left = Math.min(wrapRect.width - ttW / 2 - 4, Math.max(ttW / 2 + 4, rawLeft));
        tooltip.style.left = `${left}px`;
        tooltip.dataset.activeBar = bar.dataset.label + bar.dataset.total;
      };
      chartWrap.addEventListener("mouseover", (e) => {
        const bar = e.target.closest(".evcc-bar");
        if (bar) showTooltip(bar);
      });
      chartWrap.addEventListener("mouseout", (e) => {
        if (e.target.closest(".evcc-bar")) tooltip.hidden = true;
      });
      chartWrap.addEventListener("click", (e) => {
        const bar = e.target.closest(".evcc-bar");
        if (bar) {
          const key = bar.dataset.label + bar.dataset.total;
          if (!tooltip.hidden && tooltip.dataset.activeBar === key) {
            tooltip.hidden = true;
          } else {
            showTooltip(bar);
          }
        } else {
          tooltip.hidden = true;
        }
      });
    }

    this.shadowRoot.querySelectorAll("button.batt-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        block.querySelectorAll("button.batt-tab").forEach((b, i) =>
          b.classList.toggle("active", i === tabIdx));
        block.querySelectorAll(".batt-tab-content").forEach((c, i) =>
          i === tabIdx ? c.removeAttribute("hidden") : c.setAttribute("hidden", ""));
      });
    });

    this.shadowRoot.querySelectorAll("button.batt-discharge-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const on     = btn.dataset.on === "true";
        const domain = btn.dataset.domain;
        this._hass.callService(domain, on ? "turn_off" : "turn_on", { entity_id: btn.dataset.entity });
        btn.classList.toggle("on", !on);
        btn.dataset.on = String(!on);
      });
    });

    this.shadowRoot.querySelectorAll(".batt-inline-val").forEach(span => {
      span.addEventListener("click", () => {
        const container = span.closest(".batt-usage-content");
        if (!container) return;
        const popup    = container.querySelector(".batt-inline-popup");
        if (!popup) return;
        const input    = popup.querySelector(".batt-inline-input");
        const label    = popup.querySelector(".batt-inline-label");
        const entityId = span.dataset.battInline;
        input.min   = span.dataset.min;
        input.max   = span.dataset.max;
        input.step  = span.dataset.step;
        input.value = span.dataset.val;
        label.textContent = `${span.dataset.val} %`;
        input.dataset.entity = entityId;
        popup.removeAttribute("hidden");
      });
      span.addEventListener("click", e => e.stopPropagation());
    });

    this.shadowRoot.querySelectorAll(".batt-inline-input").forEach(input => {
      input.addEventListener("pointerdown", () => { this._isDragging = true; });
      input.addEventListener("input", () => {
        const popup = input.closest(".batt-inline-popup");
        const label = popup?.querySelector(".batt-inline-label");
        label.textContent = `${input.value} %`;
        this.shadowRoot.querySelectorAll(`.batt-inline-val[data-batt-inline="${input.dataset.entity}"]`)
          .forEach(s => { s.textContent = `${input.value} %`; s.dataset.val = input.value; });
      });
      input.addEventListener("pointerup", () => {
        this._isDragging = false;
        const opts = (attr(this._hass, input.dataset.entity, "options") ?? [])
          .map(o => parseFloat(o)).filter(o => !isNaN(o));
        const val     = parseFloat(input.value);
        const nearest = opts.length
          ? opts.reduce((p, c) => Math.abs(c - val) < Math.abs(p - val) ? c : p, opts[0])
          : val;
        this._hass.callService("select", "select_option", {
          entity_id: input.dataset.entity,
          option:    String(nearest),
        });
      });
    });

    const cardContent = this.shadowRoot.querySelector(".card-content");
    if (cardContent) {
      cardContent.addEventListener("click", (e) => {
        this.shadowRoot.querySelectorAll(".batt-inline-popup").forEach(p => p.setAttribute("hidden", ""));
      });
    } else {
      this.shadowRoot.addEventListener("click", () => {
        this.shadowRoot.querySelectorAll(".batt-inline-popup").forEach(p => p.setAttribute("hidden", ""));
      }, { capture: true });
    }

    this.shadowRoot.querySelectorAll("button.mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this._hass.callService("select", "select_option", {
          entity_id: btn.dataset.entity,
          option:    btn.dataset.value,
        });
      });
    });

    this.shadowRoot.querySelectorAll("button.toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const on     = btn.dataset.on === "true";
        const domain = btn.dataset.domain;
        this._hass.callService(domain, on ? "turn_off" : "turn_on", {
          entity_id: btn.dataset.entity,
        });
      });
    });

    this.shadowRoot.querySelectorAll("button.phase-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this._hass.callService("select", "select_option", {
          entity_id: btn.dataset.entity,
          option:    btn.dataset.value,
        });
        const group = btn.closest(".phase-btn-group");
        if (group) {
          group.querySelectorAll(".phase-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        }
      });
    });

    this.shadowRoot.querySelectorAll("input[data-boost-entity]").forEach(input => {
      input.addEventListener("pointerdown", () => { this._isDragging = true; this._pendingRender = false; });
      input.addEventListener("input", () => {
        const val     = parseInt(input.value, 10);
        const display = input.nextElementSibling;
        if (!display) return;
        if (input.dataset.boostType === "switch") {
          display.textContent = val >= 50 ? "On" : "Off";
        } else {
          display.textContent = val === 100 ? "Off" : val === 0 ? "0 % (full discharge)" : `${val} %`;
        }
      });
      input.addEventListener("pointerup",  () => this._boostCommit(input));
      input.addEventListener("blur",       () => this._boostCommit(input));
    });

    this.shadowRoot.querySelectorAll("input.plan-soc-range").forEach(input => {
      input.addEventListener("pointerdown", () => {
        this._isDragging    = true;
        this._pendingRender = false;
      });
      input.addEventListener("input", () => {
        const lpName = input.dataset.lp;
        const val    = parseInt(input.value, 10);
        if (this._planState[lpName]) this._planState[lpName].soc = val;
        const span = input.nextElementSibling;
        if (span) span.textContent = `${val} %`;
      });
      input.addEventListener("pointerup", () => {
        this._isDragging = false;
        if (this._pendingRender) { this._pendingRender = false; this._render(); }
      });
      input.addEventListener("blur", () => {
        if (this._isDragging) {
          this._isDragging = false;
          if (this._pendingRender) { this._pendingRender = false; this._render(); }
        }
      });
    });

    this.shadowRoot.querySelectorAll("input.plan-energy-range").forEach(input => {
      input.addEventListener("pointerdown", () => {
        this._isDragging    = true;
        this._pendingRender = false;
      });
      input.addEventListener("input", () => {
        const lpName = input.dataset.lp;
        const val    = parseFloat(input.value);
        if (this._planState[lpName]) this._planState[lpName].energy = val;
        const span = input.nextElementSibling;
        if (span) span.textContent = `${val} kWh`;
      });
      input.addEventListener("pointerup", () => {
        this._isDragging = false;
        if (this._pendingRender) { this._pendingRender = false; this._render(); }
      });
      input.addEventListener("blur", () => {
        if (this._isDragging) {
          this._isDragging = false;
          if (this._pendingRender) { this._pendingRender = false; this._render(); }
        }
      });
    });

    this.shadowRoot.querySelectorAll("input.plan-time-input").forEach(input => {
      input.addEventListener("change", () => {
        const lpName = input.dataset.lp;
        if (this._planState[lpName]) this._planState[lpName].time = input.value;
      });
    });

    this.shadowRoot.querySelectorAll("select.plan-vehicle-select").forEach(sel => {
      sel.addEventListener("focus", () => {
        this._pendingRender = false;
      });
      sel.addEventListener("blur", () => {
        this._isDragging = false;
        if (this._pendingRender) { this._pendingRender = false; this._render(); }
      });
      sel.addEventListener("change", () => {
        const lpName = sel.dataset.lp;
        const eid    = sel.dataset.entity;
        const val    = sel.value;
        if (this._planState[lpName]) {
          this._planState[lpName].vehicle = val;
          this._planState[lpName].soc     = null;
          this._planState[lpName].energy  = null;
          this._planState[lpName].time    = null;
        }
        if (eid && this._hass) {
          this._hass.callService("select", "select_option", { entity_id: eid, option: val });
        }
      });
    });

    this.shadowRoot.querySelectorAll("button.plan-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const on     = btn.dataset.on === "true";
        const domain = btn.dataset.domain;
        this._hass.callService(domain, on ? "turn_off" : "turn_on", { entity_id: btn.dataset.entity });
        btn.classList.toggle("on", !on);
        btn.dataset.on = String(!on);
        btn.textContent = !on ? this._t("planContinuousOn") : this._t("planContinuousOff");
      });
    });

    this.shadowRoot.querySelectorAll("select.plan-precondition-select").forEach(sel => {
      sel.addEventListener("change", () => {
        if (this._hass) {
          this._hass.callService("select", "select_option", { entity_id: sel.dataset.entity, option: sel.value });
        }
      });
    });

    this.shadowRoot.querySelectorAll("button.plan-btn.save").forEach(btn => {
      btn.addEventListener("click", () => {
        const lpName  = btn.dataset.lp;
        const state   = this._planState[lpName] || {};
        const soc     = state.soc || 80;
        const dtValue = state.time || "";

        if (!dtValue) { alert(this._t("noTimeAlert")); return; }

        // DOM-Referenzen VOR dem await einsammeln (btn noch attached)
        const vehicleTitle = (state.vehicle && state.vehicle !== "null" && state.vehicle !== "—") ? state.vehicle : null;
        const vehicleSelectEl = btn.closest(".plan-block")?.querySelector("select.plan-vehicle-select");
        const vehicleEntityId = vehicleSelectEl?.dataset?.entity;
        const vehicleIdsAttr = vehicleEntityId ? (this._hass.states[vehicleEntityId]?.attributes?.vehicle_ids ?? {}) : {};
        const vehicleDbId = vehicleTitle ? (vehicleIdsAttr[vehicleTitle] ?? null) : null;
        const time = new Date(dtValue).toISOString();
        const lpTitleVal = btn.dataset.lpTitle || lpName;
        const energy = state.energy ?? 10;

        // Feedback via _planState persistieren — überlebt Re-Renders durch WS-Push
        const setStatus = (status, msg = null) => {
          this._planState[lpName] = { ...(this._planState[lpName] || {}), _status: status, _statusMsg: msg };
          this._render();
        };

        const tryServices = async () => {
          let lastErr = null;
          if (vehicleDbId) {
            try {
              await this._hass.callService("evcc", "set_vehicle_plan", { vehicle: vehicleDbId, soc, time });
              window.dispatchEvent(new CustomEvent("evcc-plan-reset", { detail: { lpName } }));
              setStatus("success");
              return;
            } catch(e) { lastErr = e; }
          }
          try {
            await this._hass.callService("evcc", "set_loadpoint_plan", { loadpoint: lpTitleVal, energy, time });
            window.dispatchEvent(new CustomEvent("evcc-plan-reset", { detail: { lpName } }));
            setStatus("success");
            return;
          } catch(e) { lastErr = e; }
          setStatus("error", lastErr?.message || JSON.stringify(lastErr) || "Unknown error");
        };
        tryServices();
      });
    });

    this.shadowRoot.querySelectorAll("button.plan-btn.delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const lpName      = btn.dataset.lp;
        const planSt      = this._planState[lpName] || {};
        const vehicleTitle = (planSt.vehicle && planSt.vehicle !== "null" && planSt.vehicle !== "—") ? planSt.vehicle : null;
        const delVehicleSelectEl = btn.closest(".plan-block")?.querySelector("select.plan-vehicle-select");
        const delVehicleEntityId = delVehicleSelectEl?.dataset?.entity;
        const delVehicleIds = delVehicleEntityId ? (this._hass.states[delVehicleEntityId]?.attributes?.vehicle_ids ?? {}) : {};
        const vehicleDbId = vehicleTitle ? (delVehicleIds[vehicleTitle] ?? null) : null;
        const block       = btn.closest(".plan-block");
        const delLpTitle  = btn.dataset.lpTitle || lpName;
        const resetBadge  = () => {
          const badge = block?.querySelector(".plan-badge");
          if (badge) { badge.textContent = this._t("noPlan"); badge.classList.remove("active", "planned"); }
        };
        if (vehicleDbId) {
          this._hass.callService("evcc", "delete_vehicle_plan", { vehicle: vehicleDbId })
            .then(() => { resetBadge(); window.dispatchEvent(new CustomEvent("evcc-plan-reset", { detail: { lpName } })); })
            .catch(e => console.warn("[evcc-card] delete plan:", e));
        } else {
          this._hass.callService("evcc", "delete_loadpoint_plan", { loadpoint: delLpTitle })
            .then(() => { resetBadge(); window.dispatchEvent(new CustomEvent("evcc-plan-reset", { detail: { lpName } })); })
            .catch(e => console.warn("[evcc-card] delete plan:", e));
        }
      });
    });

    this.shadowRoot.querySelectorAll("button.smart-cost-clear-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this._hass.callService("button", "press", { entity_id: btn.dataset.entity });
      });
    });

    this.shadowRoot.querySelectorAll("input[type=range]:not(.plan-soc-range):not(.plan-energy-range):not([data-boost-entity])").forEach(input => {
      input.addEventListener("pointerdown", () => {
        this._isDragging    = true;
        this._pendingRender = false;
      });
      input.addEventListener("input", () => {
        const span = input.nextElementSibling;
        if (span) span.textContent = `${input.value} ${displayUnit(this._hass, input.dataset.entity)}`;
      });
      input.addEventListener("pointerup", () => {
        this._isDragging = false;
        const domain   = input.dataset.domain;
        const entityId = input.dataset.entity;
        if (domain === "select") {
          const opts = (attr(this._hass, entityId, "options") ?? [])
            .map(o => parseFloat(o)).filter(o => !isNaN(o)).sort((a, b) => a - b);
          const target  = parseFloat(input.value);
          const nearest = opts.reduce((p, c) => Math.abs(c - target) < Math.abs(p - target) ? c : p, opts[0]);
          this._hass.callService("select", "select_option", { entity_id: entityId, option: String(nearest) });
        } else {
          this._hass.callService("number", "set_value", { entity_id: entityId, value: parseFloat(input.value) });
        }
        if (this._pendingRender) { this._pendingRender = false; this._render(); }
      });
      input.addEventListener("blur", () => {
        if (this._isDragging) {
          this._isDragging = false;
          if (this._pendingRender) { this._pendingRender = false; this._render(); }
        }
      });
    });

    // Priority drag & drop
    let dragSrcLp = null;
    this.shadowRoot.querySelectorAll(".priority-item").forEach(item => {
      item.addEventListener("dragstart", () => {
        dragSrcLp = item.dataset.lp;
        item.classList.add("dragging");
      });
      item.addEventListener("dragend", () => item.classList.remove("dragging"));
      item.addEventListener("dragover", e => {
        e.preventDefault();
        this.shadowRoot.querySelectorAll(".priority-item").forEach(i => i.classList.remove("drag-over"));
        item.classList.add("drag-over");
      });
      item.addEventListener("dragleave", () => item.classList.remove("drag-over"));
      item.addEventListener("drop", e => {
        e.preventDefault();
        item.classList.remove("drag-over");
        if (!dragSrcLp || dragSrcLp === item.dataset.lp) return;
        const arr     = [...this._priorityOrder];
        const fromIdx = arr.indexOf(dragSrcLp);
        const toIdx   = arr.indexOf(item.dataset.lp);
        arr.splice(fromIdx, 1);
        arr.splice(toIdx, 0, dragSrcLp);
        this._priorityOrder = arr;
        this._render();
      });
    });

    const saveBtn = this.shadowRoot.querySelector(".priority-save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        const titles = this._priorityOrder.map(lpName => {
          const ents = this._cachedEntities?.loadpoints?.[lpName] || {};
          return this._hass?.states[ents.mode]?.attributes?.loadpoint_title ?? lpName;
        });
        await this._hass.callService("evcc", "set_loadpoint_priorities", { order: titles });
        const orig = saveBtn.textContent;
        saveBtn.textContent = "✓ " + this._t("prioritySaved");
        saveBtn.disabled = true;
        setTimeout(() => { saveBtn.textContent = orig; saveBtn.disabled = false; }, 2000);
      });
    }
  }

  _styles() {
    return `
      :host {
        display: block;
        --evcc-green:  var(--success-color,  #22c55e);
        --evcc-red:    var(--error-color,    #ef4444);
        --evcc-amber:  var(--warning-color,  #f59e0b);
        --evcc-blue:   #3b82f6;
        --evcc-orange: #f97316;
        --evcc-yellow: #eab308;
        --evcc-gray:   var(--disabled-color, #6b7280);
        --evcc-bolt:   #facc15;
      }
      .evcc-scale-wrap { container-type: inline-size; }
      @container (min-width: 450px) { .evcc-scale-wrap { zoom: 1.15; } }
      @container (min-width: 650px) { .evcc-scale-wrap { zoom: 1.3;  } }
      ha-card {
        color: var(--primary-text-color);
        font-family: var(--paper-font-body1_-_font-family, sans-serif);
      }
      .card-content { padding: 12px 16px 16px; }

      .loadpoint {
        padding: 12px 0;
        border-bottom: 1px solid var(--divider-color, #e5e7eb);
        margin-bottom: 0;
      }
      .loadpoint:first-child { padding-top: 0; }
      .loadpoint:last-child { border-bottom: none; padding-bottom: 0; }
      .lp-header {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
      }
      .lp-name { font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px; }
      .lp-badge {
        font-size: .75rem; font-weight: 600; padding: 2px 10px;
        border-radius: 999px; border: 1px solid currentColor;
      }
      .lp-badge.charging  { color: var(--evcc-green);  background: color-mix(in srgb, var(--evcc-green)  15%, transparent); }
      .lp-badge.connected { color: var(--evcc-blue);   background: color-mix(in srgb, var(--evcc-blue)   15%, transparent); }
      .lp-badge.ready     { color: var(--evcc-gray);   background: color-mix(in srgb, var(--evcc-gray)   15%, transparent); }
      .lp-badge.heating   { color: var(--evcc-amber);  background: color-mix(in srgb, var(--evcc-amber)  15%, transparent); }
      .lp-badge.idle      { color: var(--evcc-gray);   background: color-mix(in srgb, var(--evcc-gray)   15%, transparent); }

      .temp-display { text-align: center; padding: 8px 0 16px; }
      .temp-current { font-size: 3rem; font-weight: 700; line-height: 1; transition: color .3s; }
      .temp-target-label { font-size: .85rem; color: var(--secondary-text-color); margin-top: 6px; }

      .mode-row { display: flex; gap: 6px; margin-bottom: 12px; }
      .mode-btn {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        gap: 2px; padding: 8px 2px; min-width: 0;
        border: 1px solid var(--divider-color, #e5e7eb); border-radius: 8px;
        background: transparent; color: var(--secondary-text-color);
        cursor: pointer; font-size: .7rem; transition: all .15s; overflow: hidden;
      }
      .mode-btn:hover { border-color: var(--primary-color); }
      .mode-btn.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
      .mode-icon { display: flex; align-items: center; justify-content: center; line-height: 1; min-height: 20px; }
      .mode-label { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

      .soc-section { margin-bottom: 12px; }
      .soc-label-row {
        display: flex; justify-content: space-between;
        font-size: .85rem; margin-bottom: 6px; color: var(--secondary-text-color);
      }
      .vehicle-name { font-weight: 500; color: var(--primary-text-color); }
      .smart-cost-row { display: flex; justify-content: flex-end; margin-top: 4px; }
      .soc-track {
        position: relative; height: 8px;
        background: var(--divider-color, #e5e7eb); border-radius: 4px; overflow: visible;
      }
      @keyframes soc-pulse {
        0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }
      }
      .soc-fill { height: 100%; border-radius: 4px; transition: width .4s ease; }
      .soc-fill.charging { animation: soc-pulse 1.4s ease-in-out infinite; }
      .soc-limit-marker {
        position: absolute; top: -3px; width: 3px; height: 14px;
        background: #22c55e; border-radius: 2px; transform: translateX(-50%);
      }
      .soc-min-marker {
        position: absolute; top: -3px; width: 3px; height: 14px;
        background: #f59e0b; border-radius: 2px; transform: translateX(-50%);
      }

      .power-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 12px; color: var(--secondary-text-color); flex-wrap: wrap; }
      .power-row.charging { color: #22c55e; }
      .power-row.heating  { color: var(--evcc-amber); }
      .power-value { font-size: 1.6rem; font-weight: 700; }
      .power-sep { font-size: .8rem; color: var(--secondary-text-color); align-self: flex-end; padding-bottom: .2rem; }
      .power-current { font-size: .82rem; align-self: flex-end; padding-bottom: .2rem; }
      .power-phases  { font-size: .82rem; align-self: flex-end; padding-bottom: .2rem; }

      .sliders { margin-bottom: 10px; }
      .slider-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: .83rem; flex-wrap: wrap; }
      .slider-row label { flex: 0 0 auto; min-width: 70px; white-space: nowrap; color: var(--secondary-text-color); }
      .slider-control { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 120px; }
      .slider-control input { flex: 1; min-width: 0; accent-color: var(--primary-color); }
      .slider-val { flex-shrink: 0; width: 52px; text-align: right; font-size: .8rem; }
      .smart-active-hint { font-size: .75rem; color: var(--evcc-green); margin-top: -4px; margin-bottom: 8px; }
      .smart-cost-clear-row { display: flex; justify-content: flex-end; margin-top: 6px; margin-bottom: 2px; }
      .smart-cost-clear-btn { background: none; border: 1px solid var(--divider-color, #555); border-radius: 4px; cursor: pointer; font-size: .75rem; color: var(--secondary-text-color); padding: 3px 8px; font-family: inherit; transition: border-color .15s, color .15s; }
      .smart-cost-clear-btn:hover { border-color: var(--evcc-red); color: var(--evcc-red); }
      .smart-cost-chip { display: inline-flex; align-items: center; gap: 3px; font-size: .72rem; color: var(--secondary-text-color); white-space: nowrap; background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
      .smart-cost-chip:hover { color: var(--primary-color); }
      .smart-cost-chip.active { color: var(--evcc-green); }
      .smart-cost-chip.active:hover { color: var(--evcc-green); filter: brightness(1.2); }
      .settings-divider { border: none; border-top: 1px solid var(--divider-color, #e5e7eb); margin: 8px 0; }
      @keyframes smart-cost-pulse { 0%,100% { background: transparent; } 40% { background: color-mix(in srgb, var(--primary-color) 15%, transparent); } }
      .smart-cost-highlight { border-radius: 6px; animation: smart-cost-pulse 1.5s ease; }

      .toggles { margin-bottom: 10px; }
      .toggle-row { display: flex; justify-content: space-between; align-items: center; font-size: .83rem; margin-bottom: 6px; flex-wrap: wrap; gap: 4px; }
      button.toggle {
        padding: 3px 14px; border-radius: 999px; border: 1px solid var(--divider-color);
        background: transparent; color: var(--secondary-text-color);
        cursor: pointer; font-size: .75rem; font-weight: 600; transition: all .15s;
      }
      button.toggle.on { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }

      .current-block {
        border-top: 1px solid var(--divider-color, #333);
        margin-top: 10px; padding-top: 10px; margin-bottom: 10px;
      }
      .block-title-row {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
      }
      .block-title {
        font-size: .7rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: .08em; color: var(--secondary-text-color);
      }
      .current-toggle-btn {
        background: transparent; border: none; border-radius: 50%;
        color: var(--secondary-text-color); cursor: pointer;
        padding: 3px; display: flex; align-items: center; justify-content: center;
        transition: color .15s, background .15s; margin: -3px;
      }
      .current-toggle-btn:hover {
        color: var(--primary-color);
        background: var(--secondary-background-color, rgba(0,0,0,.06));
      }
      .current-toggle-btn.active { color: var(--primary-color); }
      .current-block-body[hidden] { display: none; }

      .selects { margin-bottom: 10px; }
      .select-row { display: flex; justify-content: space-between; align-items: center; font-size: .83rem; margin-bottom: 6px; flex-wrap: wrap; gap: 4px; }
      .phase-btn-group { display: flex; gap: 4px; }
      button.phase-btn {
        padding: 3px 10px; border-radius: 999px; border: 1px solid var(--divider-color);
        background: transparent; color: var(--secondary-text-color);
        cursor: pointer; font-size: .75rem; font-weight: 600; transition: all .15s; white-space: nowrap;
      }
      button.phase-btn.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }

      .site-block { padding: 0; }
      .site-table-hidden { display: none; }
      .flow-wrap-clickable {
        cursor: pointer;
        border-radius: 6px;
        transition: opacity .15s;
      }
      .flow-wrap-clickable:hover { opacity: 0.85; }

      .flow-wrap {
        margin-bottom: 18px;
        padding: 0;
      }
      .flow-wrap svg {
        overflow: visible;
      }
      .flow-overlay {
        color: var(--primary-text-color, #212121);
      }
      .site-table { display: flex; flex-direction: column; }
      .site-section-gap { border-top: 1px solid var(--divider-color, #333); margin: 10px 0 12px; }
      .site-section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--divider-color, #333); }
      .site-section-title { font-size: .8rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--secondary-text-color); }
      .site-section-total { font-size: 1rem; font-weight: 700; }
      .site-row { display: grid; grid-template-columns: 1.4rem 1fr auto; gap: 0 6px; align-items: center; padding: 5px 0; font-size: .78rem; }
      .site-row-clickable { cursor: pointer; border-radius: 4px; }
      .site-row-clickable:hover { background: var(--secondary-background-color, rgba(255,255,255,0.05)); }
      .site-row-icon  { display: flex; align-items: center; justify-content: center; }
      .site-row-label { display: flex; flex-direction: column; gap: 1px; }
      .site-row-name  { font-size: .8rem; }
      .site-row-sub   { font-size: .68rem; color: var(--secondary-text-color); }
      .site-row-pw    { font-weight: 700; font-size: .82rem; min-width: 48px; text-align: right; }
      .site-row-indent { padding-left: 1.2rem; position: relative; }
      .site-row-indent::before {
        content: "└";
        position: absolute;
        left: 0.15rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: .75rem;
        color: var(--secondary-text-color);
        opacity: 0.6;
      }
      .site-row-indent .site-row-icon { opacity: 0.7; }
      .site-row-indent .site-row-name { font-size: .75rem; color: var(--secondary-text-color); }
      .site-row-indent .site-row-pw   { font-size: .78rem; }
      .site-pw-green  { color: #22c55e; }
      .site-pw-blue   { color: #3b82f6; }
      .site-pw-yellow { color: #facc15; }

      .sankey-wrap { padding: 12px 0 8px; }
      .sankey-wrap svg { overflow: visible; }
      .sankey-node { opacity: 1; transition: opacity .15s; }
      .sankey-node:hover { opacity: 0.7; }
      .sankey-center-chevron { transition: opacity .15s; }
      .sankey-wrap:hover .sankey-center-chevron { opacity: 0.7 !important; }

      .s2-net {
        text-align: center; padding: 14px 0 16px;
        border-bottom: 1px solid var(--divider-color, #333); margin-bottom: 14px;
      }
      .s2-net-label {
        font-size: .6rem; font-weight: 700; letter-spacing: .1em;
        text-transform: uppercase; color: var(--secondary-text-color); margin-bottom: 4px;
      }
      .s2-net-value { font-size: 2.2rem; font-weight: 800; line-height: 1; letter-spacing: -.02em; }
      .s2-net-status { font-size: .75rem; font-weight: 600; margin-top: 4px; }
      .s2-pv-badge {
        display: inline-flex; align-items: center; gap: 4px;
        margin-top: 8px; background: rgba(34,197,94,0.12); color: #22c55e;
        border-radius: 20px; padding: 3px 10px; font-size: .68rem; font-weight: 700;
      }
      .s2-section { margin-bottom: 12px; }
      .s2-section-label {
        font-size: .58rem; font-weight: 700; letter-spacing: .12em;
        text-transform: uppercase; color: var(--secondary-text-color); opacity: .55; margin-bottom: 6px;
      }
      .s2-chips { display: flex; gap: 6px; flex-wrap: wrap; }
      .s2-chip {
        display: inline-flex; align-items: center; gap: 5px;
        background: var(--secondary-background-color, rgba(255,255,255,0.05));
        border-radius: 20px; padding: 5px 11px; font-size: .72rem; font-weight: 600;
        border: 1px solid var(--divider-color, #333);
      }
      .s2-chip-clickable { cursor: pointer; }
      .s2-chip-clickable:hover { opacity: 0.75; }
      .s2-chip-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
      .s2-chip-sub { font-size: .62rem; color: var(--secondary-text-color); font-weight: 400; }

      /* ── Stats Header Layout ── */
      .stats-header-row {
        display: flex; align-items: center; justify-content: space-between;
        gap: 8px; margin-bottom: 4px;
      }
      .stats-ctrl {
        display: flex; align-items: center; gap: 1px; flex-shrink: 0;
      }
      .stats-ctrl-btn {
        padding: 2px 8px; border-radius: 5px; flex-shrink: 0;
        border: none; background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer; font-size: .68rem; font-weight: 600;
        transition: background .12s, color .12s; white-space: nowrap;
      }
      .stats-ctrl-btn:hover { background: var(--secondary-background-color, rgba(128,128,128,.1)); }
      .stats-ctrl-btn.active {
        background: var(--secondary-background-color, rgba(128,128,128,.12));
        color: var(--primary-color);
      }

      /* Zeit-Navigation */
      .stats-time-nav { display: flex; align-items: center; gap: 1px; }
      .stn-btn {
        display: flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; border-radius: 5px; flex-shrink: 0;
        border: none; background: transparent; color: var(--secondary-text-color);
        cursor: pointer; transition: background .12s; padding: 0;
      }
      .stn-btn:hover:not([disabled]) { background: var(--secondary-background-color, rgba(128,128,128,.1)); }
      .stn-btn[disabled] { opacity: 0.3; cursor: default; }
      .stats-sessions-link { display: flex; align-items: center; color: var(--secondary-text-color); opacity: 0.6; text-decoration: none; flex-shrink: 0; }
      .stats-sessions-link:hover { opacity: 1; color: var(--primary-color); }
      .stn-label {
        font-size: .68rem; font-weight: 600; color: var(--primary-text-color);
        white-space: nowrap; padding: 0 2px;
      }

      /* Filter-Gruppe (rechts unten) */
      .stats-filter-group {
        display: flex; align-items: center; gap: 1px;
        overflow-x: auto; white-space: nowrap; scrollbar-width: none;
      }
      .stats-filter-group::-webkit-scrollbar { display: none; }
      .sfb-sep { width: 1px; height: 12px; background: var(--divider-color, rgba(128,128,128,.3)); flex-shrink: 0; margin: 0 2px; }
      .sfb-group-icon { display: flex; align-items: center; color: var(--secondary-text-color); opacity: 0.45; flex-shrink: 0; }

      .stats-footer-wrap {
        border-top: 1px solid var(--divider-color, #333);
        margin-top: 12px; padding-top: 8px;
      }
      .stats-footer-wrap .stats-footer { border-top: none; margin-top: 6px; padding-top: 0; }

      .stats-footer {
        border-top: 1px solid var(--divider-color, #333);
        margin-top: 12px; padding-top: 10px;
      }
      .sf-period {
        font-size: .6rem; text-transform: uppercase; letter-spacing: .08em; font-weight: 700;
        color: var(--secondary-text-color); text-align: center; margin-bottom: 6px; opacity: 0.7;
      }
      .sf-items { display: flex; align-items: center; }
      .sf-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
      .sf-val  { font-size: .82rem; font-weight: 700; }
      .sf-lbl  { font-size: .58rem; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
      .sf-sep  { width: 1px; height: 28px; background: var(--divider-color, #333); flex-shrink: 0; }

      .stats-no-data {
        font-size: .76rem; color: var(--warning-color, #f4b942);
        background: rgba(244,185,66,.08);
        border: 1px solid var(--warning-color, #f4b942);
        border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; line-height: 1.6;
      }
      .stats-no-data-link {
        display: inline-block; margin-top: 4px; color: var(--primary-color);
        text-decoration: none; font-weight: 600;
      }
      .stats-no-data-link:hover { text-decoration: underline; }

      .stats-kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
      .stats-kpi {
        background: var(--secondary-background-color, rgba(255,255,255,.05));
        border-radius: 8px; padding: 10px 8px; text-align: center;
        display: flex; flex-direction: column; gap: 3px;
      }
      .stats-kpi-val { font-size: 1.1rem; font-weight: 800; line-height: 1; }
      .stats-kpi-lbl { font-size: .58rem; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
      .stats-chart-section { margin-top: 4px; }
      .evcc-chart-wrap { position: relative; margin-left: -16px; margin-right: 0; }
      .evcc-chart-tooltip {
        position: absolute; top: 0; transform: translateX(-50%);
        background: var(--ha-card-background, var(--card-background-color, #1f2937));
        border-radius: 8px; padding: 8px 12px;
        font-size: 12px; line-height: 1.6; white-space: nowrap;
        pointer-events: none; z-index: 10;
        box-shadow: 0 4px 16px rgba(0,0,0,.35);
      }
      .ectt-header { font-weight: 700; margin-bottom: 4px; }
      .ectt-row { display: flex; align-items: center; gap: 6px; }
      .ectt-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .ectt-name { flex: 1; color: var(--primary-text-color); }
      .ectt-val { font-weight: 600; margin-left: 12px; }
      .ectt-summary { margin-top: 6px; padding-top: 5px; border-top: 1px solid var(--divider-color, #374151); font-weight: 700; }
      .ectt-avg-row { margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--divider-color, rgba(128,128,128,.2)); opacity: 0.8; }
      .evcc-chart-legend { display: flex; flex-wrap: wrap; gap: 6px 12px; justify-content: center; margin-top: 4px; }
      .ecl-item { display: flex; align-items: center; gap: 4px; font-size: .65rem; color: var(--secondary-text-color); }
      .ecl-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
      .stats-chart-title {
        font-size: .58rem; font-weight: 700; letter-spacing: .12em;
        text-transform: uppercase; color: var(--secondary-text-color); opacity: .55; margin-bottom: 8px;
      }
      .stats-chart-loading {
        height: 75px; display: flex; align-items: center; justify-content: center;
        color: var(--secondary-text-color); font-size: .75rem; opacity: .5;
      }
      .stats-solar-hint {
        font-size: .72rem; color: var(--secondary-text-color);
        margin-top: 10px; padding: 6px 10px;
        background: color-mix(in srgb, var(--evcc-green) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--evcc-green) 25%, transparent);
        border-radius: 6px; line-height: 1.4;
      }

      .battery-block { padding: 0; }
      .batt-tabs { display: flex; border-bottom: 1px solid var(--divider-color, #333); margin-bottom: 14px; }
      button.batt-tab {
        background: transparent; border: none; border-bottom: 2px solid transparent;
        color: var(--secondary-text-color); padding: 7px 16px; font-size: .84rem; cursor: pointer; margin-bottom: -1px;
      }
      button.batt-tab.active { color: var(--primary-text-color); border-bottom-color: var(--primary-text-color); font-weight: 600; }
      .batt-main-row { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
      .batt-text-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
      .batt-text-item { display: flex; gap: 8px; align-items: flex-start; }
      .batt-text-icon { display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
      .batt-text-title { font-size: .82rem; font-weight: 600; margin-bottom: 2px; }
      .batt-text-desc  { font-size: .76rem; color: var(--secondary-text-color); line-height: 1.4; }
      .batt-inline-val { color: var(--primary-color, #00b4d8); text-decoration: underline dotted; cursor: pointer; font-weight: 600; white-space: nowrap; }
      .batt-visual-col { display: flex; align-items: flex-start; gap: 10px; flex-shrink: 0; align-self: flex-start; }
      .batt-marker-top { display: none; }
      .batt-visual { display: flex; flex-direction: column; align-items: center; width: 56px; }
      .batt-cap-tip { width: 22px; height: 5px; background: var(--divider-color, #555); border-radius: 3px 3px 0 0; margin-bottom: 1px; }
      .batt-body { width: 56px; height: 130px; border: 2px solid var(--divider-color, #555); border-radius: 5px; overflow: hidden; display: flex; flex-direction: column; position: relative; }
      .batt-zone { display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; min-height: 20px; }
      .batt-zone-car  { background: #22c55e18; }
      .batt-zone-haus { background: #3b82f618; }
      .batt-zone-icon { font-size: 1.2rem; }
      .batt-divider-line { height: 2px; background: var(--divider-color, #555); flex-shrink: 0; z-index: 2; }
      .batt-soc-overlay { position: absolute; bottom: 0; left: 0; right: 0; z-index: 0; border-radius: 0 0 3px 3px; transition: height .4s; opacity: 0.55; }
      .batt-info-col { display: flex; flex-direction: column; gap: 3px; padding-top: 2px; min-width: 90px; }
      .batt-info-label { font-size: .72rem; color: var(--secondary-text-color); }
      .batt-info-pct   { font-size: 1rem; font-weight: 700; }
      .batt-info-kwh, .batt-info-power { font-size: .72rem; color: var(--secondary-text-color); }
      .batt-discharge-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--divider-color, #333); font-size: .84rem; }
      .batt-discharge-toggle { width: 42px; height: 24px; border-radius: 12px; border: none; background: var(--divider-color, #444); position: relative; cursor: pointer; flex-shrink: 0; transition: background .2s; }
      .batt-discharge-toggle.on { background: var(--primary-color, #00b4d8); }
      .batt-toggle-knob { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: white; top: 3px; left: 3px; transition: left .2s; }
      .batt-discharge-toggle.on .batt-toggle-knob { left: 21px; }
      .batt-inline-popup { display: flex; align-items: center; gap: 8px; background: var(--card-background-color, #1c1c1e); border: 1px solid var(--divider-color, #333); border-radius: 8px; padding: 8px 12px; margin-top: 10px; }
      .batt-inline-popup[hidden] { display: none; }
      .batt-inline-input { flex: 1; }
      .batt-inline-label { font-size: .84rem; font-weight: 600; min-width: 44px; text-align: right; }

      .session-block { border-top: 1px solid var(--divider-color, #e5e7eb); margin-top: 10px; padding-top: 10px; }
      .session-title { font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--secondary-text-color); margin-bottom: 8px; }
      .session-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 6px; }
      .session-item { display: flex; flex-direction: column; gap: 2px; }
      .si-label { font-size: .7rem; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .05em; }
      .si-value { font-size: .95rem; font-weight: 600; color: var(--primary-text-color); }

      .plan-block { border-top: 1px solid var(--divider-color, #e5e7eb); margin-top: 10px; padding-top: 10px; }
      .plan-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
      .plan-badge { font-size: .7rem; font-weight: 600; padding: 2px 9px; border-radius: 999px; border: 1px solid var(--divider-color); color: var(--secondary-text-color); }
      .plan-badge.planned { background: rgba(0, 120, 180, 0.3); color: #60aaff; }
      .plan-badge.active  { background: color-mix(in srgb, var(--evcc-green) 15%, transparent); color: var(--evcc-green); border-color: var(--evcc-green); }
      .plan-projection { display: flex; flex-direction: column; gap: 3px; font-size: .78rem; color: var(--secondary-text-color); margin-bottom: 10px; padding: 7px 10px; background: var(--secondary-background-color, rgba(0,0,0,.08)); border-radius: 6px; }
      .plan-projection strong { color: var(--primary-text-color); }
      .plan-inputs { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
      .plan-row { display: flex; align-items: center; gap: 8px; font-size: .83rem; flex-wrap: wrap; }
      .plan-row label { flex: 0 0 auto; min-width: 60px; white-space: nowrap; color: var(--secondary-text-color); }
      .plan-row-group { display: flex; gap: 12px; }
      .plan-row-group .plan-row { flex: 1; min-width: 0; }
      .plan-soc-control { display: flex; align-items: center; gap: 8px; flex: 1; }
      .plan-soc-range { flex: 1; accent-color: var(--primary-color); }
      .plan-soc-val { width: 42px; text-align: right; font-size: .8rem; }
      .plan-energy-range { flex: 1; accent-color: var(--primary-color); }
      .plan-energy-val { width: 52px; text-align: right; font-size: .8rem; }
      input.plan-time-input { flex: 1; padding: 4px 8px; border: 1px solid var(--divider-color, #4b5563); border-radius: 6px; background: var(--card-background-color); color: var(--primary-text-color); font-size: .82rem; color-scheme: dark light; }
      .plan-actions { display: flex; gap: 8px; }
      .plan-btn { flex: 1; padding: 7px 10px; border-radius: 7px; border: 1px solid var(--divider-color); font-size: .8rem; font-weight: 600; cursor: pointer; transition: all .15s; background: transparent; color: var(--primary-text-color); }
      .plan-btn.save { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
      .plan-btn.save:hover { filter: brightness(1.1); }
      .plan-btn.delete { color: #ef4444; border-color: #ef444466; }
      .plan-btn.delete:hover { background: #ef444422; }
      select.plan-vehicle-select, select.plan-precondition-select { flex: 1; padding: 4px 8px; border: 1px solid var(--divider-color, #4b5563); border-radius: 6px; background: var(--card-background-color); color: var(--primary-text-color); font-size: .82rem; }
      select.plan-precondition-select { flex: 0 0 auto; min-width: 90px; }
      .plan-toggle { padding: 3px 12px; border-radius: 999px; border: 1px solid var(--divider-color); font-size: .78rem; font-weight: 600; cursor: pointer; background: transparent; color: var(--secondary-text-color); transition: all .15s; }
      .plan-toggle.on { background: color-mix(in srgb, var(--evcc-green) 15%, transparent); color: var(--evcc-green); border-color: var(--evcc-green); }
      .plan-error { margin-top: 8px; padding: 6px 10px; border-radius: 6px; background: #ef444422; color: #ef4444; font-size: .78rem; word-break: break-all; }

      .empty { text-align: center; padding: 24px; color: var(--secondary-text-color); font-size: .9rem; line-height: 1.8; }
      .empty code { background: var(--code-editor-background-color, #1e1e1e); color: var(--primary-color); padding: 1px 6px; border-radius: 4px; font-size: .82rem; }
      .compact-tabs {
        display: flex; gap: 4px; margin-bottom: 12px;
        border-bottom: 1px solid var(--divider-color, #e5e7eb); padding-bottom: 0;
      }
      .compact-tab {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        gap: 2px; padding: 6px 4px 8px; background: transparent; border: none;
        border-bottom: 2px solid transparent; color: var(--secondary-text-color);
        cursor: pointer; font-size: .68rem; margin-bottom: -1px;
        transition: color .15s, border-color .15s;
      }
      .compact-tab:hover { color: var(--primary-text-color); }
      .compact-tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); font-weight: 600; }
      .compact-tab-icon  { font-size: 1rem; line-height: 1; }
      .compact-tab-label { font-size: .68rem; }
      .compact-panel[hidden] { display: none; }
      .compact-panel .plan-block,
      .compact-panel .session-block { border-top: none; margin-top: 0; padding-top: 0; }

      /* --- Priority Mode --- */
      .priority-mode { padding: 8px 0; }
      .priority-hint { font-size: .8rem; color: var(--secondary-text-color); margin-bottom: 12px; }
      .priority-list { display: flex; flex-direction: column; gap: 6px; }
      .priority-item {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px; border-radius: 8px;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        cursor: grab; user-select: none;
      }
      .priority-item.dragging { opacity: .4; }
      .priority-item.drag-over { border-color: var(--primary-color); }
      .drag-handle { font-size: 1.2rem; color: var(--secondary-text-color); cursor: grab; }
      .priority-badge {
        width: 22px; height: 22px; border-radius: 50%;
        background: var(--primary-color); color: var(--text-primary-color);
        display: flex; align-items: center; justify-content: center;
        font-size: .75rem; font-weight: bold; flex-shrink: 0;
      }
      .priority-title { flex: 1; font-weight: 500; }
      .priority-type { color: var(--secondary-text-color); font-size: .8rem; }
      .priority-actions { margin-top: 14px; text-align: right; }
      .priority-save-btn {
        padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer;
        background: var(--primary-color); color: var(--text-primary-color); font-size: .9rem;
      }
    `;
  }
}

class EvccCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._availableLoadpoints = [];
    this._detectedPrefix = null;
    this._detectingPrefix = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._detectedPrefix && !this._detectingPrefix) {
      this._detectingPrefix = true;
      detectPrefix(hass).then(p => {
        this._detectingPrefix = false;
        this._detectedPrefix = p;
        this._discoverLoadpoints();
        this._render();
      });
    }
    const prev = this._availableLoadpoints.join(",");
    this._discoverLoadpoints();
    const next = this._availableLoadpoints.join(",");
    if (prev !== next) this._render();
  }

  setConfig(config) {
    this._config = { ...config };
    if (this.shadowRoot?.activeElement?.tagName === "INPUT") return;
    this._discoverLoadpoints();
    this._render();
  }

  _getPrefix() {
    return this._config.prefix || this._detectedPrefix || "evcc_";
  }

  _discoverLoadpoints() {
    if (!this._hass) return;
    const prefix = this._getPrefix();
    const { loadpoints } = discoverEntities(this._hass, prefix);
    const SITE_PREFIXES = /^(battery|grid|pv|home)(_|$)/;
    const allLps = Object.entries(loadpoints).filter(([k]) => !SITE_PREFIXES.test(k));

    const isHeater = ([, ents]) =>
      ents.charger_feature_heating && isOn(this._hass, ents.charger_feature_heating);

    this._heatingLoadpoints = allLps.filter(isHeater).map(([k]) => k).sort();
    this._chargerLoadpoints = allLps.filter(e => !isHeater(e)).map(([k]) => k).sort();
    this._availableLoadpoints = allLps.map(([k]) => k).sort();
  }

  _esc(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true,
    }));
  }

  _sel(id, options, current) {
    return `<select id="${id}" class="ha-select">
      ${options.map(([val, label]) =>
        `<option value="${val}"${current === val ? " selected" : ""}>${label}</option>`
      ).join("")}
    </select>`;
  }

  _lpDisplayName(lp) {
    const prefix = this._getPrefix();
    const modeEntity = `select.${prefix}${lp}_mode`;
    const title = this._hass?.states[modeEntity]?.attributes?.loadpoint_title;
    return (title || lp).toUpperCase();
  }

  _checkboxes(type, selected) {
    const mode = this._config.mode || "loadpoint";
    const lps = mode === "heating"
      ? this._heatingLoadpoints
      : ["loadpoint", "compact"].includes(mode)
        ? this._chargerLoadpoints
        : this._availableLoadpoints;
    if (!lps || lps.length === 0) return `<div class="hint">Keine Ladepunkte gefunden</div>`;
    return lps.map(lp => `
      <label class="cb-row">
        <input type="checkbox" data-field="${type}" data-lp="${this._esc(lp)}" ${selected.includes(lp) ? "checked" : ""}>
        <span>${this._esc(this._lpDisplayName(lp))}</span>
      </label>
    `).join("");
  }

  _render() {
    const c    = this._config;
    const mode = c.mode || "loadpoint";
    const selLps = Array.isArray(c.loadpoints) ? c.loadpoints : [];
    const noPlan  = Array.isArray(c.no_plan)   ? c.no_plan   : [];

    const showLoadpoints    = ["loadpoint", "compact", "plan", "heating", "priority"].includes(mode);
    const showNoPlan        = ["loadpoint", "compact"].includes(mode);
    const showChargeCurrent = ["loadpoint", "compact", "heating"].includes(mode);
    const showHeatingOpts   = mode === "heating";
    const showSiteDetails   = ["site", "flow"].includes(mode);
    const showStatsPeriod   = ["stats", "site", "flow", "grid"].includes(mode);

    const titlePlaceholder = {
      loadpoint: "Standard: Ladepoint-Name",
      compact:   "Standard: Ladepoint-Name",
      plan:      "Standard: Ladepoint-Name",
      site:      "Standard: Übersicht",
      flow:      "Standard: Energiefluss",
      grid:      "Standard: Netz",
      stats:     "Standard: Statistik",
      battery:   "Standard: Hausbatterie",
      heating:   "Standard: Ladepunkt-Name",
    }[mode] || "Standard: Ladepoint-Name";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: .875rem; font-weight: 500; color: var(--primary-text-color); }
        .section-title { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--secondary-text-color); }
        .hint { font-size: .75rem; color: var(--secondary-text-color); }
        .ha-select, .ha-input {
          width: 100%; padding: 8px 12px; border-radius: 4px; font-size: 1rem;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color, #e0e0e0);
          box-sizing: border-box; font-family: inherit;
        }
        .ha-select:focus, .ha-input:focus { outline: none; border-color: var(--primary-color); }
        .cb-row { display: flex; align-items: center; gap: 8px; font-size: .875rem; cursor: pointer; padding: 4px 0; }
        .cb-row input[type="checkbox"] { accent-color: var(--primary-color); width: 16px; height: 16px; cursor: pointer; }
      </style>
      <div class="form">
        <div class="field">
          <label class="field-label" for="mode">Modus</label>
          ${this._sel("mode", [
            ["loadpoint", "Ladepunkt (loadpoint)"],
            ["compact",   "Kompakt (compact)"],
            ["site",      "Übersicht (site)"],
            ["flow",      "Energiefluss (flow)"],
            ["grid",      "Netz (grid)"],
            ["battery",   "Batterie (battery)"],
            ["stats",     "Statistik (stats)"],
            ["plan",      "Plan (plan)"],
            ["heating",   "Heizgerät (heating)"],
            ["priority",  "Priorität (priority)"],
          ], mode)}
        </div>
        <div class="field">
          <label class="field-label" for="title">Titel <span class="hint" style="display:inline">(optional)</span></label>
          <input id="title" class="ha-input" type="text" value="${this._esc(c.title || "")}" placeholder="${titlePlaceholder}">
        </div>
        <div class="field">
          <label class="field-label" for="language">Sprache</label>
          ${this._sel("language", [
            ["",   "Automatisch (aus HA)"],
            ["de", "Deutsch"],
            ["en", "English"],
            ["es", "Español"],
            ["fr", "Français"],
            ["hr", "Hrvatski"],
            ["nl", "Nederlands"],
            ["pl", "Polski"],
            ["pt", "Português"],
          ], c.language || "")}
        </div>
        ${showLoadpoints ? `
        <div class="field">
          <div class="section-title">Ladepunkte anzeigen</div>
          <div class="hint">Leer = alle anzeigen</div>
          ${this._checkboxes("loadpoints", selLps)}
        </div>
        ` : ""}
        ${showNoPlan ? `
        <div class="field">
          <div class="section-title">Kein Ladeplan für</div>
          ${this._checkboxes("no_plan", noPlan)}
        </div>
        ` : ""}
        ${showChargeCurrent ? `
        <div class="field">
          <label class="field-label" for="charge_current_settings">Ladestrom-Einstellungen</label>
          ${this._sel("charge_current_settings", [
            ["collapsed", "Eingeklappt"],
            ["expanded",  "Aufgeklappt"],
          ], c.charge_current_settings || "collapsed")}
        </div>
        ` : ""}
        ${showHeatingOpts ? `
        <div class="field">
          <label class="field-label" for="target_temp_min">Zieltemperatur Minimum <span class="hint" style="display:inline">(optional)</span></label>
          <input id="target_temp_min" class="ha-input" type="number" placeholder="z.B. 20" value="${c.target_temp_min != null ? c.target_temp_min : ""}">
        </div>
        <div class="field">
          <label class="field-label" for="target_temp_max">Zieltemperatur Maximum <span class="hint" style="display:inline">(optional)</span></label>
          <input id="target_temp_max" class="ha-input" type="number" placeholder="z.B. 70" value="${c.target_temp_max != null ? c.target_temp_max : ""}">
        </div>
        <div class="field">
          <label class="cb-row">
            <input id="show_session_energy" type="checkbox" ${c.show_session_energy ? "checked" : ""}>
            <span>Session-Energie anzeigen</span>
          </label>
        </div>
        ` : ""}
        ${showSiteDetails ? `
        <div class="field">
          <label class="field-label" for="site_details">Site-Details</label>
          ${this._sel("site_details", [
            ["expanded",  "Aufgeklappt"],
            ["collapsed", "Eingeklappt"],
          ], c.site_details || "expanded")}
        </div>
        ` : ""}
        ${showStatsPeriod ? `
        <div class="field">
          <label class="field-label" for="stats_period">Statistik-Zeitraum</label>
          ${this._sel("stats_period", [
            ["month",  "Monat"],
            ["year",   "Jahr"],
            ["total",  "Gesamt"],
          ], c.stats_period || "total")}
        </div>
        ` : ""}
      </div>
    `;

    this._addListeners();
  }

  _addListeners() {
    ["mode", "language", "site_details", "charge_current_settings", "stats_period"].forEach(id => {
      const el = this.shadowRoot.getElementById(id);
      if (!el) return;
      el.addEventListener("change", () => {
        this._config = { ...this._config, [id]: el.value || undefined };
        this._fire();
        if (id === "mode") this._render();
      });
    });

    const titleEl = this.shadowRoot.getElementById("title");
    if (titleEl) {
      titleEl.addEventListener("input", () => {
        const val = titleEl.value.trim();
        this._config = { ...this._config, title: val || undefined };
        this._fire();
      });
    }


    // Heating-specific fields
    ["target_temp_min", "target_temp_max"].forEach(id => {
      const el = this.shadowRoot.getElementById(id);
      if (el) el.addEventListener("change", () => {
        const v = el.value !== "" ? parseFloat(el.value) : undefined;
        this._config = { ...this._config, [id]: (v != null && !isNaN(v)) ? v : undefined };
        this._fire();
      });
    });

    const sessionCb = this.shadowRoot.getElementById("show_session_energy");
    if (sessionCb) sessionCb.addEventListener("change", () => {
      this._config = { ...this._config, show_session_energy: sessionCb.checked || undefined };
      this._fire();
    });

    this.shadowRoot.querySelectorAll("input[type=checkbox][data-field]").forEach(cb => {
      cb.addEventListener("change", () => {
        const field = cb.dataset.field;
        const lp    = cb.dataset.lp;
        const current = Array.isArray(this._config[field]) ? [...this._config[field]] : [];
        if (cb.checked) {
          if (!current.includes(lp)) current.push(lp);
        } else {
          const idx = current.indexOf(lp);
          if (idx > -1) current.splice(idx, 1);
        }
        this._config = { ...this._config, [field]: current.length > 0 ? current : undefined };
        this._fire();
      });
    });
  }
}

customElements.define("evcc-card-editor", EvccCardEditor);

customElements.define("evcc-card", EvccCard);
window.__evccCards = window.__evccCards || new Map();

(async function cacheBust() {
  const ver = EVCC_CARD_VERSION;

  console.info(
    `%c evcc-card %c ${ver} %c`,
    "background:#1d4ed8;color:#fff;padding:2px 4px;border-radius:3px 0 0 3px;font-weight:bold",
    "background:#22c55e;color:#fff;padding:2px 4px;border-radius:0 3px 3px 0;font-weight:bold",
    "background:transparent"
  );

  await customElements.whenDefined("home-assistant");
  const ha = document.querySelector("home-assistant");
  if (!ha || !ha.hass) return;

  try {
    const resources = await ha.hass.callWS({ type: "lovelace/resources" });
    const myRes = resources.find(r =>
      r.url && r.url.includes("evcc-card") && r.url.endsWith(".js") ||
      r.url && r.url.includes("evcc-card") && r.url.includes(".js?")
    );
    if (!myRes) return;

    const baseUrl = myRes.url.split("?")[0];
    const expectedUrl = `${baseUrl}?v=${ver}`;

    if (myRes.url === expectedUrl) return;

    await ha.hass.callWS({
      type:        "lovelace/resources/update",
      resource_id: myRes.id,
      res_type:    myRes.type || "module",
      url:         expectedUrl,
    });
    console.info(`[evcc-card] Cache URL updated -> ${expectedUrl}. Reloading page.`);
    setTimeout(() => location.reload(), 500);
  } catch (e) {
    console.warn("[evcc-card] Cache URL update failed:", e);
  }
})();

window.customCards = window.customCards || [];
window.customCards.push({
  type:        "evcc-card",
  name:        "EVCC Card",
  description: "Dashboard card for ha-evcc integration.",
  preview:     false,
  version:     EVCC_CARD_VERSION,
});