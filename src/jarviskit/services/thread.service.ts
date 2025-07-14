interface UserMessagePayload {
  namespace: string;
  agentName: string;
  threadId: string;
  message: string;
  config: any;

  // For Demo
  userId: string;
}

interface SendToolResponsePayload {
  namespace: string;
  agentName: string;
  toolCallId: string;
  response: object;
}

export class ThreadService {
  private headers: Record<string, string>;

  constructor(private readonly authToken: string) {
    this.headers = {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
    };
  }

  private getUrl(path: string, params: Record<string, string> = {}) {
    const url = new URL(path, import.meta.env.VITE_JARVIS_KIT_RUNTIME);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    return url.toString();
  }

  async getThreads(namespace: string, agentName: string) {
    const apiEndpoint = this.getUrl(`/threads`, { namespace, agentName });
    const response = await fetch(apiEndpoint, { headers: this.headers });
    return response.json();
  }

  async getThread(id: string) {
    const apiEndpoint = this.getUrl(`/threads/${id}`);
    const response = await fetch(apiEndpoint, { headers: this.headers });
    return response.json();
  }

  async getThreadMessages(id: string) {
    const apiEndpoint = this.getUrl(`/threads/${id}/messages`);
    const response = await fetch(apiEndpoint, { headers: this.headers });
    return response.json();
  }

  async getCachedEvents(id: string, sessionId: string) {
    const apiEndpoint = this.getUrl(`/threads/${id}/sessions/${sessionId}/events`);
    const response = await fetch(apiEndpoint, { headers: this.headers });
    return response.json();
  }

  async sendMessage(payload: UserMessagePayload) {
    const apiEndpoint = this.getUrl(`/threads/${payload.threadId}/messages`);
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        namespace: payload.namespace,
        agentName: payload.agentName,
        content: payload.message,
        userId: payload.userId, // Runtime need to parse userId from token
        config: payload.config,
      }),
    });
    return response.json();
  }

  async sendToolResponse(payload: SendToolResponsePayload) {
    const apiEndpoint = this.getUrl(`/threads/send-tool-response`);
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        namespace: payload.namespace,
        agentName: payload.agentName,
        toolCallId: payload.toolCallId,
        response: payload.response, // The response of the tool
      }),
    });

    return response.json();
  }
}

export const getThreadService = (authToken: string | undefined) => {
  if (!authToken) {
    throw new Error('Auth token is required');
  }

  return new ThreadService(authToken);
}