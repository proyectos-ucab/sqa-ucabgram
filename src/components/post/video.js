import PropTypes from "prop-types";

export function Video({ src, caption }) {
  return <video className="w-full" src={src} alt={caption} controls />;
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
