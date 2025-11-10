import { Load } from './types';
import { placeholderLoads } from './placeholder-data';

// This is a placeholder for the actual Datatruck API response.
// In a real scenario, this would be a fetch call to the Datatruck API.
async function fetchFromDataTruck(): Promise<Load[]> {
    console.log("Attempting to fetch data from Datatruck...");

    const apiKey = process.env.DATATRUCK_API_KEY;
    const apiEndpoint = process.env.DATATRUCK_API_ENDPOINT;

    if (!apiKey || !apiEndpoint) {
        console.error("Datatruck API Key or Endpoint is not configured in environment variables.");
        // Return an empty array or throw an error if the API is essential
        return [];
    }
    
    try {
        // In a real application, you would make a fetch request like this:
        // const response = await fetch(apiEndpoint, {
        //   headers: {
        //     'Authorization': `Bearer ${apiKey}`
        //   }
        // });
        // if (!response.ok) {
        //   throw new Error(`Datatruck API request failed with status ${response.status}`);
        // }
        // const data = await response.json();
        // return data.loads; // Assuming the API returns { loads: [...] }

        // For now, we'll simulate a successful API call and log it.
        console.log(`Successfully simulated fetch from ${apiEndpoint}`);

        // We can return an empty array for now since we're just testing the plumbing
        return [];

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
    const liveLoads = await getLoads();
    const allLoads = [...placeholderLoads, ...liveLoads];
    return allLoads.find(load => load.id === id);
}
