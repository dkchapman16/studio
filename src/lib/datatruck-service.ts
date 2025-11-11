import { Load } from './types';

// This is a placeholder for the actual Datatruck API response.
// In a real scenario, this would be a fetch call to the Datatruck API.
async function fetchFromDataTruck(): Promise<Load[]> {
    console.log("Attempting to fetch data from Datatruck...");

    const apiKey = process.env.DATATRUCK_API_KEY;
    const apiEndpoint = process.env.DATATRUCK_API_ENDPOINT;

    if (!apiKey || !apiEndpoint) {
        console.error("Datatruck API Key or Endpoint is not configured in .env file.");
        return [];
    }
    
    try {
        const response = await fetch(apiEndpoint, {
          headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Datatruck API request failed with status ${response.status}: ${errorText}`);
          throw new Error(`Datatruck API request failed with status ${response.status}`);
        }
        const data = await response.json();
        // The API returns the loads nested under a `results` key.
        return data.results || [];

    } catch (error) {
        console.error("Error fetching data from Datatruck:", error);
        return [];
    }
}

export async function getLoads(): Promise<Load[]> {
    const loads = await fetchFromDataTruck();
    return loads;
}

export async function getLoad(id: string): Promise<Load | undefined> {
    const allLoads = await getLoads();
    // The placeholder data uses a simple string `id`, but a real API might use a numeric `dt_id`.
    // We'll check for both to be safe.
    return allLoads.find(load => String(load.id) === id || String(load.dt_id) === id);
}
