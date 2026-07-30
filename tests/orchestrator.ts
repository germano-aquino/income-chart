import retry from "async-retry";

export default class Orchestrator {
  private webServerStatusPageUrl = "http://localhost:3000/api/v1/status";

  async waitForAllServices() {
    await waitForService(this.webServerStatusPageUrl);

    async function waitForService(serviceUrl: string) {
      return retry(fetchStatusService, {
        retries: 100,
        maxTimeout: 1000,
      });

      async function fetchStatusService() {
        const response = await fetch(serviceUrl);

        if (response.status != 200) {
          throw new Error();
        }
      }
    }
  }

  isUUIDv4Regex(uuid: string): boolean {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }
}
