import PropTypes from 'prop-types';

export function Image({ src, caption }) {
  return <img className="w-full" src={src} alt={caption} />;
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
