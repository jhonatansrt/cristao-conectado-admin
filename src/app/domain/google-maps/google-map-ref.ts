export interface GoogleMapRef {
  getCenter(): { lat: number; lng: number };
  addMarker(coords: { lat: number; lng: number }): void;
}
