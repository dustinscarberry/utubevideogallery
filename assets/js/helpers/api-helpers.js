export function isValidResponse(rsp)
{
  return (rsp
    && (rsp.status == 200 || rsp.status == 201)
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

export default {
  isValidResponse,
  isErrorResponse,
  getErrorMessage,
  getAPIData
}
