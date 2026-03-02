export default function PlaneSticker({ size = 40 }) {
  return (
    <img
      src="/airplane-sticker.png"
      alt="✈"
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
