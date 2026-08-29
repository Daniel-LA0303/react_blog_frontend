function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const UIAvatar = ({ src, name, bg, size = 32, fontSize = 13 }: { src?: string; name: string; bg: string; size?: number; fontSize?: number }) => (
  <div
    style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bg, color: '#fff', fontSize, fontWeight: 500,
    }}
  >
    {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(name)}
  </div>
)

export default UIAvatar;
