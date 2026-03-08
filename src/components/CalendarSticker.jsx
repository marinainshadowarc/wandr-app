export default function CalendarSticker({ size = 20 }) {
  return (
    <img
      src="/calander.png"
      alt="calendar"
      style={{ width: size, height: size, objectFit: 'contain', verticalAlign: 'middle' }}
    />
  );
}
