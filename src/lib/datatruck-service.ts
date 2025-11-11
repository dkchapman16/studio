import { randomUUID } from 'node:crypto';

import { placeholderLoads } from './placeholder-data';
import { Load, LoadStatus } from './types';

type DataTruckPaginatedResponse = {
  next?: string | null;
  previous?: string | null;
  results?: DataTruckLoad[];
  data?: DataTruckLoad[];
  loads?: DataTruckLoad[];
  pagination?: {
    next?: string | null;
  };
};

type CoordinatesLike = {
  lat?: number | string | null;
  lng?: number | string | null;
  lon?: number | string | null;
  long?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  geo?: {
    lat?: number | string | null;
    lng?: number | string | null;
    lon?: number | string | null;
    long?: number | string | null;
  } | null;
};

type LocationLike = CoordinatesLike & {
  address?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  province?: string | null;
  postal_code?: string | null;
  zipcode?: string | null;
  zip?: string | null;
  appointment?: string | null;
  appointment_start?: string | null;
  appointment_end?: string | null;
};

type DataTruckLoad = {
  id?: string | number;
  dt_id?: number;
  load_ref?: string | null;
  reference?: string | null;
  ref?: string | null;
  status?: string | null;
  state?: string | null;
  created_at?: string | null;
  created?: string | null;
  pickup_appointment?: string | null;
  delivery_appointment?: string | null;
  pickup?: LocationLike | null;
  pickup_stop?: LocationLike | null;
  origin?: LocationLike | null;
  dropoff?: LocationLike | null;
  dropoff_stop?: LocationLike | null;
  destination?: LocationLike | null;
  driver?: {
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
    mobile?: string | null;
    unit?: string | null;
    truck_unit?: string | null;
    truck_number?: string | null;
    location?: CoordinatesLike | null;
  } | null;
  power_unit?: string | null;
  truck_unit?: string | null;
  equipment_number?: string | null;
  per_mile_revenue?: number | string | null;
  rate_per_mile?: number | string | null;
  total_miles?: number | string | null;
  miles?: number | string | null;
  last_status?: string | null;
  last_status_event?: {
    status?: string | null;
    recorded_at?: string | null;
    reason?: string | null;
    note?: string | null;
    eta?: string | null;
  } | null;
  updated_at?: string | null;
  updated?: string | null;
  eta?: string | null;
  last_eta?: string | null;
  last_reason?: string | null;
  lastStatusAt?: string | null;
  lastStatus?: string | null;
  lastReason?: string | null;
  driver_location?: CoordinatesLike | null;
};

const MAX_PAGES = 10;

