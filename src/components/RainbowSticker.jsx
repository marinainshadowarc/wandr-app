export default function RainbowSticker({ size = 80 }) {
  return (
    <img
      src="/rainbow.png"
      alt="rainbow"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
