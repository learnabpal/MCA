import { useFirebaseUid, useFirebaseUserEmail } from "@/firebase/FirebaseApp";
import { Instant, LocalDate, LocalDateTime, ZoneId } from "@js-joda/core";
import axios from "axios";
import React from "react";




export const emailHelperText = () => "Email address is invalid or suspicious!";

export const passwordHelperText = () => "Password must have at least 8 characters including one uppercase, one digit and one special character!";


export const emailRegEx = () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isEpochLikeEmailSpam(email: string): boolean {
	  try {
			 const local = email.trim().split("@")[0];
			 // 1. Check for 7+ digit number
			 const longNums = local.match(/\d{7,}/);
			 if (longNums) {
					const digits = longNums[0];
					const epoch = Number(digits);
					const zoneId = ZoneId.UTC;
					if (digits.length === 13) {
						  Instant.ofEpochMilli(epoch).atZone(zoneId).toLocalDateTime(); // If no error thrown, that means a spam email
						  return true;
					} else if (digits.length === 10) {
						  Instant.ofEpochSecond(epoch).atZone(zoneId).toLocalDateTime(); // If no error thrown, that means a spam email
						  return true;
					} else {
						  // Not epoch, but still 7+ digits
						  return true;
					}
			 }
			 // 2. Interleaved letter–digit tokens (bots): need >= 6 chars, >= 2 transitions
			 // Example flagged: "z7f93a9" (l-d-l-d-l-d), "ab12cd34"
			 // Example allowed: "humanname1995" (letters+digits only 1 transition)
			 const tokens = local.match(/[a-z0-9]{6,}/gi);
			 if (tokens) {
					const suspicious = tokens.some(t => {
						  let transitions = 0, prevIsDigit = /\d/.test(t[0]);
						  for (let i = 1; i < t.length; i++) {
								 const isDigit = /\d/.test(t[i]);
								 if (isDigit !== prevIsDigit) transitions++;
								 prevIsDigit = isDigit;
						  }
						  const letters = (t.match(/[a-z]/gi) || []).length;
						  const digits = (t.match(/\d/g) || []).length;
						  return letters >= 2 && digits >= 2 && transitions >= 2; // interleaving
					});
					if (suspicious) return true;
			 }
			 
			 return false;
	  } catch (_) {
			 return false;
	  }
}

export function isStructuredPrefixSpam(email: string): boolean {
	  try {
			 const local = email.trim().toLowerCase().split("@")[0];
			 const spammyPrefixes = [
					"admin", "root", "system", "support", "info", "contact", "test", "demo", "user", "guest", "temp",
					"service", "api", "bot", "script", "auto", "mailer", "noreply", "security", "verify", "account",
					"alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda",
					"mu", "nu", "xi", "omicron", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"
			 ];
			 const parts = local.split(".");
			 // Prefix + dot + name pattern
			 if (parts.length >= 2) {
					const prefix = parts[0];
					const suffix = parts[1];
					if (spammyPrefixes.includes(prefix)) {
						  // If prefix is known spam pattern and suffix is simple alpha name
						  if (/^[a-z]{3,}$/.test(suffix)) {
								 return true;
						  }
					}
			 }
			 return false;
	  } catch (_) {
			 return false;
	  }
}


export const passwordRegEx = () => /^(?=\S{8,})(?=\S*[A-Z])(?=\S*\d)(?=\S*\W).*$/;

export const phoneRegEx = (hasCountryCode = false) =>
		  hasCountryCode
					 ? /^\+([1-9]{1,3})\d{6,14}$/ // Country code (1-3 digits) + phone number (6-14 digits)
					 : /^\d{6,14}$/; // Local numbers (6-14 digits)

export const matches = (value: string, regEx: RegExp) => /*TRUTHY->*/ !! (value && regEx && value.match(regEx));