function parseNumber(value: number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const parsed = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractCoordinates(source: CoordinatesLike | null | undefined): { lat: number; lng: number } {
  if (!source) {
    return { lat: 0, lng: 0 };
  }

  const latCandidates = [
    source.lat,
    source.latitude,
    source.geo?.lat,
  ];

  const lngCandidates = [
    source.lng,
    source.lon,
    source.long,
    source.longitude,
    source.geo?.lng,
    source.geo?.lon,
    source.geo?.long,
  ];

  return {
    lat: parseNumber(latCandidates.find((candidate) => candidate !== null && candidate !== undefined), 0),
    lng: parseNumber(lngCandidates.find((candidate) => candidate !== null && candidate !== undefined), 0),
  };
}

function buildAddress(location: LocationLike | null | undefined): string {
  if (!location) {
    return '';
  }
  const parts = [location.address, location.address1, location.address2]
    .filter((part) => part && part.trim().length > 0)
    .map((part) => part!.trim());
  return Array.from(new Set(parts)).join(', ');
}

function extractAppointment(location: LocationLike | null | undefined, explicit?: string | null): string {
  const candidate = explicit
    ?? location?.appointment
    ?? location?.appointment_start
    ?? null;
  return candidate ?? '';
}

function safeStatus(status: string | null | undefined): LoadStatus {
  const normalized = status?.toUpperCase();
  if (normalized === 'OK' || normalized === 'WATCH' || normalized === 'AT_RISK') {
    return normalized;
  }
  return 'OK';
}

function mapDataTruckLoad(load: DataTruckLoad): Load {
  const pickup = load.pickup ?? load.pickup_stop ?? load.origin ?? null;
  const delivery = load.dropoff ?? load.dropoff_stop ?? load.destination ?? null;
  const statusEvent = load.last_status_event ?? null;
  const driver = load.driver ?? null;

  const driverName = driver?.name
    ?? [driver?.first_name, driver?.last_name].filter(Boolean).join(' ').trim();

  const loadId = load.id ?? load.dt_id ?? load.load_ref ?? load.reference ?? load.ref ?? randomUUID();

  const computedStatus = safeStatus(
    statusEvent?.status
      ?? load.last_status
      ?? load.state
      ?? load.status
      ?? null,
  );

  return {
    id: String(loadId),
    dt_id: parseNumber(load.dt_id ?? (typeof load.id === 'number' ? load.id : undefined), 0),
    load_ref: load.load_ref ?? load.reference ?? load.ref ?? String(loadId),
    status: (load.status ?? load.state ?? computedStatus ?? 'unknown').toString(),
    created_at: load.created_at ?? load.created ?? new Date().toISOString(),
    pickup_appointment: extractAppointment(pickup, load.pickup_appointment),
    delivery_appointment: extractAppointment(delivery, load.delivery_appointment),
    driver_name: driverName && driverName.length > 0 ? driverName : 'Unknown driver',
    driver_phone: driver?.phone ?? driver?.mobile ?? '',
    truck_unit: driver?.truck_unit
      ?? driver?.unit
      ?? driver?.truck_number
      ?? load.truck_unit
      ?? load.power_unit
      ?? load.equipment_number
      ?? '',
    pickup_address: buildAddress(pickup),
    pickup_city: pickup?.city ?? '',
    pickup_state: pickup?.state ?? pickup?.province ?? '',
    pickup_zip: pickup?.zip ?? pickup?.zipcode ?? pickup?.postal_code ?? '',
    pickup_coords: extractCoordinates(pickup),
    delivery_address: buildAddress(delivery),
    delivery_city: delivery?.city ?? '',
    delivery_state: delivery?.state ?? delivery?.province ?? '',
    delivery_zip: delivery?.zip ?? delivery?.zipcode ?? delivery?.postal_code ?? '',
    delivery_coords: extractCoordinates(delivery),
    per_mile_revenue: parseNumber(load.per_mile_revenue ?? load.rate_per_mile, 0),
    total_miles: parseNumber(load.total_miles ?? load.miles, 0),
    lastStatus: computedStatus,
    lastStatusAt: statusEvent?.recorded_at
      ?? load.lastStatusAt
      ?? load.updated_at
      ?? load.updated
      ?? load.created_at
      ?? new Date().toISOString(),
    lastEtaISO: statusEvent?.eta ?? load.eta ?? load.last_eta ?? undefined,
    lastReason: statusEvent?.reason ?? statusEvent?.note ?? load.last_reason ?? load.lastReason ?? undefined,
    updatedAt: load.updated_at ?? load.updated ?? statusEvent?.recorded_at ?? new Date().toISOString(),
    driver_location: extractDriverLocation(load),
  };
}

function extractDriverLocation(load: DataTruckLoad): { lat: number; lng: number } | undefined {
  const locationSource = load.driver_location ?? load.driver?.location ?? null;
  if (!locationSource) {
    return undefined;
  }
  const coordinates = extractCoordinates(locationSource);
  if (coordinates.lat === 0 && coordinates.lng === 0) {
    return undefined;
  }
  return coordinates;
}

async function fetchFromDataTruck(): Promise<Load[]> {
  console.log('Attempting to fetch data from Datatruck...');

  const apiKey = process.env.DATATRUCK_API_KEY;
  const apiEndpoint = process.env.DATATRUCK_API_ENDPOINT;

  if (!apiKey || !apiEndpoint) {
    console.warn('Datatruck API Key or Endpoint is not configured in environment; using placeholder data.');
    return placeholderLoads;
  }

  try {
    const loads: Load[] = [];
    let nextUrl: string | null = apiEndpoint;
    let page = 0;

    while (nextUrl && page < MAX_PAGES) {
      const baseUrl = nextUrl;
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Datatruck API request failed with status ${response.status}: ${errorText}`);
        throw new Error(`Datatruck API request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as DataTruckPaginatedResponse | DataTruckLoad[];

      const pageLoadsArray = Array.isArray(payload)
        ? payload
        : payload.results
            ?? payload.data
            ?? payload.loads
            ?? [];

      loads.push(...pageLoadsArray.map((load) => mapDataTruckLoad(load)));

      const candidateNext = Array.isArray(payload)
        ? null
        : payload.next ?? payload.pagination?.next ?? null;

      if (!candidateNext) {
        break;
      }

      try {
        const resolved: URL = new URL(candidateNext, baseUrl);
        nextUrl = resolved.toString();
      } catch (error) {
        console.warn('Failed to parse Datatruck pagination URL; stopping pagination.', error);
        break;
      }

      page += 1;
    }

    return loads.length > 0 ? loads : placeholderLoads;
  } catch (error) {
    console.error('Error fetching data from Datatruck:', error);
    return placeholderLoads;
  }
}

export async function getLoads(): Promise<Load[]> {
  return fetchFromDataTruck();
}

export async function getLoad(id: string): Promise<Load | undefined> {
  const allLoads = await getLoads();
  return allLoads.find((load) => String(load.id) === id || String(load.dt_id) === id);
}
