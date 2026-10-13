import { ChronoUnit, DateTimeFormatter, DayOfWeek, Duration, Instant, LocalDate, LocalDateTime, LocalTime, ZoneId } from "@js-joda/core";
import "@js-joda/locale_en";
import { Locale } from "@js-joda/locale_en";
import "@js-joda/timezone";




export const getLocalDateTimeFromMillis = (millis: number) => Instant.ofEpochMilli(millis).atZone(ZoneId.systemDefault()).toLocalDateTime();
export const getMillisFromLocalDateTime = (localDateTime: LocalDateTime) => localDateTime && localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

export const getLocalDateFromMillis = (millis: number) => getLocalDateTimeFromMillis(millis).toLocalDate();
export const getMillisFromLocalDate = (localDate: LocalDate) => localDate && getMillisFromLocalDateTime(localDate.atStartOfDay());

export const getMaxLocalDate = (...dates: LocalDate[]) => dates.reduce(((previousValue, currentValue) => previousValue.isAfter(currentValue) ? previousValue : currentValue), LocalDate.MIN);
export const getMinLocalDate = (...dates: LocalDate[]) => dates.reduce(((previousValue, currentValue) => previousValue.isBefore(currentValue) ? previousValue : currentValue), LocalDate.MAX);

export const getMaxLocalDateTime = (...dates: LocalDateTime[]) => dates.reduce(((previousValue, currentValue) => previousValue.isAfter(currentValue) ? previousValue : currentValue), LocalDateTime.MIN);
export const getMinLocalDateTime = (...dates: LocalDateTime[]) => dates.reduce(((previousValue, currentValue) => previousValue.isBefore(currentValue) ? previousValue : currentValue), LocalDateTime.MAX);

export const getMaxLocalTime = (...times: LocalTime[]) => times.reduce(((previousValue, currentValue) => previousValue.isAfter(currentValue) ? previousValue : currentValue), LocalTime.MIN);
export const getMinLocalTime = (...times: LocalTime[]) => times.reduce(((previousValue, currentValue) => previousValue.isBefore(currentValue) ? previousValue : currentValue), LocalTime.MAX);


export const getStrippedMillisViaLocalDate = (date?: Date) => getMillisFromLocalDate(getLocalDateFromMillis(date ? date.getTime() : Date.now()));
export const getStrippedMillisViaLocalDateTime = (date?: Date) => getMillisFromLocalDateTime(getLocalDateTimeFromMillis(date ? date.getTime() : Date.now()).withSecond(0).withNano(0));


const DTF_hh_mm_ss = DateTimeFormatter.ofPattern("HH:mm:ss").withLocale(Locale.ENGLISH);
const DTF_dd_MM_yyyy = DateTimeFormatter.ofPattern("dd/MM/yyyy").withLocale(Locale.ENGLISH);
const DTF_dd_MM_yyyy_hh_mm_a = DateTimeFormatter.ofPattern("dd/MM/yyyy, hh:mm a").withLocale(Locale.ENGLISH);
const DTF_dd_MMM_yyyy_hh_mm_a = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a").withLocale(Locale.ENGLISH);
const DTF_dd_MMM_yyyy = DateTimeFormatter.ofPattern("dd MMM yyyy").withLocale(Locale.ENGLISH);
const DTF_MMM_yyyy = DateTimeFormatter.ofPattern("MMM yyyy").withLocale(Locale.ENGLISH);
const DTF_dd = DateTimeFormatter.ofPattern("dd").withLocale(Locale.ENGLISH);
const DTF_dd_MMM = DateTimeFormatter.ofPattern("dd MMM").withLocale(Locale.ENGLISH);
const DTF_dd_MM = DateTimeFormatter.ofPattern("dd/MM").withLocale(Locale.ENGLISH);
const DTF_dd_MMM_hh_mm_a = DateTimeFormatter.ofPattern("dd MMM, hh:mm a").withLocale(Locale.ENGLISH);
const DTF_EEE = DateTimeFormatter.ofPattern("EEE").withLocale(Locale.ENGLISH);
const DTF_hh_mm_a = DateTimeFormatter.ofPattern("hh:mm a").withLocale(Locale.ENGLISH);
const DTF_HH_hr_mm_min = DateTimeFormatter.ofPattern("HH 'hr' mm 'min'").withLocale(Locale.ENGLISH);


