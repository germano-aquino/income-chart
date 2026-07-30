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
}
