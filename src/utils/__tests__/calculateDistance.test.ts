import { calculateDistance } from "../calculateDistance";

describe("calculateDistance", () => {
  // the example from the assignment description (helsinki venue-slug coordinates and coordinates from example :P)
  it("should calculate the distance between two points", () => {
    const lat1 = 60.17094;
    const lon1 = 24.93087;
    const lat2 = 60.17012143;
    const lon2 = 24.92813512;

    const result = calculateDistance(lat1, lon1, lat2, lon2);
    console.log(result);

    const expectedDistance = 177; // in meters
    expect(Math.round(result)).toBe(expectedDistance);
  });

  // should return zero if both coordinates are exactly the same
  it("should return zero if both points are the same", () => {
    const lat1 = 51.5074;
    const lon1 = -0.1278;
    const lat2 = 51.5074;
    const lon2 = -0.1278;

    const result = calculateDistance(lat1, lon1, lat2, lon2);

    expect(result).toBe(0);
  });
});