export const formatTo_hh_mm_ss = (date: LocalTime | LocalDateTime): string => date.format(DTF_hh_mm_ss);
export const formatMillisTo_hh_mm_ss = (millis) => formatTo_hh_mm_ss(getLocalDateTimeFromMillis(millis).toLocalTime());
export const formatTo_EEE = (date: LocalDate | LocalDateTime): string => date.format(DTF_EEE);
export const formatMillisTo_EEE = (millis) => formatTo_EEE(getLocalDateFromMillis(millis));

export const formatTo_dd = (date: LocalDate | LocalDateTime): string => date.format(DTF_dd);
export const formatMillisTo_dd = (millis) => formatTo_dd(getLocalDateFromMillis(millis));

export const formatTo_dd_MM = (date: LocalDate | LocalDateTime): string => date.format(DTF_dd_MM);
export const formatMillisTo_dd_MM = (millis) => formatTo_dd_MM(getLocalDateFromMillis(millis));

export const formatTo_dd_MMM = (date: LocalDate | LocalDateTime): string => date.format(DTF_dd_MMM);
export const formatMillisTo_dd_MMM = (millis) => formatTo_dd_MMM(getLocalDateFromMillis(millis));

export const formatTo_dd_MMM_yyyy = (date: LocalDate | LocalDateTime): string => date.format(DTF_dd_MMM_yyyy);
export const formatMillisTo_dd_MMM_yyyy = (millis) => formatTo_dd_MMM_yyyy(getLocalDateFromMillis(millis));

export const formatTo_MMM_yyyy = (date: LocalDate | LocalDateTime): string => date.format(DTF_MMM_yyyy);
export const formatMillisTo_MMM_yyyy = (millis) => formatTo_MMM_yyyy(getLocalDateFromMillis(millis));

export const formatTo_dd_MMM_hh_mm_a = (date: LocalDateTime): string => date.format(DTF_dd_MMM_hh_mm_a);
export const formatMillisTo_dd_MMM_hh_mm_a = (millis) => formatTo_dd_MMM_hh_mm_a(getLocalDateTimeFromMillis(millis));

export const formatTo_dd_MM_hh_mm_a = (date: LocalDateTime): string => formatTo_dd_MM(date) + ", " + formatTo_hh_mm_a(date);
export const formatMillisTo_dd_MM_hh_mm_a = (millis) => formatTo_dd_MM_hh_mm_a(getLocalDateTimeFromMillis(millis));

export const formatTo_hh_mm_a_dd_MMM = (date: LocalDateTime): string => date.format(DTF_hh_mm_a) + ", " + date.format(DTF_dd_MMM);
export const formatMillisTo_hh_mm_a_dd_MMM = (millis) => formatTo_hh_mm_a_dd_MMM(getLocalDateTimeFromMillis(millis));

export const formatTo_hh_mm_a_dd_MM = (date: LocalDateTime): string => date.format(DTF_hh_mm_a) + ", " + date.format(DTF_dd_MM);
export const formatMillisTo_hh_mm_a_dd_MM = (millis) => formatTo_hh_mm_a_dd_MM(getLocalDateTimeFromMillis(millis));

export const formatTo_dd_MM_yyyy = (date: LocalDate | LocalDateTime): string => date.format(DTF_dd_MM_yyyy);
export const formatMillisTo_dd_MM_yyyy = (millis) => formatTo_dd_MM_yyyy(getLocalDateFromMillis(millis));

export const formatTo_dd_MM_yyyy_hh_mm_a = (localDateTime: LocalDateTime) => localDateTime.format(DTF_dd_MM_yyyy_hh_mm_a);
export const formatMillisTo_dd_MM_yyyy_hh_mm_a = (millis) => formatTo_dd_MM_yyyy_hh_mm_a(getLocalDateTimeFromMillis(millis));

export const formatTo_dd_MMM_yyyy_hh_mm_a = (localDateTime: LocalDateTime) => localDateTime.format(DTF_dd_MMM_yyyy_hh_mm_a);
export const formatMillisTo_dd_MMM_yyyy_hh_mm_a = (millis) => formatTo_dd_MMM_yyyy_hh_mm_a(getLocalDateTimeFromMillis(millis));

