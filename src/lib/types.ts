export type LoadStatus = 'OK' | 'WATCH' | 'AT_RISK';

export type Load = {
  id: string;
  dt_id: number;
  load_ref: string;
  status: string;
  created_at: string;
  pickup_appointment: string;
  delivery_appointment: string;
  driver_name: string;
  driver_phone: string;
  truck_unit: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip: string;
  pickup_coords: { lat: number; lng: number };
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_zip: string;
  delivery_coords: { lat: number; lng: number };
  per_mile_revenue: number;
  total_miles: number;
  lastStatus: LoadStatus;
  lastStatusAt: string;
  lastEtaISO?: string;
  lastReason?: string;
  updatedAt: string;
  driver_location?: { lat: number; lng: number };
};

export type Ack = {
  ackKey: string;
  loadId: string;
  acknowledgedBy?: 'driver' | 'dispatcher';
  acknowledgedAt?: string;
  createdAt: string;
};

export type GlobalSettings = {
  timezoneDefault: string;
  defaultBufferMin: number;
  quietHoursStart: number;
  quietHoursEnd: number;
  allowNightCalls: boolean;
  dailyGmapsCap: number;
  pollIntervalMinDefault: number;
  customerBuffers: Record<string, number>;
};
