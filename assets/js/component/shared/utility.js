export function isValidResponse(rsp)
{
  return (rsp
    && rsp.status == 200 || rsp.status == 201
    && !rsp.data.error
  );
}

export function isErrorResponse(rsp)
{
  return (rsp && rsp.status == 200 && rsp.data.error);
}

export function getErrorMessage(rsp)
{
  if (rsp && rsp.data.error.message)
    return rsp.data.error.message;
  else
    return 'Unknown error';
}

export function getAPIData(rsp)
{
  return rsp.data.data;
}

export function getFormattedDate(timestamp)
{
  const date = new Date(timestamp * 1000);

  return date.getFullYear()
    + '/' + (date.getMonth() + 1)
    + '/' + date.getDate();
}

export function getFormattedDateTime(timestamp)
{
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
  isValidResponse,
  isErrorResponse,
  getErrorMessage,
  getAPIData,
  getFormattedDate,
  getFormattedDateTime
}
