import React from "react";
import { Result } from "../types/types";

const Results: React.FC<Result> = ({
  cartValue,
  smallOrderSurcharge,
  deliveryFee,
  deliveryDistance,
  totalPrice,
}) => {
  return (
    <div className="flex flex-col items-start">
      <div
        className="block text-slate-500 font-medium mb-1 text-[1em]"
        data-test-id="cartValue"
        data-raw-value={cartValue}
      >
        <strong>Cart Value: </strong>
        {(cartValue / 100).toFixed(2)} EUR
      </div>

      <div
        className="block text-slate-500 font-medium mb-1 text-[1em]"
        data-test-id="smallOrderSurcharge"
        data-raw-value={smallOrderSurcharge}
      >
        <strong>Small Order Surcharge: </strong>
        {(smallOrderSurcharge / 100).toFixed(2)} EUR
      </div>

      <div
        className="block text-slate-500 font-medium mb-1 text-[1em]"
        data-test-id="deliveryFee"
        data-raw-value={deliveryFee}
      >
        <strong>Delivery Fee: </strong>
        {(deliveryFee / 100).toFixed(2)} EUR
      </div>

      <div
        className="block text-slate-500 font-medium mb-1 text-[1em]"
        data-test-id="deliveryDistance"
        data-raw-value={deliveryDistance}
      >
        <strong>Delivery Distance: </strong>
        {deliveryDistance.toFixed(0)} m
      </div>

      <div
        className="block text-slate-500 font-medium mb-1 text-[1em]"
        data-test-id="totalPrice"
        data-raw-value={totalPrice}
      >
        <strong>Total Price: </strong>
        {(totalPrice / 100).toFixed(2)} EUR
      </div>
    </div>
  );
};

export default Results;
