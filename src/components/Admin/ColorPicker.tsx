import { useEffect, useRef, useState } from 'react';

interface HSV { h: number; s: number; v: number }

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const normalizeHex = (input: string): string | null => {
    let h = input.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map((c) => c + c).join('');
    return /^[0-9a-fA-F]{6}$/.test(h) ? `#${h.toUpperCase()}` : null;
};

const hsvToHex = ({ h, s, v }: HSV): string => {
    const f = (n: number) => {
        const k = (n + h / 60) % 6;
        const val = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
        return Math.round(val * 255).toString(16).padStart(2, '0');
    };
    return `#${f(5)}${f(3)}${f(1)}`.toUpperCase();
};

const hexToHsv = (hex: string, fallbackHue = 0): HSV => {
    const n = normalizeHex(hex) ?? '#000000';
    const r = parseInt(n.slice(1, 3), 16) / 255;
    const g = parseInt(n.slice(3, 5), 16) / 255;
    const b = parseInt(n.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = fallbackHue;
    if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    return { h, s: max === 0 ? 0 : d / max, v: max };
};

const readableOn = (hex: string): string => {
    const n = normalizeHex(hex) ?? '#000000';
    const lin = (i: number) => {
        const c = parseInt(n.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const L = 0.2126 * lin(1) + 0.7152 * lin(3) + 0.0722 * lin(5);
    return L > 0.179 ? '#111111' : '#FFFFFF';
};

const useDrag = (onMove: (x: number, y: number) => void) => {
    const active = useRef(false);

    const update = (e: React.PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        onMove(
            clamp((e.clientX - r.left) / r.width, 0, 1),
            clamp((e.clientY - r.top) / r.height, 0, 1),
        );
    };
    const end = (e: React.PointerEvent<HTMLDivElement>) => {
        active.current = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    return {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
            active.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            update(e);
        },
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
            if (active.current) update(e);
        },
        onPointerUp: end,
        onPointerCancel: end,
    };
};

const THEME = {
    light: {
        swatchRing: 'ring-black/10 focus-visible:ring-neutral-900',
        surfaceRing: 'ring-black/10 focus-visible:ring-neutral-900',
        input:
            'border-neutral-900/10 bg-neutral-900/[0.03] text-neutral-900 focus-within:border-neutral-400 focus-within:ring-neutral-900/10',
        hash: 'text-neutral-400',
    },
    dark: {
        swatchRing: 'ring-white/15 focus-visible:ring-white',
        surfaceRing: 'ring-white/15 focus-visible:ring-white',
        input:
            'border-white/10 bg-white/5 text-neutral-100 focus-within:border-neutral-500 focus-within:ring-white/10',
        hash: 'text-neutral-500',
    },
} as const;

const THUMB =
    'pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ' +
    'shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.4)]';

const HUE_GRADIENT =
    'linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)';


const DEFAULT_PRESETS = [
    '#2563EB', '#7C3AED', '#DB2777', '#DC2626', '#EA580C',
    '#CA8A04', '#16A34A', '#0D9488', '#0891B2', '#525252',
];

const CheckIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);


interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
    dark: boolean;
    presets?: string[];
}

