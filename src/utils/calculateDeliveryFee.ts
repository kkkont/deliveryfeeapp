import { calculateDistance } from "./calculateDistance";
import { InputData, Result } from "../types/types";
import {
  fetchVenueDynamicData,
  fetchVenueStaticData,
} from "../services/apiService";

export const calculateDeliveryFee = async (
  inputData: InputData
): Promise<Result> => {
  const { venueSlug, cartValue, userLatitude, userLongitude } = inputData;

  // fetch static and dynamic data of the venue
  const staticData = await fetchVenueStaticData(venueSlug);
  const dynamicData = await fetchVenueDynamicData(venueSlug);

  // venue coordinates from the static data
  const venueCoordinates = staticData.venue_raw.location.coordinates;

  // venue order minimum, base price and distance ranges from the dynamic data
  const orderMinimumNoSurcharge =
    dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
  const basePrice =
    dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
  const distanceRanges =
    dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;

  // calculate distance between user and venue
  const deliveryDistance = calculateDistance(
    parseFloat(userLatitude),
    parseFloat(userLongitude),
    venueCoordinates[1],
    venueCoordinates[0]
  );

  const cartValueNumber = parseFloat(cartValue);

  // calculates small order surcharge based on the order minimum no surcharge and cart value
  const smallOrderSurcharge = Math.max(
    0,
    orderMinimumNoSurcharge - cartValueNumber
  );

  // set delivery fee as base price
  let deliveryFee = basePrice;

  let isDeliveryPossible = false;

  // check if the delivery distance is within the distance ranges
  for (const range of distanceRanges) {
    if (
      (deliveryDistance >= range.min && deliveryDistance < range.max) ||
      (range.max === 0 && deliveryDistance <= range.min)
    ) {
      isDeliveryPossible = true;
      // calculate delivery fee with the formula  ----- > base_price + a + b * distance / 10
      deliveryFee += range.a + Math.round((range.b * deliveryDistance) / 10);
      break;
    }
  }

  // if the distance is not within the ranges error message will be returned
  if (!isDeliveryPossible) {
    throw new Error(
      "Delivery is not possible for the given distance. Please check the venue and location."
    );
  }

  // calculate total price
  const totalPrice = cartValueNumber + smallOrderSurcharge + deliveryFee;

  // returns Result type object
  return {
    cartValue: cartValueNumber,
    smallOrderSurcharge,
    deliveryFee,
    deliveryDistance,
    totalPrice,
  };
};

export default calculateDeliveryFee;
