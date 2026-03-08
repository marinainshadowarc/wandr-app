export default function PinSticker({ size = 20 }) {
  return (
    <img
      src="/pin.png"
      alt="pin"
      style={{ width: size, height: size, objectFit: 'contain', verticalAlign: 'middle' }}
    />
  );
}
