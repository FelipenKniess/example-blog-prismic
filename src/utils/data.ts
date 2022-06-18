const months = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'dez',
];

export const formatDate = (date: string): string => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const mouth = months[newDate.getMonth()];
  const year = newDate.getFullYear();
  return `${day} ${mouth} ${year}`;
};
