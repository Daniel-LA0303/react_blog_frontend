import { useEffect, useId, useRef, useState } from 'react';

interface UISelectOption {
    value: string;
    label: string;
}

interface UISelectProps {
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    dark: boolean;
    options: UISelectOption[];
    placeholder?: string;
    disabled?: boolean;
}

const THEME = {
    light: {
        label: 'text-neutral-500',
        labelOpen: 'text-neutral-900',
        trigger:
            'border-neutral-900/10 bg-neutral-900/[0.03] hover:border-neutral-900/20 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10',
        triggerOpen: 'border-neutral-400 bg-neutral-900/[0.03] ring-2 ring-neutral-900/10',
        value: 'text-neutral-900',
        placeholder: 'text-neutral-400',
        chevron: 'text-neutral-400',
        panel:
            'border-neutral-200 bg-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)]',
        option: 'text-neutral-700',
        optionActive: 'bg-neutral-100 text-neutral-900',
        empty: 'text-neutral-400',
    },
    dark: {
        label: 'text-neutral-400',
        labelOpen: 'text-neutral-100',
        trigger:
            'border-white/10 bg-white/5 hover:border-white/20 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-white/10',
        triggerOpen: 'border-neutral-500 bg-white/5 ring-2 ring-white/10',
        value: 'text-neutral-100',
        placeholder: 'text-neutral-500',
        chevron: 'text-neutral-500',
        panel:
            'border-neutral-700 bg-neutral-900 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]',
        option: 'text-neutral-300',
        optionActive: 'bg-neutral-800 text-neutral-100',
        empty: 'text-neutral-500',
    },
} as const;

const TRIGGER_BASE =
    'flex h-10 w-full items-center justify-between gap-2 rounded-lg border px-3 text-left text-[13px] ' +
    'transition-all duration-300 focus-visible:outline-none ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const OPTION_BASE =
    'flex cursor-pointer select-none items-center justify-between gap-2 rounded-md px-2.5 py-2 text-[13px] ' +
    'transition-colors duration-150';

const ChevronIcon = ({ open, className }: { open: boolean; className: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''} ${className}`}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CheckIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const UISelect = ({
    label, value, onChange, dark, options, placeholder, disabled,
}: UISelectProps) => {
    const uid = useId();
    const triggerId = `${uid}-trigger`;
    const listId = `${uid}-list`;

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const [open, setOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const [active, setActive] = useState(-1);

    const t = dark ? THEME.dark : THEME.light;
    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

    const openList = () => {
        if (disabled) return;
        // Si no hay espacio abajo y hay más arriba, se abre hacia arriba
        const rect = triggerRef.current?.getBoundingClientRect();
        if (rect) {
            const below = window.innerHeight - rect.bottom;
            setDropUp(below < 260 && rect.top > below);
        }
        setActive(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
    };

    const closeList = (refocus = false) => {
        setOpen(false);
        if (refocus) triggerRef.current?.focus();
    };

    const choose = (index: number) => {
        const opt = options[index];
        if (!opt) return;
        // Los call sites solo leen e.target.value, así que basta con simularlo
        onChange({
            target: { value: opt.value },
            currentTarget: { value: opt.value },
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
        closeList(true);
    };

    // Cierra al hacer clic fuera
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);

    // Si se deshabilita estando abierto, se cierra
    useEffect(() => {
        if (disabled && open) setOpen(false);
    }, [disabled, open]);

    // Mantiene visible la opción activa al navegar con teclado
    useEffect(() => {
        if (!open || active < 0) return;
        listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
    }, [open, active]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!open) openList();
                else setActive((i) => Math.min(i + 1, options.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!open) openList();
                else setActive((i) => Math.max(i - 1, 0));
                break;
            case 'Home':
                if (open) { e.preventDefault(); setActive(0); }
                break;
            case 'End':
                if (open) { e.preventDefault(); setActive(options.length - 1); }
                break;
            case 'Enter':
            case ' ':
                // preventDefault evita que además se dispare el onClick
                e.preventDefault();
                if (open) choose(active);
                else openList();
                break;
            case 'Escape':
                if (open) { e.preventDefault(); closeList(true); }
                break;
            case 'Tab':
                if (open) setOpen(false);
                break;
        }
    };

    return (
        <div ref={rootRef} className="flex flex-col gap-1">
            {label && (
                <label
                    htmlFor={triggerId}
                    className={`text-[13px] transition-colors duration-300 ${open ? t.labelOpen : t.label}`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <button
                    ref={triggerRef}
                    id={triggerId}
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-activedescendant={open && active >= 0 ? `${uid}-opt-${active}` : undefined}
                    disabled={disabled}
                    onClick={() => (open ? closeList() : openList())}
                    onKeyDown={onKeyDown}
                    // En el espacio, el click se dispara al soltar la tecla: lo cancelamos
                    onKeyUp={(e) => { if (e.key === ' ') e.preventDefault(); }}
                    className={`${TRIGGER_BASE} ${open ? t.triggerOpen : t.trigger}`}
                >
                    <span className={`truncate ${selected ? t.value : t.placeholder}`}>
                        {selected ? selected.label : (placeholder ?? '')}
                    </span>
                    <ChevronIcon open={open} className={t.chevron} />
                </button>

                {open && (
                    <ul
                        ref={listRef}
                        id={listId}
                        role="listbox"
                        tabIndex={-1}
                        className={`absolute left-0 z-50 max-h-60 w-full overflow-auto rounded-lg border p-1 ${t.panel} ${
                            dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
                        }`}
                    >
                        {options.length === 0 && (
                            <li className={`px-2.5 py-2 text-[13px] ${t.empty}`}>No options</li>
                        )}

                        {options.map((opt, i) => {
                            const isSelected = i === selectedIndex;
                            const isActive = i === active;
                            return (
                                <li
                                    key={opt.value}
                                    id={`${uid}-opt-${i}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    // mousedown con preventDefault evita que el botón pierda el foco
                                    onMouseDown={(e) => e.preventDefault()}
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => choose(i)}
                                    className={`${OPTION_BASE} ${isActive ? t.optionActive : t.option} ${
                                        isSelected ? 'font-medium' : ''
                                    }`}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && <CheckIcon />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UISelect;