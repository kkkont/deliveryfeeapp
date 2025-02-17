import { useState } from "react";
import Form from "./Form";
import Results from "./Results";
import { Result } from "../types/types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

function Calculator() {
  const [calculatedResults, setCalculatedResults] = useState<Result | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center mt-20 mb-20">
      <div className="w-1/2 mb-6 p-6 bg-slate-50 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-cyan-400">
            Don’t Worry, I Got You!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Let's crunch those numbers and get your delivery price sorted!
          </p>
        </div>
        <hr className="mb-4"></hr>
        <div className="flex items-center justify-between">
          <Form
            setCalculatedResults={setCalculatedResults}
            setLoading={setLoading}
            setError={setError}
          />
        </div>
        <p className="flex text-gray-400 mt-2 text-xs items-center mt-3">
          <IoIosInformationCircleOutline className="text-xl mr-1 " /> Get
          Location automatically detects your device's location and fills in the
          latitude and longitude fields for you!
        </p>
        <hr className="mb-4 mt-4"></hr>
        {/* If clause for displaying results, loading animation or error */}
        {loading ? (
          <div className="flex justify-center items-center mt-4">
            <div className="loader w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center text-red-500 bg-red-100 p-4 rounded-md">
            <MdErrorOutline className="text-2xl mr-2" />
            <span className="ml-2">{error}</span>
          </div>
        ) : (
          calculatedResults && <Results {...calculatedResults} />
        )}
      </div>
    </div>
  );
}

export default Calculator;
