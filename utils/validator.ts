function date(date: string) {
  const timestamp = Date.parse(date);
  return !Number.isNaN(timestamp);
}

const validator = { date };

export default validator;
