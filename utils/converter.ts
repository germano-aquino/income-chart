function stringToDate(dateStr: string) {
  const [dayStr, monthStr, yearStr] = dateStr.split("/");

  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  const monthIndex = parseInt(monthStr, 10) - 1;
  return new Date(year, monthIndex, day);
}

function currencyToInt(income: string) {
  const incomeInCentsString = income.replace(",", "");
  return Number(incomeInCentsString);
}

const converter = {
  stringToDate,
  currencyToInt,
};

export default converter;
