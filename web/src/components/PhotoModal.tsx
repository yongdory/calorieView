import { useEffect } from 'react';

interface Props {
  src: string;
  onClose: () => void;
}

export function PhotoModal({ src, onClose }: Props) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        style={{
          position: 'absolute', top: 18, right: 18,
          width: 40, height: 40, borderRadius: 20,
          background: 'rgba(255,255,255,0.12)', color: '#fff',
          border: 'none', cursor: 'pointer',
          fontSize: 22, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)',
          fontFamily: 'inherit',
        }}
      >×</button>
      <img
        src={src}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '100%', maxHeight: '100%',
          objectFit: 'contain', borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
}
