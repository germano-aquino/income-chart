function stringToDate(dateStr: string) {
  const [dayStr, monthStr, yearStr] = dateStr.split("/");

  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10);

  const monthIndex = parseInt(monthStr, 10) - 1;
  return new Date(year, monthIndex, day);
}

function stringToNumber(str: string) {
  return parseFloat(
    str.replace(/\s/g, "").replace(/\./g, "").replace(",", "."),
  );
}

function floatToInt(float: number) {
  return Math.round(100 * float);
}

export function stringToInt(str: string) {
  return floatToInt(stringToNumber(str));
}

export function intToCurrency(number: number) {
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function encodeBody(obj: object) {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, String(value)]),
    ),
  );
}

const converter = {
  stringToDate,
  stringToInt,
  encodeBody,
};

export default converter;