export const isInRestrictedList = (email_II_uid: string | null | undefined) => {
	  if ((email_II_uid ?? "").includes("@")) email_II_uid = email_II_uid?.toLowerCase();
	  return [
			 "gp1@gp.com",
			 "googleplay@googleplay.com",
			 "apxdgtl@gmail.com",
			 "iamarnabpal@gmail.com"
	  ].some(val => val === email_II_uid);
};


export const useHideFromGoogle = () => {
	  const uid = useFirebaseUid();
	  const email = useFirebaseUserEmail();
	  const notInGoogleDevList = isNotInGoogleDevList(email || uid);
	  return { notInGoogleDevList };
};

export const isNotInGoogleDevList = (email_II_uid: string) => {
	  const present = [
			 "gp1@gp1.com",
			 "gp1@gp.com",
			 "googleplay@googleplay.com"
			 // "apxdgtl"
	  ].includes(email_II_uid);
	  return  /*NOT->*/ ! present;
};

export const isAnyEmpty = (...values) => values.some(value => ! value || (typeof value === "string" && value.trim().length === 0));

export const isAllEmpty = (...values) => values.every(value => ! value || (typeof value === "string" && value.trim().length === 0));

export const isAnyFalsy = (...values) => values.some(value => ! value);
export const isBlankOrNullish = (value) => [ "", null, undefined ].some(v => v === value);
export const isFalsy = (value, excludeZero = false) => [ 0, false, "", null, undefined ].some(v => (excludeZero && v === 0) ? false : v === value);

export const isValidString = (value: any) => typeof value === "string" && value.trim().length > 0;

export const ifValidString = (value: any, onValid: (trimmed: string) => void) => isValidString(value) && onValid?.((value as string).trim());

export const useValidationChecker = ({
														strings, numbers = [], emails = [], phones = [], hasCountryCode, onChecked
												 }:
															{
																  strings: string[],
																  numbers?: (number | string)[],
																  emails?: string[],
																  phones?: string [],
																  hasCountryCode?: boolean,
																  onChecked?: (valid: boolean) => void
															}) => {
	  const hasErrors = () => {
			 return isAnyEmpty(...strings) ||
						numbers.some(number =>  /*NOT->*/ ! matches(String(number), /^\d+$/)) ||
						emails.some(email =>  /*NOT->*/ ! matches(email, emailRegEx())) ||
						phones.some(phone =>  /*NOT->*/ ! matches(String(phone), phoneRegEx(hasCountryCode)));
	  };
	  React.useEffect(() => {
			 onChecked?.( /*NOT->*/ ! hasErrors());
	  }, [ strings, numbers, emails, phones ]);
	  return { hasErrors };
};


export const capitalise = (value: string, restLower = false) => value && value.charAt(0).toUpperCase() + (restLower ? value.slice(1).toLowerCase() : value.slice(1));

export const pluralify = (value: number, text: string, suffix: string = "s") => value > 1 ? text + suffix : text;

export const paddify = (value: number | string, { length = 2, withChar = "0", where = "start" }: { length?: number, withChar?: string, where?: "start" | "end" } = {}) => {
	  const stringValue = typeof value === "number" ? value.toString() : value;
	  return where === "start" ? stringValue.padStart(length, withChar) : stringValue.padEnd(length, withChar);
};

export const uniquify = <T extends any>(array: T[]) => array.filter((value, index) => array.indexOf(value) === index).filter(Boolean);


export const getTrimmedMillisForDev = () => Date.now().toString().slice(-5);


export const formatCurrency = (amount: number): string => amount.toLocaleString("en-IN", { style: "currency", currency: "INR" });

export const formatNumber = (amount: number): string => amount.toLocaleString("en-GB", { useGrouping: true });

export const isValidPositiveNumber = (value: string | number): boolean => isFinite(value) && Number(value) > 0;

/**
 * `end` is `INCLUSIVE`
 */
