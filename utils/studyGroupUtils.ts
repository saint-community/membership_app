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