const ColorPicker = ({ value, onChange, dark, presets = DEFAULT_PRESETS }: ColorPickerProps) => {
    const t = dark ? THEME.dark : THEME.light;

    const [hsv, setHsv] = useState<HSV>(() => hexToHsv(value));
    const currentHex = hsvToHex(hsv);
    const [hexText, setHexText] = useState(() => currentHex.slice(1));


    useEffect(() => {
        const v = normalizeHex(value);
        if (!v) return;
        setHsv((prev) => (hsvToHex(prev) === v ? prev : hexToHsv(v, prev.h)));
    }, [value]);

    useEffect(() => {
        setHexText(currentHex.slice(1));
    }, [currentHex]);

    const apply = (next: HSV) => {
        setHsv(next);
        const hex = hsvToHex(next);
        if (hex !== currentHex) onChange(hex);
    };

    const areaDrag = useDrag((x, y) => apply({ ...hsv, s: x, v: 1 - y }));
    const hueDrag = useDrag((x) => apply({ ...hsv, h: x * 360 }));

    const hueHex = hsvToHex({ h: hsv.h, s: 1, v: 1 });

    const onAreaKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const step = e.shiftKey ? 0.1 : 0.01;
        let { s, v } = hsv;
        switch (e.key) {
            case 'ArrowLeft': s -= step; break;
            case 'ArrowRight': s += step; break;
            case 'ArrowUp': v += step; break;
            case 'ArrowDown': v -= step; break;
            default: return;
        }
        e.preventDefault();
        apply({ ...hsv, s: clamp(s, 0, 1), v: clamp(v, 0, 1) });
    };

    const onHueKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const step = e.shiftKey ? 10 : 1;
        let h = hsv.h;
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowDown': h -= step; break;
            case 'ArrowRight':
            case 'ArrowUp': h += step; break;
            default: return;
        }
        e.preventDefault();
        apply({ ...hsv, h: clamp(h, 0, 360) });
    };

    const commitHexText = () => {
        const n = normalizeHex(hexText);
        if (n) apply(hexToHsv(n, hsv.h));
        setHexText((n ?? currentHex).slice(1));
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Atajos rápidos */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Preset colors">
                {presets.map((p) => {
                    const hex = normalizeHex(p) ?? p;
                    const selected = hex === currentHex;
                    return (
                        <button
                            key={hex}
                            type="button"
                            title={hex}
                            aria-label={`Use ${hex}`}
                            aria-pressed={selected}
                            onClick={() => apply(hexToHsv(hex, hsv.h))}
                            className={`flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset transition-transform duration-300 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${t.swatchRing}`}
                            style={{ backgroundColor: hex, color: readableOn(hex) }}
                        >
                            {selected && <CheckIcon />}
                        </button>
                    );
                })}
            </div>

            <div
                role="slider"
                tabIndex={0}
                aria-label="Saturation and brightness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(hsv.s * 100)}
                aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
                className={`relative h-36 w-full cursor-crosshair touch-none select-none rounded-lg ring-1 ring-inset focus-visible:outline-none focus-visible:ring-2 ${t.surfaceRing}`}
                style={{
                    backgroundColor: hueHex,
                    backgroundImage:
                        'linear-gradient(to top, #000000, rgba(0,0,0,0)), linear-gradient(to right, #FFFFFF, rgba(255,255,255,0))',
                }}
                onKeyDown={onAreaKey}
                {...areaDrag}
            >
                <span
                    className={THUMB}
                    style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: currentHex }}
                />
            </div>

            <div
                role="slider"
                tabIndex={0}
                aria-label="Hue"
                aria-valuemin={0}
                aria-valuemax={360}
                aria-valuenow={Math.round(hsv.h)}
                className={`relative h-4 w-full cursor-pointer touch-none select-none rounded-full focus-visible:outline-none focus-visible:ring-2 ${t.surfaceRing}`}
                onKeyDown={onHueKey}
                {...hueDrag}
            >
                <div
                    className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full"
                    style={{ backgroundImage: HUE_GRADIENT }}
                />
                <span
                    className={`${THUMB} top-1/2`}
                    style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueHex }}
                />
            </div>

            <div className="flex items-center gap-3">
                <span
                    aria-hidden="true"
                    className={`h-9 w-9 shrink-0 rounded-lg ring-1 ring-inset ${dark ? 'ring-white/15' : 'ring-black/10'}`}
                    style={{ backgroundColor: currentHex }}
                />
                <label
                    className={`flex h-9 flex-1 items-center gap-1 rounded-lg border px-3 text-[13px] transition-all duration-300 focus-within:ring-2 ${t.input}`}
                >
                    <span className={`select-none ${t.hash}`}>#</span>
                    <input
                        value={hexText}
                        maxLength={6}
                        spellCheck={false}
                        autoComplete="off"
                        aria-label="Hex color"
                        placeholder="2563EB"
                        className="w-full bg-transparent font-mono uppercase outline-none placeholder:text-neutral-500/50"
                        onChange={(e) => {
                            const text = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase();
                            setHexText(text);
                            const n = text.length === 6 ? normalizeHex(text) : null;
                            if (n) apply(hexToHsv(n, hsv.h));
                        }}
                        onBlur={commitHexText}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                commitHexText();
                            }
                        }}
                    />
                </label>
            </div>
        </div>
    );
};

export default ColorPicker;