export const randomInRangeInteger = (start: number, end: number, mod = 0): number => {
	  const normal = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;
	  if (mod && mod > 1) {
			 const minMultiple = Math.ceil(start / mod);
			 const maxMultiple = Math.floor(end / mod);
			 if (minMultiple > maxMultiple) {
					return normal(start, end); // No multiples in range
			 }
			 const randomMultiple = normal(minMultiple, maxMultiple);
			 return randomMultiple * mod;
	  }
	  return normal(start, end);
};

/**
 * `end` is `INCLUSIVE`
 */
export const randomInRangeFloat = (start: number, end: number, fDigits = 1): number => reNumberify((Math.random() * (end - start)) + start, fDigits);

export const reNumberify = (value: number | string, fDigits = 1) => {
	  const safeValue = isFinite(value) ? Number(value) : 0;
	  return Number(safeValue.toFixed(clampify(fDigits, 0, 20)));
};

export const randomInteger = (factor = 8) => Math.floor(Math.random() * factor * 11) + factor;

export const randomCappedInteger = (initial: number) => initial + Math.floor(Math.random() * (99 - initial + 1));

export const randomRepeater = (times: number = 2) => {
	  let value = Math.random();
	  for (let i = 1; i < times; i++) {
			 value *= Math.random();
	  }
	  return value;
};

export const clampify = (num: number, lower: number, upper: number) => Math.max(lower, Math.min(upper, num));

/**
 * Should always stick to `weight`. It preserves the magnitude and linearity properties and returns a `signed` floating point number.
 * <p>The `log` loses these properties but returns a `positive` floating point number `always`.
 */
export const fractionify = (value: number, which: "log" | "weight" = "weight"): number => {
	  if (value === 0) return 0;
	  if (which === "log") {
			 if (value > 0) {
					const result = Math.log(1 + value);
					return (result > 0 && result < 1) ? result : fractionify(result, "log");
			 } else if (value < 0) {
					const result = -Math.log(1 - value);
					return (result > -1 && result < 0) ? result : fractionify(result, "log");
			 }
	  } else if (which === "weight") {
			 let absValue = Math.abs(value);
			 while (absValue >= 1) {
					absValue /= 10;
			 }
			 return value > 0 ? absValue : -absValue;
	  }
	  return 0; // SHOULD NEVER REACH
};

/**
 * Mere { ...object } will result in a shallow copy. To get a truly deep clone, this function can be used without any tension.
 * <p>It also takes a `converterFn` to convert the cloned object to the desired `Class`.
 */
export const deepCloneObject = <T>(object: T, converterFn?: (value: T) => T) => {
	  const obj = JSON.parse(JSON.stringify(object));
	  return converterFn ? converterFn(obj) : obj as T;
};


export const deepEqual = (...objs: any[]) => {
	  // If fewer than two values are provided, there is nothing to compare → trivially equal
	  if (objs.length < 2) return true;
	  
	  const eq = (a: any, b: any): boolean => {
			 // Same reference or same primitive value → equal, no deeper check needed
			 if (a === b) return true;
			 
			 // Different runtime types OR one side is null (null is typeof "object")
			 // At this point they cannot be deeply equal
			 if (typeof a !== typeof b || a === null || b === null) return false;
			 
			 // Same type, not null, but not an object (i.e. primitive already failed ===)
			 // Primitives that are not strictly equal are never deeply equal
			 if (typeof a !== "object") return false;
			 
			 // Objects with different number of own keys cannot be deeply equal
			 const ak = Object.keys(a), bk = Object.keys(b);
			 if (ak.length !== bk.length) return false;
			 
			 // Every key in `a` must exist in `b` and its value must be deeply equal
			 return ak.every(k => bk.includes(k) && eq(a[k], b[k]));
	  };
	  
	  // Compare every object against the first one
	  return objs.every(o => eq(o, objs[0]));
};


/**
 * Logs the value to the console and returns the value.
 */
