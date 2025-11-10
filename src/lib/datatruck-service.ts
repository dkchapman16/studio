import { Load } from './types';
import { placeholderLoads } from './placeholder-data';

// This is a placeholder for the actual Datatruck API response.
// In a real scenario, this would be a fetch call to the Datatruck API.
async function fetchFromDataTruck(): Promise<Load[]> {
    console.log("Attempting to fetch data from Datatruck...");

    const apiKey = process.env.DATATRUCK_API_KEY;
    const apiEndpoint = process.env.DATATRUCK_API_ENDPOINT;

    if (!apiKey || !apiEndpoint) {
        console.error("Datatruck API Key or Endpoint is not configured in .env file.");
        // In a real scenario you might throw an error, but for demonstration we'll use placeholders.
        return [];
    }
    
    try {
        // In a real application, you would make a fetch request like this:
        const response = await fetch(apiEndpoint, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        if (!response.ok) {
          throw new Error(`Datatruck API request failed with status ${response.status}`);
        }
        const data = await response.json();
        // The API might return the loads directly or nested under a key.
        // Adjust `data.loads` if the structure is different.
        return data.loads || data;

    } catch (error) {
        console.error("Error fetching data from Datatruck:", error);
        // Fallback to placeholders if the API call fails
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
    return allLoads.find(load => load.id === id || String(load.dt_id) === id);
}
