const time_zones = [
  // UTC
  { value: "UTC", label: "UTC - Coordinated Universal Time", code: "UTC" },
  
  // North America - Eastern
  { value: "America/New_York", label: "America/New_York (EST/EDT)", code: "EST" },
  { value: "America/Toronto", label: "America/Toronto (EST/EDT)", code: "EST" },
  { value: "America/Montreal", label: "America/Montreal (EST/EDT)", code: "EST" },
  { value: "America/Detroit", label: "America/Detroit (EST/EDT)", code: "EST" },
  { value: "America/Miami", label: "America/Miami (EST/EDT)", code: "EST" },
  
  // North America - Central
  { value: "America/Chicago", label: "America/Chicago (CST/CDT)", code: "CST" },
  { value: "America/Winnipeg", label: "America/Winnipeg (CST/CDT)", code: "CST" },
  { value: "America/Mexico_City", label: "America/Mexico_City (CST/CDT)", code: "CST" },
  { value: "America/Dallas", label: "America/Dallas (CST/CDT)", code: "CST" },
  
  // North America - Mountain
  { value: "America/Denver", label: "America/Denver (MST/MDT)", code: "MST" },
  { value: "America/Edmonton", label: "America/Edmonton (MST/MDT)", code: "MST" },
  { value: "America/Calgary", label: "America/Calgary (MST/MDT)", code: "MST" },
  { value: "America/Phoenix", label: "America/Phoenix (MST)", code: "MST" },
  
  // North America - Pacific
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)", code: "PST" },
  { value: "America/Vancouver", label: "America/Vancouver (PST/PDT)", code: "PST" },
  { value: "America/Seattle", label: "America/Seattle (PST/PDT)", code: "PST" },
  { value: "America/San_Francisco", label: "America/San_Francisco (PST/PDT)", code: "PST" },
  
  // North America - Alaska & Hawaii
  { value: "America/Anchorage", label: "America/Anchorage (AKST/AKDT)", code: "AKST" },
  { value: "Pacific/Honolulu", label: "Pacific/Honolulu (HST)", code: "HST" },
  
  // Atlantic
  { value: "America/Halifax", label: "America/Halifax (AST/ADT)", code: "AST" },
  { value: "Atlantic/Bermuda", label: "Atlantic/Bermuda (AST/ADT)", code: "AST" },
  { value: "America/St_Johns", label: "America/St_Johns (NST/NDT)", code: "NST" },
  
  // South America
  { value: "America/Sao_Paulo", label: "America/Sao_Paulo (BRT/BRST)", code: "BRT" },
  { value: "America/Argentina/Buenos_Aires", label: "America/Buenos_Aires (ART)", code: "ART" },
  { value: "America/Caracas", label: "America/Caracas (VET)", code: "VET" },
  { value: "America/Lima", label: "America/Lima (PET)", code: "PET" },
  { value: "America/Santiago", label: "America/Santiago (CLT/CLST)", code: "CLT" },
  
  // Europe - Western
  { value: "Europe/London", label: "Europe/London (GMT/BST)", code: "GMT" },
  { value: "Europe/Dublin", label: "Europe/Dublin (GMT/IST)", code: "GMT" },
  { value: "Europe/Lisbon", label: "Europe/Lisbon (WET/WEST)", code: "WET" },
  
  // Europe - Central
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)", code: "CET" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)", code: "CET" },
  { value: "Europe/Rome", label: "Europe/Rome (CET/CEST)", code: "CET" },
  { value: "Europe/Madrid", label: "Europe/Madrid (CET/CEST)", code: "CET" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET/CEST)", code: "CET" },
  { value: "Europe/Brussels", label: "Europe/Brussels (CET/CEST)", code: "CET" },
  { value: "Europe/Vienna", label: "Europe/Vienna (CET/CEST)", code: "CET" },
  { value: "Europe/Zurich", label: "Europe/Zurich (CET/CEST)", code: "CET" },
  
  // Europe - Eastern
  { value: "Europe/Helsinki", label: "Europe/Helsinki (EET/EEST)", code: "EET" },
  { value: "Europe/Athens", label: "Europe/Athens (EET/EEST)", code: "EET" },
  { value: "Europe/Bucharest", label: "Europe/Bucharest (EET/EEST)", code: "EET" },
  { value: "Europe/Sofia", label: "Europe/Sofia (EET/EEST)", code: "EET" },
  { value: "Europe/Kiev", label: "Europe/Kiev (EET/EEST)", code: "EET" },
  
  // Europe - Moscow
  { value: "Europe/Moscow", label: "Europe/Moscow (MSK)", code: "MSK" },
  { value: "Europe/Istanbul", label: "Europe/Istanbul (TRT)", code: "TRT" },
  
  // Asia - Middle East
  { value: "Asia/Qatar", label: "Asia/Qatar (AST)", code: "AST" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)", code: "GST" },
  { value: "Asia/Tehran", label: "Asia/Tehran (IRST/IRDT)", code: "IRST" },
  { value: "Asia/Jerusalem", label: "Asia/Jerusalem (IST/IDT)", code: "IST" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh (AST)", code: "AST" },
  
  // Asia - South
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)", code: "IST" },
  { value: "Asia/Mumbai", label: "Asia/Mumbai (IST)", code: "IST" },
  { value: "Asia/Dhaka", label: "Asia/Dhaka (BST)", code: "BST" },
  { value: "Asia/Karachi", label: "Asia/Karachi (PKT)", code: "PKT" },
  
  // Asia - Southeast
  { value: "Asia/Bangkok", label: "Asia/Bangkok (ICT)", code: "ICT" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)", code: "SGT" },
  { value: "Asia/Manila", label: "Asia/Manila (PST)", code: "PST" },
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB)", code: "WIB" },
  { value: "Asia/Kuala_Lumpur", label: "Asia/Kuala_Lumpur (MYT)", code: "MYT" },
  
  // Asia - East
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)", code: "CST" },
  { value: "Asia/Beijing", label: "Asia/Beijing (CST)", code: "CST" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong_Kong (HKT)", code: "HKT" },
  { value: "Asia/Taipei", label: "Asia/Taipei (CST)", code: "CST" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)", code: "JST" },
  { value: "Asia/Seoul", label: "Asia/Seoul (KST)", code: "KST" },
  
  // Australia & New Zealand
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)", code: "AEST" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne (AEST/AEDT)", code: "AEST" },
  { value: "Australia/Brisbane", label: "Australia/Brisbane (AEST)", code: "AEST" },
  { value: "Australia/Perth", label: "Australia/Perth (AWST)", code: "AWST" },
  { value: "Australia/Adelaide", label: "Australia/Adelaide (ACST/ACDT)", code: "ACST" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland (NZST/NZDT)", code: "NZST" },
  
  // Africa
  { value: "Africa/Cairo", label: "Africa/Cairo (EET)", code: "EET" },
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT)", code: "WAT" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST)", code: "SAST" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)", code: "EAT" },
  { value: "Africa/Casablanca", label: "Africa/Casablanca (WET/WEST)", code: "WET" },
  
  // Pacific
  { value: "Pacific/Fiji", label: "Pacific/Fiji (FJT/FJST)", code: "FJT" },
  { value: "Pacific/Guam", label: "Pacific/Guam (ChST)", code: "ChST" },
  { value: "Pacific/Tahiti", label: "Pacific/Tahiti (TAHT)", code: "TAHT" },
];

// If you just need the codes array:
const timezone_codes = [
  "UTC", "EST", "CST", "MST", "PST", "AKST", "HST", "AST", "NST",
  "BRT", "ART", "VET", "PET", "CLT", "GMT", "WET", "CET", "EET",
  "MSK", "TRT", "GST", "IRST", "IST", "BST", "PKT", "ICT", "SGT",
  "WIB", "MYT", "HKT", "JST", "KST", "AEST", "AWST", "ACST",
  "NZST", "WAT", "SAST", "EAT", "FJT", "ChST", "TAHT"
];

export { time_zones, timezone_codes };