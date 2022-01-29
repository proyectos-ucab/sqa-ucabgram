import React, { useRef, useState, useEffect, useContext } from "react";
import { createUserPost, uploadImage } from "../services";
import { ModalContext } from "../context";

export function Uploader({ user }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState("");
  const { handleModal } = useContext(ModalContext);

  const isInvalid = caption === "";
  const hiddenFileInput = useRef(null);

  // Effect for detecting when images has been uploaded and update ui to add comments
  useEffect(() => {
    const handleImageUpload = async () => {
      if (selectedImage != null) {
        await uploadImage(selectedImage, setUploadedImage, setProgress);
      }
    };

    if (uploadedImage == null) {
      handleImageUpload();
    }
  }, [selectedImage, uploadedImage]);

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded.type.includes("mp4")) {
      setMediaType("video");
    } else {
      setMediaType("image");
    }

    if (fileUploaded != null) {
      setSelectedImage(fileUploaded);
    }
  };

  const handleFileBrowserButtonClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleBackButtonClick = () => {
    setUploadedImage(null);
    setSelectedImage(null);
    setCaption("");
    setProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createUserPost(
      user.userId,
      uploadedImage,
      caption,
      mediaType
    );
    if (result != null) {
      handleModal();
      location.reload();
    }
  };

  return (
    <div className="w-full h-full">
      <div className="border-b border-gray-primary px-5 py-3 text-center relative">
        <h2 className="font-bold">Crea una nueva publicacion</h2>
        {uploadedImage != null && (
          <button
            onClick={handleBackButtonClick}
            className="absolute right-0 top-1/2 px-5"
            style={{ transform: `translateY(-50%)` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="p-5 py-0 h-full w-full">
        {uploadedImage == null ? (
          <div className="flex flex-col h-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <button
              disabled={progress !== 0}
              className={`w-full bg-blue-medium text-white px-4 rounded h-8 font-bold ${
                progress !== 0 && "opacity-50"
              }`}
              onClick={handleFileBrowserButtonClick}
            >
              {progress !== 0
                ? `${progress} %`
                : "Seleccionar de la computadora"}
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg video/mp4"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
            ></input>
          </div>
        ) : (
          <div className="h-full flex flex-col py-5 items-center ">
            <div style={{ maxWidth: "80%", maxHeight: "50%" }}>
              {mediaType === "video" && (
                <video
                  src={uploadedImage}
                  controls
                  className="w-full h-full"
                ></video>
              )}
              {mediaType === "image" && (
                <img src={uploadedImage} className="w-full h-full"></img>
              )}
            </div>

            <form className="w-full h-full mt-5" onSubmit={handleSubmit}>
              <textarea
                aria-label="Introduce una descripcion"
                type="text"
                placeholder="Añade una descripción"
                className="text-sm text-gray-base w-full p-2 h-2/6 border border-gray-primary rounded mb-2 resize-none"
                onChange={({ target }) => setCaption(target.value)}
                value={caption}
                maxLength={100}
              />
              <button
                disabled={isInvalid}
                type="submit"
                className={`bg-blue-medium text-white w-full rounded h-8 font-bold
          ${isInvalid && "opacity-50"}`}
              >
                Publicar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
