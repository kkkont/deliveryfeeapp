import { useForm, SubmitHandler } from "react-hook-form";
import { IoLocationOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { InputData } from "../types/types";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee";
import { Result } from "../types/types";

interface FormProps {
  setCalculatedResults: React.Dispatch<React.SetStateAction<Result | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

function Form({ setCalculatedResults, setLoading, setError }: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = async (data) => {
    // Transform cartValue to cents
    const cartValueInCents = Math.round(parseFloat(data.cartValue) * 100);

    const transformedData = {
      ...data,
      cartValue: cartValueInCents.toString(), // update the data with the transformed value
    };

    try {
      setLoading(true);
      setError(null);
      // Call the API to calculate the delivery fee
      const results = await calculateDeliveryFee(transformedData);

      // set the calculated results and sent them to calculator component
      setCalculatedResults(results);
    } catch (error: any) {
      // catches error and sets the error message necessary for the calculator component
      console.error("Error calculating delivery fee:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // find exact coordinates of the device using navigator geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setCalculatedResults(null); //as new coordinates are being found, previous results are cleared
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue("userLatitude", latitude.toString());
          setValue("userLongitude", longitude.toString());
          setLoading(false);
        },
        (error) => {
          alert("Error fetching location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="w-3/5">
          <div className="flex flex-col items-start ">
            <label
              htmlFor="venueSlug"
              className="block text-slate-500 font-medium mb-1 text-[0.9em]"
            >
              Enter Venue Slug
            </label>
            <input
              type="text"
              data-test-id="venueSlug"
              {...register("venueSlug", { required: "Venue slug is required" })}
              placeholder="Venue Slug"
              className="w-2/3 w-h-9 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.venueSlug && (
              <span className="flex items-center justify-center text-red-500 bg-red-200 text-sm  mt-2 w-2/3 h-9  border-2 border-red-300 rounded-md">
                {errors.venueSlug.message as string}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start mt-6">
            <label
              htmlFor="cartValue"
              className="block text-slate-500 font-medium mb-1 text-[0.9em]"
            >
              Enter Cart Value
            </label>
            <input
              type="text"
              data-test-id="cartValue"
              {...register("cartValue", {
                required: "Cart value is required",
                validate: (value) =>
                  (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) ||
                  "Please enter a valid number",
              })}
              placeholder="Cart Value"
              className="w-2/3 h-9 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cartValue && (
              <span className="flex items-center justify-center text-red-500 bg-red-200 text-sm  mt-2 w-2/3 h-9  border-2 border-red-300 rounded-md">
                {errors.cartValue.message as string}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start mt-6">
            <label
              htmlFor="userLatitude"
              className="block text-slate-500 font-medium mb-1 text-[0.9em]"
            >
              Enter User Latitude
            </label>
            <input
              type="text"
              data-test-id="userLatitude"
              {...register("userLatitude", {
                required: "User latitude is required",
                validate: (value) =>
                  !isNaN(parseFloat(value)) || "Please enter a valid number",
              })}
              placeholder="User Latitude"
              className="w-2/3 h-9 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.userLatitude && (
              <span className="flex items-center justify-center text-red-500 bg-red-200 text-sm  mt-2 w-2/3 h-9  border-2 border-red-300 rounded-md">
                {errors.userLatitude.message as string}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start mt-6">
            <label
              htmlFor="userLongitude"
              className="block text-slate-500 font-medium mb-1 text-[0.9em]"
            >
              Enter User Longitude
            </label>
            <input
              type="text"
              data-test-id="userLongitude"
              {...register("userLongitude", {
                required: "User longitude is required",
                validate: (value) =>
                  !isNaN(parseFloat(value)) || "Please enter a valid number",
              })}
              placeholder="User Longitude"
              className="w-2/3 h-9 p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.userLongitude && (
              <span className="flex items-center justify-center text-red-500 bg-red-200 text-sm  mt-2 w-2/3 h-9  border-2 border-red-300 rounded-md">
                {errors.userLongitude.message as string}
              </span>
            )}
          </div>
        </div>
        <div className="w-2/5">
          <img src="image.png" alt="Wolt logo" className="w-full h-auto" />
        </div>
      </div>
      <div className="mt-8 flex items-center flex-wrap gap-3">
        <button
          type="button"
          onClick={getLocation}
          className=" px-4 py-2 text-[0.9em] bg-cyan-400 text-white font-medium rounded-md hover:bg-cyan-500 flex items-center"
        >
          <IoLocationOutline className="text-xl mr-2" />
          Get Location
        </button>
        <button
          type="submit"
          className=" px-4 py-2 text-[0.9em] bg-cyan-400 text-white font-medium rounded-md hover:bg-cyan-500 flex items-center"
        >
          <TbTruckDelivery className="text-xl mr-2" />
          Calculate Delivery Price
        </button>
      </div>
    </form>
  );
}

export default Form;
