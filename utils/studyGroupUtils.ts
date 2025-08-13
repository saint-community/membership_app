import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export function cleanDateString(dateStr: string): string {
  return dateStr
    .replace(/(\d{1,2})(st|nd|rd|th)/g, '$1')
    .replace(/,\s*/g, ' ')
    .trim();
}
export const isLate = (dueDate: string, submitDate: string) => {
  console.log('dueDate', dueDate, 'submitDate', submitDate);
  const cleanDue = cleanDateString(dueDate);
  const cleanSubmit = cleanDateString(submitDate);
  console.log('cleanDue:', cleanDue, 'cleanSubmit:', cleanSubmit);

  const due = dayjs(cleanDue, 'DD MMMM YYYY hh:mma');
  const submit = dayjs(cleanSubmit, 'DD MMMM YYYY hh:mma');

  console.log('Parsed due:', due.toISOString(), 'submit:', submit.toISOString());
  return submit.isAfter(due);
};
const getOrdinal = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`; // 4th - 20th
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};
export const getStudyGroupDateRange = (dueDate: string) => {
  console.log('Due Date:', dueDate);

  const cleaned = cleanDateString(dueDate);
  console.log('Cleaned Due Date:', cleaned);

  const end = dayjs(cleaned, 'DD MMMM YYYY');
  const start = end.subtract(7, 'day');

  const sameMonth = start.month() === end.month();

  if (sameMonth) {
    return `${getOrdinal(start.date())} - ${getOrdinal(end.date())} ${end.format('MMMM, YYYY')}`;
  } else {
    return `${getOrdinal(start.date())} ${start.format('MMMM, YYYY')} - ${getOrdinal(end.date())} ${end.format('MMMM, YYYY')}`;
  }
};
