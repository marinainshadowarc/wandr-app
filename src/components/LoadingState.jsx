import EarthSticker from './EarthSticker';

export default function LoadingState({ message = 'Loading…' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      gap: 12,
    }}>
      <EarthSticker size={44} />
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 16,
        color: 'var(--text-muted)',
      }}>
        {message}
      </p>
    </div>
  );
}
