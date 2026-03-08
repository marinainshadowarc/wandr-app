export default function SunSticker({ size = 64 }) {
  return (
    <img
      src="/sun.png"
      alt="sun"
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
