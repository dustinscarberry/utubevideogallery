export const getFormattedDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.getFullYear()
    + '/' + (date.getMonth() + 1)
    + '/' + date.getDate();
}

export const getFormattedDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString(
    'en-US',
    {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  );
}

export default {
  getFormattedDate,
  getFormattedDateTime
};
