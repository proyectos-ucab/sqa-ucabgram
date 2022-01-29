import React from "react";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../contants/routes";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      <div
        className="mx-auto flex justify-center flex-col"
        style={{ maxWidth: "50%" }}
      >
        <p className="text-center text-2xl">Not Found!</p>
        <button
          className={`bg-blue-medium text-white  rounded h-8 font-bold px-4 mx-auto mt-12`}
          onClick={() => {
            navigate(ROUTES.DASHBOARD);
          }}
        >
          Regresar
        </button>
      </div>
    </div>
  );
}
