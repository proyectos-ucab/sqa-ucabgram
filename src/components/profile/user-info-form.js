import React, { useState, useEffect } from "react";
import { updateUser } from "../../services";

export function UserInfoForm({ user, onFormSubmitted }) {
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");

  const isInvalid = description === "" || fullName === "";

  useEffect(() => {
    if (user != null) {
      setFullName(user.fullName);
      setDescription(user.description);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUser(user.profileUserId, {
      fullName,
      description,
    });
    onFormSubmitted();
  };

  return (
    <div className="w-full h-full">
      <div className="border-b border-gray-primary px-5 py-3 text-center relative">
        <h2 className="font-bold">Modificar Informacion de perfil</h2>
      </div>
      <div className="p-5 py-0 h-full w-full mt-8">
        <form onSubmit={handleSubmit} method="POST">
          <input
            aria-label="Ingresa tu nombre completo"
            type="text"
            placeholder="Nombre"
            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setFullName(target.value)}
            value={fullName}
          />
          <input
            aria-label="Ingresa un descripcion de ti"
            type="text"
            placeholder="Descripcion"
            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setDescription(target.value)}
            value={description}
          />
          <button
            disabled={isInvalid}
            type="submit"
            className={`bg-blue-medium text-white w-full rounded h-8 font-bold
          ${isInvalid && "opacity-50"}`}
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