export const peekaboo = <T>(value: T, stringify = false) => {
	  console.log(stringify ? JSON.stringify(value, null, 4) : value);
	  return value;
};

export const arrayTo2dArray = <T>(array: T[], step = 2) => {
	  const result: T[][] = [];
	  for (let i = 0; i < array.length; i += step) {
			 result.push(array.slice(i, i + step));
	  }
	  return result;
};

/**
 * A flexible repeater function that can be used to repeat rows and columns with custom logic.
 * @param rows must be > 0
 * @param cols can be omitted (defaults to `rows`)
 * @param onRow have either this
 * @param onCell or this
 * @param propagate whether to stop on first non-undefined value (defaults to `false`), use `false` with one-line lambdas
 * if you don't want to return early because of JS quirks (`someExpression = something` will return the assigned value, not `undefined`),
 * or use `{}` to explicitly return `undefined`.
 */
export const repeater = <T>({
											rows, cols = rows,
											onRow, onCell,
											propagate = false
									 }:
												{
													  rows: number, cols?: number,
													  onRow?: (r: number, emitterFn: (fn: (c: number) => T | undefined) => T | undefined) => T | undefined,
													  onCell?: (r: number, c: number) => T | undefined,
													  propagate?: boolean
												}) => {
	  if (rows <= 0 || cols <= 0) return undefined;
	  if (onRow && onCell) throw new Error("Cannot have both `onRow` and `onCell`");
	  if ( /*NOT->*/ ! onRow &&  /*NOT->*/ ! onCell) return undefined;
	  const cellFn = (fn: (c: number) => T | undefined): T | undefined => {
			 for (let c = 0; c < cols; c++) {
					const result = fn(c);
					if (result !== undefined && propagate) return result;
			 }
	  };
	  for (let r = 0; r < rows; r++) {
			 if (onRow) {
					const result = onRow(r, cellFn);
					if (result !== undefined && propagate) return result;
			 } else if (onCell) {
					const result = cellFn(c => onCell(r, c));
					if (result !== undefined && propagate) return result;
			 }
	  }
};

export const shuffle = <T>(arr: T[]): T[] => {
	  const a = arr.slice();
	  for (let i = a.length - 1; i > 0; i--) {
			 const j = Math.floor(Math.random() * (i + 1));
			 const t = a[i];
			 a[i] = a[j];
			 a[j] = t;
	  }
	  return a;
};


export const stringsToNumbers = (values: string[]) => values?.map(value => Number(value));
export const numbersToStrings = (values: number[]) => values?.map(value => value.toString());

export const booleansToNumbers = (values: boolean[]) => values?.map(value => Number(value));
export const numbersToBooleans = (values: number[]) => values?.map(value => /*TRUTHY->*/ !! value);


/**
 * This is actually `LayoutRectangle` interface from `onLayout(event)` of a view.
 * Since I converted it to a `type`, I can see the properties in the type definition, unlike the interface.
 */
export type APXOnLayoutItemDimensions = { width: number, height: number, x: number, y: number };


export const nearestInt = (value: number, opts?: { step?: number, factorOnly?: boolean }) => {
	  const { step = 10, factorOnly } = opts || {};
	  return Math.round(value / step) * (factorOnly ? 1 : step);
};

export const findIndicationColourFromPercentage = (pc: number, cols?: string[]) => {
	  const c = cols || [ "red", "orange", "amber", "lightGreen", "green" ];
	  const len = c.length || 1;
	  const step = len > 1 ? 100 / (len - 1) : 100;
	  const i = nearestInt(clampify(pc, 0, 100), { factorOnly: true, step });
	  const f = clampify(i, 0, len - 1);
	  return colours[`${ c[f] }A400`];
};

export const generateRandomName = (length = 8) => {
	  const consonants = "bcdfghjklmnpqrstvwxyz";
	  const vowels = "aeiou";
	  let uid = "";
	  for (let i = 0; i < length / 2; i++) {
			 uid += consonants.charAt(randomIndexFrom(consonants));
			 uid += vowels.charAt(randomIndexFrom(vowels));
	  }
	  return capitalise(uid);
};

