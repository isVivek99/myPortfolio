export function formatDate(utcDateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(utcDateString);
  return date.toLocaleDateString(undefined, options);
}
