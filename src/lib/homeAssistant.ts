import axios from 'axios';

// ----------------------------------------
// Interfaces
// ----------------------------------------

export interface HomeAssistantServer {
  protocol: ('http' | 'https'),
  hostname: string,
  port: number,
  token: string
}

export interface KeyValuePair {
  key: string,
  value: string
}

export interface HomeAssistantRequestParams {
  method: ('GET' | 'POST'),
  endpoint: string,
  body: Array<KeyValuePair>
}

export interface HomeAssistantResponse {
  ok: boolean,
  body: string,
}

// ----------------------------------------
// Making requests to Home Assistant servers
// ----------------------------------------

export const homeAssistantRequest = async (
  server: HomeAssistantServer,
  params: HomeAssistantRequestParams
): Promise<HomeAssistantResponse> => {

  // Build the request URL
  const url = `${server.protocol}://${server.hostname}:${server.port}${params.endpoint}`;

  // Build the request body
  var body: string;
  if (!params.body || params.body.length === 0) {
    body = null;
  } else {
    var pairs: Record<string, string> = {};
    params.body.forEach(pair => {
      pairs[pair.key] = pair.value;
    });
    body = JSON.stringify(pairs);
  }

  // Perform the request
  try {

    const response = await axios({
      url: url,
      method: params.method,
      headers: {
        'Authorization': `Bearer ${server.token}`,
        'Content-Type': 'application/json'
      },
      data: body
    });

    // Parse the response body as an object
    const responseBody = await response.data;

    // Return ok!
    return { ok: response.status == 200, body: responseBody };

  } catch (error) {

    // Return error if something fails
    return { ok: false, body: error.message };
  }
}

