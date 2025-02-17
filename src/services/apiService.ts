export const fetchVenueStaticData = async (venueSlug: string) => {
  const response = await fetch(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`
  );
  if (!response.ok) {
    throw new Error(
      "Failed to fetch static data. Please check the venue slug."
    );
  }
  return response.json();
};

export const fetchVenueDynamicData = async (venueSlug: string) => {
  const response = await fetch(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`
  );
  if (!response.ok) {
    throw new Error(
      "Failed to fetch dynamic data. Please check the venue slug."
    );
  }
  return response.json();
};