export const randomIndexFrom = <T>(s: T[] | string) => Math.floor(Math.random() * s.length);

export const arrayRotatingIndex = (index: number, length: number) => ((index % length) + length) % length;

export const adjustHexColour = (hex: string, percentInt: number) => {
	  hex = hex.replace("#", "");
	  
	  // Expand short hex (#abc -> #aabbcc)
	  if (hex.length === 3) {
			 hex = hex.split("").map(c => c + c).join("");
	  }
	  
	  const num = parseInt(hex, 16);
	  let r = (num >> 16) & 255;
	  let g = (num >> 8) & 255;
	  let b = num & 255;
	  
	  const adjust = (channel) => Math.min(255, Math.max(0, Math.round(channel + (channel * percentInt) / 100)));
	  
	  r = adjust(r);
	  g = adjust(g);
	  b = adjust(b);
	  
	  const toHex = (c) => c.toString(16).padStart(2, "0");
	  return `#${ toHex(r) }${ toHex(g) }${ toHex(b) }`;
};


// NOT GUARANTEED TO WORK
export const useThumbnailFetcher = (url: string) => {
	  const [ thumbnail, setThumbnail ] = React.useState(null);
	  React.useEffect(() => {
			 if ( ! url) {
					return;
			 }
			 
			 // Helper: resolve relative hrefs against base URL
			 const resolveUrl = (base, path) => {
					try {
						  return new URL(path, base).toString();
					} catch (e) {
						  return null;
					}
			 };
			 
			 // tiny switch: use proxy only for web
			 const proxyForWeb = "https://api.allorigins.win/raw?url=";
		  
			 const fetchUrl = (proxyForWeb + encodeURIComponent(url)) || url;
			 
			 // Fetch page HTML and try to extract good candidate images
			 axios.get(fetchUrl, { responseType: "text" })
					.then(
							  ({ data }) => {
									 return data.toString();
							  },
							  (reason) => {
									 return Promise.reject(reason);
							  })
					.then(html => {
						  // quick-and-dirty parsing via regex (works for most pages)
						  // 1) look for og:image
						  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
									 || html.match(/<meta[^>]*name=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
						  if (ogMatch && ogMatch[1]) {
								 const resolved = resolveUrl(url, ogMatch[1].trim());
								 if (resolved) {
										setThumbnail(resolved);
										return Promise.resolve();
								 }
						  }
					
						  // 2) look for twitter:image
						  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
						  if (twMatch && twMatch[1]) {
								 const resolved = resolveUrl(url, twMatch[1].trim());
								 if (resolved) {
										setThumbnail(resolved);
										return Promise.resolve();
								 }
						  }
					
						  // 3) look for link rel icons (icon, shortcut icon, apple-touch-icon)
						  const linkIconMatch = html.match(/<link[^>]*rel=["']?(?:shortcut icon|icon|apple-touch-icon)[^"']*["']?[^>]*href=["']([^"']+)["'][^>]*>/i);
						  if (linkIconMatch && linkIconMatch[1]) {
								 const resolved = resolveUrl(url, linkIconMatch[1].trim());
								 if (resolved) {
										setThumbnail(resolved);
										return Promise.resolve();
								 }
						  }
					
						  // 4) none found — fallback to Google favicon (very reliable for an icon)
						  setThumbnail(fetchFaviconViaGoogle(url));
						  return Promise.resolve();
					}, reason => {
						  return Promise.reject(reason);
					});
			 
	  }, [ url ]);
	  return thumbnail;
};

export const fetchFaviconViaGoogle = (url: string) => {
	  const exts = [ "jpg", "jpeg", "png", "gif", "svg" ];
	  if (exts.some(ext => url.endsWith(ext))) {
			 return url;
	  }
	  return `https://www.google.com/s2/favicons?sz=256&domain_url=${ encodeURIComponent(url) }`; // DONT ENCODE FOR IMAGE URLS, MAY NOT WORK
};


export const interpolateColour = (startHex: string, endHex: string, blendRatio: number) => {
	  const start = parseInt(startHex.slice(1), 16);
	  const end = parseInt(endHex.slice(1), 16);
	  
	  const r = Math.round(((start >> 16) & 0xff) + (((end >> 16) & 0xff) - ((start >> 16) & 0xff)) * blendRatio);
	  const g = Math.round(((start >> 8) & 0xff) + (((end >> 8) & 0xff) - ((start >> 8) & 0xff)) * blendRatio);
	  const b = Math.round((start & 0xff) + ((end & 0xff) - (start & 0xff)) * blendRatio);
	  
	  return `#${ (r << 16 | g << 8 | b).toString(16).padStart(6, "0") }`;
};

export type GradientStop = { offset: string; colour: string };

// Return a smooth colour along the gradientStops based on progress percentage
export const getInterpolatedGradientColour = (gradientStops: GradientStop[], progressPercent: number) => {
	  if ( /*NOT->*/ ! gradientStops || gradientStops.length === 0) return "#000000";
	  if (gradientStops.length === 1) return gradientStops[0].colour;
	  
	  const normalised = progressPercent / 100; // convert 0–100% → 0–1
	  
	  const position = normalised * (gradientStops.length - 1);
	  const lowerIndex = Math.floor(position);
	  const blendRatio = position - lowerIndex;
	  
	  const startColour = gradientStops[lowerIndex].colour;
	  const endColour = gradientStops[Math.min(lowerIndex + 1, gradientStops.length - 1)].colour;
	  
	  return interpolateColour(startColour, endColour, blendRatio);
};


export const polarToCartesian = (angleDegrees: number, distance: number, centreX: number, centreY: number = centreX) => {
	  const angleRadians = (angleDegrees * Math.PI) / 180;
	  return {
			 x: centreX + distance * Math.cos(angleRadians),
			 y: centreY + distance * Math.sin(angleRadians)
	  };
};


/**
 * Pick ONE item from a list using "softmax" (temperature-based) randomness.
 *
 * In plain words:
 * - You give a list of items and a matching list of numeric scores (higher = better).
 * - The function turns those scores into probabilities.
 * - It then rolls the dice and returns one item.
 *
 * The `temp` (temperature) is a single knob that controls how "greedy" or "random" the pick is:
 * - Very low temp (e.g. 0.1) ≈ almost always pick the highest-scoring item.
 * - Medium temp (e.g. 1.0) ≈ prefer higher scores, but others still have a chance.
 * - High temp (e.g. 2.0+) ≈ close to random; scores matter less.
 *
 * Notes:
 * - The function is generic: it works for ANY item type (moves, strings, objects, etc.).
 * - It is numerically stable (avoids overflow by shifting scores internally).
 * - If there’s only one item or temp is ~0, it simply returns the best-scoring item (argmax).
 * - Ensure `items.length === scores.length`.
 *
 * @template T
 * @param {T[]} items
 *   The options to choose from. Can be any type.
 *
 * @param {number[]} scores
 *   One score per item. Higher = better. Must match `items.length`.
 *
 * @param {number} temp
 *   Temperature controlling greediness vs randomness.
 *   - Use a small value (e.g. 0.1–0.6) for “mostly best”.
 *   - Use around 1.0 for a balanced mix.
 *   - Use larger values (1.5–3) for more variety.
 *
 * @returns {T}
 *   A single item from `items`, chosen according to the softmax weighting of `scores`.
 *
 * @example
 * // Choose a product to recommend:
 * const products = [{id:1},{id:2},{id:3}];
 * const scores = [0.9, 0.4, 0.2];         // relevance scores
 * const pick = softmaxPick(products, scores, 0.8);
 *
 * @example
 * // Choose a game move with a small touch of randomness:
 * const moves = allMoves;                  // e.g. [{from:{}, to:{}}, ...]
 * const scores = moves.map(evaluateMove);  // higher is better
 * const chosen = softmaxPick(moves, scores, 0.5);
 *
 * @example
 * // Make it almost deterministic (always best move):
 * const best = softmaxPick(items, scores, 0.0001);
 */
export const softmaxPick = <T>(items: T[], scores: number[], temp: number): T => {
	  if (items.length === 1 || temp <= 0.0001) {
			 // pure argmax
			 let bi = 0, bv = -Infinity;
			 for (let i = 0; i < scores.length; i++) if (scores[i] > bv) {
					bv = scores[i];
					bi = i;
			 }
			 return items[bi];
	  }
	  // numerically stable softmax
	  const maxS = Math.max(...scores);
	  const exps = scores.map(v => Math.exp((v - maxS) / temp));
	  const sum = exps.reduce((a, b) => a + b, 0);
	  let r = Math.random() * sum;
	  for (let i = 0; i < exps.length; i++) {
			 r -= exps[i];
			 if (r <= 0) return items[i];
	  }
	  return items[items.length - 1]; // fallback
};


export const createYMDPaths = (date: LocalDate | LocalDateTime | Date) => {
	  if (date instanceof LocalDateTime) date = date.toLocalDate();
	  if (date instanceof Date) date = Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
	  const yyyy = date.year().toString();
	  const mm = date.monthValue().toString().padStart(2, "0");
	  const day = date.dayOfMonth();
	  const dd = day.toString().padStart(2, "0");
	  const maxDays = date.lengthOfMonth();
	  return { yyyy, mm, dd, day, maxDays };
};

export type YMBitmask = Record<string, Record<string, number>>

export const createYMDKeysViaBitmask = (obj: YMBitmask, onDateKeyed: (ymd: string) => void) => {
	  if (obj) {
			 Object.keys(obj).forEach(yearKey => {
					const months = obj[yearKey];
					Object.keys(months).forEach(monthKey => {
						  const bitmask = months[monthKey];
						  const { yyyy, mm, maxDays } = createYMDPaths(LocalDate.of(Number(yearKey), Number(monthKey), 1));
						  for (let day = 1; day <= maxDays; day++) {
								 if (hasDayInMonthBitmask(bitmask, day)) {
										const dd = day.toString().padStart(2, "0");
										const dateKey = `${ yyyy }-${ mm }-${ dd }`;
										onDateKeyed(dateKey);
								 }
						  }
					});
			 });
	  }
};

export const setDayToMonthBitmask = (bitmask: number | undefined, day: number) => (bitmask || 0) | (1 << (day - 1));
export const getDayInMonthBitmask = (bitmask: number | undefined, day: number) => (bitmask || 0) & (1 << (day - 1));
export const hasDayInMonthBitmask = (bitmask: number | undefined, day: number) => getDayInMonthBitmask(bitmask, day) !== 0;


export const countCharsWords = (text: string) => {
	  text = (text ?? "").trim();
	  if (text.length === 0) return { chars: 0, words: 0 };
	  
	  const tokens = text.split(/\s+/u).filter(Boolean);
	  
	  // Word must contain at least one Unicode letter or number
	  const isWord = (t: string) => /[\p{L}\p{N}]/u.test(t);
	  
	  // Remove leading/trailing punctuation & symbols (Unicode-aware)
	  // Keep inner apostrophes, hyphens, dots
	  const normaliseToken = (t: string) => t.replace(/^[^\p{L}\p{N}]+/gu, "")
														  .replace(/[^\p{L}\p{N}]+$/gu, "");
	  
	  const wc = tokens.map(normaliseToken).filter(Boolean).filter(isWord);
	  
	  return {
			 chars: wc.join("").length,
			 words: wc.length
	  };
};
