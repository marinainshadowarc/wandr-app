export default function EarthSticker({ size = 44 }) {
  return (
    <img
      src="/earth_sticker.png"
      alt="🌍"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
    />
  );
}
