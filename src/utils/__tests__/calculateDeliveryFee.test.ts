import { calculateDeliveryFee } from "../calculateDeliveryFee";
import {
  fetchVenueDynamicData,
  fetchVenueStaticData,
} from "../../services/apiService";
import { calculateDistance } from "../calculateDistance";

jest.mock("../../services/apiService");
jest.mock("../calculateDistance");

const mockedFetchVenueStaticData = fetchVenueStaticData as jest.MockedFunction<
  typeof fetchVenueStaticData
>;

const mockedFetchVenueDynamicData =
  fetchVenueDynamicData as jest.MockedFunction<typeof fetchVenueDynamicData>;

const mockedCalculateDistance = calculateDistance as jest.MockedFunction<
  typeof calculateDistance
>;

describe("calculateDeliveryFee", () => {
  const mockStaticData = {
    venue_raw: {
      location: {
        coordinates: [0.0, 0.0], // it is not necessary to put exact coordinates as we have mocked the data anyway.
      },
    },
  };

  const mockDynamicData = {
    venue_raw: {
      delivery_specs: {
        order_minimum_no_surcharge: 1000,
        delivery_pricing: {
          base_price: 190,
          distance_ranges: [
            { min: 0, max: 500, a: 0, b: 0, flag: null },
            { min: 500, max: 1000, a: 100, b: 1, flag: null },
            { min: 1000, max: 0, a: 0, b: 0, flag: null },
          ],
        },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // the same example we had in the assignment description with valid input :)
  it("should calculate delivery fee for a valid input", async () => {
    mockedFetchVenueStaticData.mockResolvedValue(mockStaticData);
    mockedFetchVenueDynamicData.mockResolvedValue(mockDynamicData);
    mockedCalculateDistance.mockReturnValue(177); // distance in meters

    const inputData = {
      venueSlug: "home-assignment-venue-helsinki",
      cartValue: "1000",
      userLatitude: "0.0", // as calculateDistance is mocked , we don't need to put exact coordinates
      userLongitude: "0.0",
    };

    const result = await calculateDeliveryFee(inputData);

    expect(result).toEqual({
      cartValue: 1000,
      smallOrderSurcharge: 0,
      deliveryFee: 190,
      deliveryDistance: 177,
      totalPrice: 1190,
    });

    expect(mockedFetchVenueStaticData).toHaveBeenCalledWith(
      "home-assignment-venue-helsinki"
    );
    expect(mockedFetchVenueDynamicData).toHaveBeenCalledWith(
      "home-assignment-venue-helsinki"
    );
    expect(mockedCalculateDistance).toHaveBeenCalledWith(0.0, 0.0, 0.0, 0.0);
  });

  // no smallOrderSurcharge if the cart value exceeds the order minimum
  it("should return zero smallOrderSurcharge if cartValue exceeds order minimum", async () => {
    mockedFetchVenueStaticData.mockResolvedValue(mockStaticData);
    mockedFetchVenueDynamicData.mockResolvedValue(mockDynamicData);
    mockedCalculateDistance.mockReturnValue(400);

    const inputData = {
      venueSlug: "home-assignment-venue-tallinn",
      cartValue: "1500", // order minimum was set to 1000 in the mock data
      userLatitude: "0.0",
      userLongitude: "0.0",
    };

    const result = await calculateDeliveryFee(inputData);

    expect(result).toEqual({
      cartValue: 1500,
      smallOrderSurcharge: 0, // No surcharge as cart value >= order_minimum_no_surcharge
      deliveryFee: 190,
      deliveryDistance: 400,
      totalPrice: 1690,
    });
  });

  // throw an error if the delivery is not possible due to distance ranges
  it("should throw an error if delivery is not possible due to distance", async () => {
    mockedFetchVenueStaticData.mockResolvedValue(mockStaticData);
    mockedFetchVenueDynamicData.mockResolvedValue(mockDynamicData);
    mockedCalculateDistance.mockReturnValue(1200); // Beyond the maximum allowed distance

    const inputData = {
      venueSlug: "home-assignment-venue-helsinki",
      cartValue: "800",
      userLatitude: "0.0",
      userLongitude: "0.0",
    };

    // expects this error message
    await expect(calculateDeliveryFee(inputData)).rejects.toThrow(
      "Delivery is not possible for the given distance. Please check the venue and location."
    );
  });

  // throw an error if API call should fail
  it("should throw an error if API call fails", async () => {
    // mock error
    mockedFetchVenueStaticData.mockRejectedValue(
      new Error("Failed to fetch static data")
    );
    mockedFetchVenueDynamicData.mockResolvedValue(mockDynamicData);

    const inputData = {
      venueSlug: "home-assignment-venue-helsinki",
      cartValue: "800",
      userLatitude: "0.0",
      userLongitude: "0.0",
    };

    await expect(calculateDeliveryFee(inputData)).rejects.toThrow(
      "Failed to fetch static data"
    );
  });
});
