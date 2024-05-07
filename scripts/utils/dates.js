function isWeekend(date) {
  const dateString = date.format("dddd");
  return dateString === "Saturday" || dateString === "Sunday"
}

export default isWeekend;