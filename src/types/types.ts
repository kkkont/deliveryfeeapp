export interface InputData {
  venueSlug: string;
  cartValue: string;
  userLatitude: string;
  userLongitude: string;
}

export interface Result {
  cartValue: number;
  smallOrderSurcharge: number;
  deliveryFee: number;
  deliveryDistance: number;
  totalPrice: number;
}
