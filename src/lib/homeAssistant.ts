import request from 'electron-request';

// ----------------------------------------
// Interfaces
// ----------------------------------------

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

export interface HomeAssistantResponse {
  ok: boolean,
  body: string,
}

// ----------------------------------------
// Making requests to HomeAssistant servers
// ----------------------------------------

export const homeAssistantRequest = async (
  server: HomeAssistantServer,
  params: HomeAssistantRequestParams
): Promise<HomeAssistantResponse> => {

  // Build the request URL
  const url = `${server.protocol}://${server.hostname}:${server.port}${params.endpoint}`;

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
    return { ok: response.ok, body: responseBody };

  } catch (error) {

    // Return error if something fails
    return { ok: false, body: error.message };
  }
}

