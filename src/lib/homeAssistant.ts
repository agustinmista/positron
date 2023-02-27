import request from 'electron-request';

export interface HomeAssistantServer {
  protocol: ('http' | 'https'),
  hostname: string,
  port: number,
  token: string
}

export interface HomeAssistantRequestParams {
  method: ('GET' | 'POST'),
  endpoint: string,
  body?: string
}

export interface HomeAssistantResponseOk {
  ok: boolean,
  response: string,
  error?: undefined,
}

export interface HomeAssistantResponseError {
  ok: boolean,
  error: string,
  response?: undefined,
}

// Send a request to a Home Assistant server
export const homeAssistantRequest = async (
  server: HomeAssistantServer,
  params: HomeAssistantRequestParams
): Promise<HomeAssistantResponseOk | HomeAssistantResponseError> => {

  // Build the request URL
  const url = `${server.protocol}://${server.hostname}:${server.port}/api${params.endpoint}`;

  try {

    // Perform the request
    const response = await request(url, {
      method: params.method,
      headers: {
        'Authorization': `Bearer ${server.token}`,
        'Content-Type': 'application/json'
      },
      body: params.body ? params.body : null
    });

    // Parse the response body as an object
    const responseBody = await response.text();

    // Return ok!
    return { ok: response.ok, response: responseBody };

  } catch (error) {

    // Return error if something fails
    return { ok: false, error: error.message };
  }
}

