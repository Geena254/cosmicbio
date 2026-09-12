export interface CountyRainfall {
  name: string;
  lat: number;
  lng: number;
  zone: string;
  /** Approximate long-term mean annual rainfall in mm. */
  annual: number;
  /** Approximate mean monthly rainfall in mm, January to December. */
  monthly: number[];
}

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const ZONE_COLORS: Record<string, string> = {
  "Central highlands (bimodal)": "#00B4D8",
  "Lake basin (near year-round)": "#2E9E5B",
  "Coastal (long rains dominant)": "#A467E9",
  "Arid north (very low, erratic)": "#FC3D21",
  "Semi-arid east (short rains dominant)": "#E8A33D",
  "Rift Valley highlands (long season)": "#0B3D91",
};

/**
 * Open-source derived climatology: approximate long-term mean monthly rainfall
 * per county, generalised from public climate datasets (CHIRPS / WorldClim style
 * agro-ecological zone averages). Indicative planning figures, not forecasts.
 */
export const COUNTY_RAINFALL: CountyRainfall[] = [
  { name: "Mombasa", lat: -4.043, lng: 39.668, zone: "Coastal (long rains dominant)", annual: 909, monthly: [21, 13, 42, 153, 221, 76, 60, 51, 51, 76, 85, 60] },
  { name: "Kwale", lat: -4.174, lng: 39.452, zone: "Coastal (long rains dominant)", annual: 1017, monthly: [24, 14, 48, 171, 247, 86, 66, 57, 57, 86, 95, 66] },
  { name: "Kilifi", lat: -3.511, lng: 39.909, zone: "Coastal (long rains dominant)", annual: 963, monthly: [22, 14, 45, 162, 234, 81, 63, 54, 54, 81, 90, 63] },
  { name: "Tana River", lat: -1.5, lng: 39.5, zone: "Arid north (very low, erratic)", annual: 414, monthly: [12, 12, 36, 96, 60, 12, 12, 12, 12, 48, 72, 30] },
  { name: "Lamu", lat: -2.269, lng: 40.902, zone: "Coastal (long rains dominant)", annual: 856, monthly: [20, 12, 40, 144, 208, 72, 56, 48, 48, 72, 80, 56] },
  { name: "Taita Taveta", lat: -3.4, lng: 38.367, zone: "Semi-arid east (short rains dominant)", annual: 688, monthly: [40, 22, 54, 135, 54, 9, 7, 7, 9, 72, 171, 108] },
  { name: "Garissa", lat: -0.453, lng: 39.646, zone: "Arid north (very low, erratic)", annual: 380, monthly: [11, 11, 33, 88, 55, 11, 11, 11, 11, 44, 66, 28] },
  { name: "Wajir", lat: 1.747, lng: 40.058, zone: "Arid north (very low, erratic)", annual: 345, monthly: [10, 10, 30, 80, 50, 10, 10, 10, 10, 40, 60, 25] },
  { name: "Mandera", lat: 3.938, lng: 41.857, zone: "Arid north (very low, erratic)", annual: 310, monthly: [9, 9, 27, 72, 45, 9, 9, 9, 9, 36, 54, 22] },
  { name: "Marsabit", lat: 2.334, lng: 37.99, zone: "Arid north (very low, erratic)", annual: 380, monthly: [11, 11, 33, 88, 55, 11, 11, 11, 11, 44, 66, 28] },
  { name: "Isiolo", lat: 0.354, lng: 37.582, zone: "Arid north (very low, erratic)", annual: 414, monthly: [12, 12, 36, 96, 60, 12, 12, 12, 12, 48, 72, 30] },
  { name: "Meru", lat: 0.047, lng: 37.65, zone: "Central highlands (bimodal)", annual: 1205, monthly: [40, 45, 110, 230, 180, 45, 30, 35, 40, 150, 210, 90] },
  { name: "Tharaka Nithi", lat: -0.3, lng: 37.85, zone: "Central highlands (bimodal)", annual: 1084, monthly: [36, 40, 99, 207, 162, 40, 27, 32, 36, 135, 189, 81] },
  { name: "Embu", lat: -0.538, lng: 37.457, zone: "Central highlands (bimodal)", annual: 1144, monthly: [38, 43, 104, 218, 171, 43, 28, 33, 38, 142, 200, 86] },
  { name: "Kitui", lat: -1.367, lng: 38.011, zone: "Semi-arid east (short rains dominant)", annual: 766, monthly: [45, 25, 60, 150, 60, 10, 8, 8, 10, 80, 190, 120] },
  { name: "Machakos", lat: -1.518, lng: 37.267, zone: "Semi-arid east (short rains dominant)", annual: 803, monthly: [47, 26, 63, 158, 63, 10, 8, 8, 10, 84, 200, 126] },
  { name: "Makueni", lat: -1.803, lng: 37.621, zone: "Semi-arid east (short rains dominant)", annual: 729, monthly: [43, 24, 57, 142, 57, 10, 8, 8, 10, 76, 180, 114] },
  { name: "Nyandarua", lat: -0.18, lng: 36.48, zone: "Central highlands (bimodal)", annual: 1266, monthly: [42, 47, 116, 242, 189, 47, 32, 37, 42, 158, 220, 94] },
  { name: "Nyeri", lat: -0.42, lng: 36.947, zone: "Central highlands (bimodal)", annual: 1205, monthly: [40, 45, 110, 230, 180, 45, 30, 35, 40, 150, 210, 90] },
  { name: "Kirinyaga", lat: -0.499, lng: 37.283, zone: "Central highlands (bimodal)", annual: 1266, monthly: [42, 47, 116, 242, 189, 47, 32, 37, 42, 158, 220, 94] },
  { name: "Murang'a", lat: -0.784, lng: 37.04, zone: "Central highlands (bimodal)", annual: 1205, monthly: [40, 45, 110, 230, 180, 45, 30, 35, 40, 150, 210, 90] },
  { name: "Kiambu", lat: -1.171, lng: 36.83, zone: "Central highlands (bimodal)", annual: 1144, monthly: [38, 43, 104, 218, 171, 43, 28, 33, 38, 142, 200, 86] },
  { name: "Turkana", lat: 3.117, lng: 35.597, zone: "Arid north (very low, erratic)", annual: 290, monthly: [8, 8, 26, 68, 42, 8, 8, 8, 8, 34, 51, 21] },
  { name: "West Pokot", lat: 1.4, lng: 35.2, zone: "Rift Valley highlands (long season)", annual: 991, monthly: [26, 38, 68, 119, 136, 110, 128, 136, 94, 68, 42, 26] },
  { name: "Samburu", lat: 1.216, lng: 36.947, zone: "Arid north (very low, erratic)", annual: 448, monthly: [13, 13, 39, 104, 65, 13, 13, 13, 13, 52, 78, 32] },
  { name: "Trans Nzoia", lat: 1.022, lng: 34.984, zone: "Rift Valley highlands (long season)", annual: 1338, monthly: [34, 52, 92, 161, 184, 150, 172, 184, 126, 92, 57, 34] },
  { name: "Uasin Gishu", lat: 0.552, lng: 35.31, zone: "Rift Valley highlands (long season)", annual: 1165, monthly: [30, 45, 80, 140, 160, 130, 150, 160, 110, 80, 50, 30] },
  { name: "Elgeyo Marakwet", lat: 0.8, lng: 35.5, zone: "Rift Valley highlands (long season)", annual: 1106, monthly: [28, 43, 76, 133, 152, 124, 142, 152, 104, 76, 48, 28] },
  { name: "Nandi", lat: 0.183, lng: 35.1, zone: "Rift Valley highlands (long season)", annual: 1282, monthly: [33, 50, 88, 154, 176, 143, 165, 176, 121, 88, 55, 33] },
  { name: "Baringo", lat: 0.466, lng: 35.973, zone: "Rift Valley highlands (long season)", annual: 815, monthly: [21, 31, 56, 98, 112, 91, 105, 112, 77, 56, 35, 21] },
  { name: "Laikipia", lat: 0.4, lng: 36.78, zone: "Central highlands (bimodal)", annual: 842, monthly: [28, 31, 77, 161, 126, 31, 21, 24, 28, 105, 147, 63] },
  { name: "Nakuru", lat: -0.303, lng: 36.08, zone: "Rift Valley highlands (long season)", annual: 932, monthly: [24, 36, 64, 112, 128, 104, 120, 128, 88, 64, 40, 24] },
  { name: "Narok", lat: -1.085, lng: 35.868, zone: "Rift Valley highlands (long season)", annual: 991, monthly: [26, 38, 68, 119, 136, 110, 128, 136, 94, 68, 42, 26] },
  { name: "Kajiado", lat: -1.852, lng: 36.787, zone: "Semi-arid east (short rains dominant)", annual: 651, monthly: [38, 21, 51, 128, 51, 8, 7, 7, 8, 68, 162, 102] },
  { name: "Kericho", lat: -0.367, lng: 35.283, zone: "Rift Valley highlands (long season)", annual: 1457, monthly: [38, 56, 100, 175, 200, 162, 188, 200, 138, 100, 62, 38] },
  { name: "Bomet", lat: -0.783, lng: 35.342, zone: "Rift Valley highlands (long season)", annual: 1338, monthly: [34, 52, 92, 161, 184, 150, 172, 184, 126, 92, 57, 34] },
  { name: "Kakamega", lat: 0.283, lng: 34.752, zone: "Lake basin (near year-round)", annual: 1640, monthly: [69, 103, 172, 253, 218, 126, 126, 138, 126, 126, 103, 80] },
  { name: "Vihiga", lat: 0.077, lng: 34.723, zone: "Lake basin (near year-round)", annual: 1640, monthly: [69, 103, 172, 253, 218, 126, 126, 138, 126, 126, 103, 80] },
  { name: "Bungoma", lat: 0.563, lng: 34.56, zone: "Lake basin (near year-round)", annual: 1573, monthly: [66, 99, 165, 242, 209, 121, 121, 132, 121, 121, 99, 77] },
  { name: "Busia", lat: 0.46, lng: 34.111, zone: "Lake basin (near year-round)", annual: 1430, monthly: [60, 90, 150, 220, 190, 110, 110, 120, 110, 110, 90, 70] },
  { name: "Siaya", lat: 0.061, lng: 34.288, zone: "Lake basin (near year-round)", annual: 1356, monthly: [57, 86, 142, 209, 180, 104, 104, 114, 104, 104, 86, 66] },
  { name: "Kisumu", lat: -0.092, lng: 34.768, zone: "Lake basin (near year-round)", annual: 1287, monthly: [54, 81, 135, 198, 171, 99, 99, 108, 99, 99, 81, 63] },
  { name: "Homa Bay", lat: -0.527, lng: 34.457, zone: "Lake basin (near year-round)", annual: 1287, monthly: [54, 81, 135, 198, 171, 99, 99, 108, 99, 99, 81, 63] },
  { name: "Migori", lat: -1.063, lng: 34.473, zone: "Lake basin (near year-round)", annual: 1430, monthly: [60, 90, 150, 220, 190, 110, 110, 120, 110, 110, 90, 70] },
  { name: "Kisii", lat: -0.681, lng: 34.767, zone: "Lake basin (near year-round)", annual: 1573, monthly: [66, 99, 165, 242, 209, 121, 121, 132, 121, 121, 99, 77] },
  { name: "Nyamira", lat: -0.563, lng: 34.935, zone: "Lake basin (near year-round)", annual: 1573, monthly: [66, 99, 165, 242, 209, 121, 121, 132, 121, 121, 99, 77] },
  { name: "Nairobi", lat: -1.286, lng: 36.817, zone: "Central highlands (bimodal)", annual: 964, monthly: [32, 36, 88, 184, 144, 36, 24, 28, 32, 120, 168, 72] },
];

export const RAIN_SEASONS = [
  { label: "Long rains", months: "March - May", note: "Main planting season in most of Kenya." },
  { label: "Short rains", months: "October - December", note: "Second season; dominant in the semi-arid east." },
  { label: "Continuous", months: "March - September", note: "Lake basin and western highlands rarely have a dry month." },
];
