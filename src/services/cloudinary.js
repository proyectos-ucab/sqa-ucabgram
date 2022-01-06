export async function uploadImage(image, setImage, setProgress) {
  const url = `https://api.cloudinary.com/v1_1/grupo4sqa-gmail-com/upload`;
  const xhr = new XMLHttpRequest();
  const fd = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener('progress', (e) => {
    setProgress(Math.round((e.loaded * 100.0) / e.total));
  });

  xhr.onreadystatechange = (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);

      setImage(response.secure_url);
    }
  };

  fd.append('upload_preset', 'duoiifbj');
  fd.append('tags', 'browser_upload');
  fd.append('file', image);
  xhr.send(fd);
}