export const formatTo_hh_mm_a = (time: LocalTime | LocalDateTime) => time.format(DTF_hh_mm_a);
export const formatMillisTo_hh_mm_a = (millis) => formatTo_hh_mm_a(getLocalDateTimeFromMillis(millis));

export const formatTo_HH_hr_mm_min = (time: LocalTime | LocalDateTime) => time.format(DTF_HH_hr_mm_min);
export const formatMillisTo_HH_hr_mm_min = (millis) => formatTo_HH_hr_mm_min(getLocalDateTimeFromMillis(millis));


export const getMinutesFromLocalTime = (localTime: LocalTime) => localTime && Duration.between(LocalTime.MIDNIGHT, localTime).abs().toMinutes();

type LDTType = LocalDateTime | LocalDate | LocalTime;

export const isBetween = (time: LDTType, start: LDTType, end: LDTType): boolean => {
	  return start && end && time && /*NOT->*/ ! start.isAfter(time) && /*NOT->*/ ! end.isBefore(time);
};

export const getDurationDays = (start: LocalDate | LocalDateTime | Date, end: LocalDate | LocalDateTime | Date): number => {
	  if (/*FALSY->*/ !!! start || /*FALSY->*/ !!! end) return 0;
	  const allowedTypes = [ Date, LocalDateTime, LocalDate ];
	  if (allowedTypes.some(clazz => start instanceof clazz) && allowedTypes.some(clazz => end instanceof clazz)) {
			 const startMillis = start instanceof Date ? start.getTime() : start instanceof LocalDateTime ? getMillisFromLocalDateTime(start) : getMillisFromLocalDate(start);
			 const endMillis = end instanceof Date ? end.getTime() : end instanceof LocalDateTime ? getMillisFromLocalDateTime(end) : getMillisFromLocalDate(end);
			 return ChronoUnit.DAYS.between(Instant.ofEpochMilli(startMillis), Instant.ofEpochMilli(endMillis));
	  } else {
			 return 0;
	  }
};

export const ONE_DAY = LocalTime.MILLIS_PER_DAY;


export const getPastFutureJSDateFromToday = (days: number) => {
	  const today = LocalDate.now();
	  if (days < 0) {
			 return new Date(getMillisFromLocalDate(today.minusDays(Math.abs(days))));
	  } else if (days === 0) {
			 return new Date(getMillisFromLocalDate(today));
	  } else if (days > 0) {
			 return new Date(getMillisFromLocalDate(today.plusDays(days)));
	  }
};

export const getPastFutureLocalDateFromToday = (days: number) => {
	  const today = LocalDate.now();
	  if (days < 0) {
			 return today.minusDays(Math.abs(days));
	  } else if (days === 0) {
			 return today;
	  } else if (days > 0) {
			 return today.plusDays(days);
	  }
};

export const getPastFutureMillisFromToday = (days: number) => getMillisFromLocalDate(getPastFutureLocalDateFromToday(days));

export const getPastFutureLocalDateTimeFromNow = (days: number) => {
	  const now = LocalDateTime.now();
	  if (days < 0) {
			 return now.minusDays(Math.abs(days));
	  } else if (days === 0) {
			 return now;
	  } else if (days > 0) {
			 return now.plusDays(days);
	  }
};

export const getPastFutureMillisFromNow = (days: number) => getMillisFromLocalDateTime(getPastFutureLocalDateTimeFromNow(days));


export const getJSDateISO = (date: Date) => date && date.toISOString().split("T")[0];

export const formatDate_DoW = (date: number | Date) => date && new Date(date).toLocaleDateString("en-GB", { weekday: "short" });
export const formatDateWithWeekday = (date: number | Date) => date && new Date(date).toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
export const formatDate_dd_mmm_yyyy = (date: number | Date) => date && new Date(date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
export const formatDate_mmm = (date: number | Date) => date && new Date(date).toLocaleDateString("en-GB", { month: "short" });
export const formatTime = (date: number | Date) => date && new Date(date).toLocaleTimeString("en-GB", { hour: "numeric", minute: "numeric" });
export const formatDateTime = (date: number | Date) => date && `${ formatDate_dd_mmm_yyyy(date) }, ${ formatTime(date) }`;

export const formatDay = (days: number, placeholder = " - ") => days === 0 ? placeholder : days + " d";


export const getNextExactLocalDateFromRawDays = (value: LocalDate | LocalDateTime | Date | number, day: number): LocalDate => {
	  
	  if (/*FALSY->*/ !!! value) throw new Error("Invalid parameter in getExactLocalDateFromRawDays(). `value` is required.");
	  if (/*FALSY->*/ !!! day) throw new Error("Invalid parameter in getExactLocalDateFromRawDays(). `day` is required.");
	  if (day < 0) throw new Error("Invalid parameter in getExactLocalDateFromRawDays(). `day` must be a positive number.");
	  
	  const localDate =
				 (value instanceof LocalDate) ? value
							: (value instanceof LocalDateTime) ? value.toLocalDate()
									  : (value instanceof Date) ? getLocalDateFromMillis(value.getTime())
												 : (typeof value === "number") ? getLocalDateFromMillis(value)
															: null;
	  
	  if (/*FALSY->*/ !!! localDate) throw new Error("Invalid parameter in getExactLocalDateFromRawDays(). `value` must be of type LocalDate, LocalDateTime, Date or number.");
	  
	  if (day === 0) return localDate;
	  
	  if (day === 7) return localDate.plusWeeks(1);
	  if (day === 14) return localDate.plusWeeks(2);
	  if (day === 21) return localDate.plusWeeks(3);
	  if (day === 30) return localDate.plusMonths(1);
	  if (day === 60) return localDate.plusMonths(2);
	  if (day === 90) return localDate.plusMonths(3);
	  if (day === 120) return localDate.plusMonths(4);
	  if (day === 180) return localDate.plusMonths(6);
	  if (day === 270) return localDate.plusMonths(9);
	  
	  if (day % 365 === 0) return localDate.plusYears(day / 365);
	  
	  return localDate.plusDays(day); // THIS AUTOMATICALLY COVERS (days < 7) OR (days > 7 && days < 14) OR (days > 14 && days < 30) ... SO ON.
	  
};


export const compareByYearIncludingBC = (a: string, b: string, asc = true) => {
	  
	  const aBC = a.includes("BC");
	  const bBC = b.includes("BC");
	  
	  if (aBC && bBC) {
			 const aYear = parseInt(a.replace("BC", "").trim());
			 const bYear = parseInt(b.replace("BC", "").trim());
			 return asc ? bYear - aYear : aYear - bYear;
	  }
	  if (aBC) {
			 return asc ? -1 : 1;
	  }
	  if (bBC) {
			 return asc ? 1 : -1;
	  }
	  
	  const aDate = LocalDate.parse(a);
	  const bDate = LocalDate.parse(b);
	  return asc ? aDate.compareTo(bDate) : bDate.compareTo(aDate);
	  
};

export const getNextDayOfWeekMatchingLocalDate = (dow: DayOfWeek, date: LocalDate) => {
	  if (/*FALSY->*/ !!! dow || /*FALSY->*/ !!! date) throw new Error("Invalid parameter in getNextWeekDayFrom(). `dow` and `date` are required.");
	  let next = date.plusDays(1);
	  while (next.dayOfWeek() !== dow) {
			 next = next.plusDays(1);
	  }
	  return next;
};


export const formatMillisFully = (mil: string | number | LocalDate | LocalDateTime, withTime = false, withYear = true): string => {
	  if (mil instanceof LocalDate && withTime) withTime = false;
	  if (mil instanceof LocalDate) mil = getMillisFromLocalDate(mil);
	  if (mil instanceof LocalDateTime) mil = getMillisFromLocalDateTime(mil);
	  return `${ formatMillisTo_EEE(mil) }, ${ withTime ? (withYear ? formatMillisTo_dd_MMM_yyyy_hh_mm_a(mil) : formatMillisTo_dd_MMM_hh_mm_a(mil)) : (withYear ? formatMillisTo_dd_MMM_yyyy(mil) : formatMillisTo_dd_MMM(mil)) }`;
};
