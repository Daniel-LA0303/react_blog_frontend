// components/filters/DateRangeFilter.tsx
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { DateRangeFilterProps } from '../../interfaces/admin.interfaces';
import { DEFAULT_PRESET, formatDateForApi, getRangeFromDays, MONTH_NAMES, PresetKey, PRESETS, WEEKDAYS } from '../../utils/adminUtils';
import { CalendarIcon, ChevronDownIcon, ChevronLeftDateIcon, ChevronRightDateIcon } from '../../utils/iconsUtils';

const startOfDay = (d: Date) => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
};

const isSameDay = (a: Date | null, b: Date | null) =>
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isBetween = (d: Date, start: Date, end: Date) => d.getTime() > start.getTime() && d.getTime() < end.getTime();

const getMonthMatrix = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, i) => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + i);
        return date;
    });
};

const formatShortDate = (d: Date) =>
    `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;

const POPOVER_WIDTH = 300;
const POPOVER_HEIGHT_ESTIMATE = 420;
const VIEWPORT_MARGIN = 12;

interface Placement {
    horizontal: 'left' | 'right'; // 'right' = alineado al borde derecho del trigger (popover crece hacia la izq)
    vertical: 'bottom' | 'top';   // 'top' = el popover se abre hacia arriba del trigger
}

export const DateRangeFilter = ({ onChange, instanceId, defaultDays = 30 }: DateRangeFilterProps) => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [open, setOpen] = useState(false);
    const [preset, setPreset] = useState<PresetKey>(DEFAULT_PRESET);
    const [appliedLabel, setAppliedLabel] = useState<string>('');
    const [placement, setPlacement] = useState<Placement>({ horizontal: 'right', vertical: 'bottom' });

    const [tempStart, setTempStart] = useState<Date | null>(null);
    const [tempEnd, setTempEnd] = useState<Date | null>(null);
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const today = useMemo(() => startOfDay(new Date()), []);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Rango inicial al montar
    useEffect(() => {
        const range = getRangeFromDays(defaultDays);
        onChange(range);
        const presetFound = PRESETS.find((p) => p.days === defaultDays);
        setAppliedLabel(presetFound ? presetFound.label : `Last ${defaultDays} days`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- Cálculo de colisión con el viewport, corre ANTES de pintar el popover abierto ----
    useLayoutEffect(() => {
        if (!open || !triggerRef.current) return;

        const computePlacement = () => {
            const rect = triggerRef.current!.getBoundingClientRect();
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            // Horizontal: si alinear a la derecha (popover creciendo hacia la izquierda desde el borde derecho
            // del trigger) se sale por la izquierda de la pantalla, mejor alinear al borde izquierdo del trigger.
            const spaceOnRightIfRightAligned = rect.right; // distancia desde el borde derecho del trigger hasta x=0
            const fitsRightAligned = spaceOnRightIfRightAligned >= POPOVER_WIDTH + VIEWPORT_MARGIN;
            const spaceOnRightIfLeftAligned = viewportW - rect.left;
            const fitsLeftAligned = spaceOnRightIfLeftAligned >= POPOVER_WIDTH + VIEWPORT_MARGIN;

            let horizontal: Placement['horizontal'] = 'right';
            if (!fitsRightAligned && fitsLeftAligned) horizontal = 'left';
            else if (!fitsRightAligned && !fitsLeftAligned) {
                // no cabe perfecto en ningún lado: usamos el que deje más espacio
                horizontal = spaceOnRightIfRightAligned > spaceOnRightIfLeftAligned ? 'right' : 'left';
            }

            // Vertical: si no hay espacio abajo pero sí arriba, lo mandamos arriba
            const spaceBelow = viewportH - rect.bottom;
            const spaceAbove = rect.top;
            const fitsBelow = spaceBelow >= POPOVER_HEIGHT_ESTIMATE + VIEWPORT_MARGIN;
            const vertical: Placement['vertical'] = !fitsBelow && spaceAbove > spaceBelow ? 'top' : 'bottom';

            setPlacement({ horizontal, vertical });
        };

        computePlacement();
        // Recalcular si cambia el tamaño de ventana o hace scroll mientras está abierto
        window.addEventListener('resize', computePlacement);
        window.addEventListener('scroll', computePlacement, true);
        return () => {
            window.removeEventListener('resize', computePlacement);
            window.removeEventListener('scroll', computePlacement, true);
        };
    }, [open]);

    // Cerrar al hacer click afuera
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [open]);

    const handlePresetClick = (key: PresetKey) => {
        if (key === 'custom') {
            setPreset('custom');
            setTempStart(null);
            setTempEnd(null);
            return;
        }
        const found = PRESETS.find((p) => p.key === key);
        if (!found?.days) return;
        setPreset(key);
        onChange(getRangeFromDays(found.days));
        setAppliedLabel(found.label);
        setOpen(false);
    };

    const handleDayClick = (day: Date) => {
        if (!tempStart || (tempStart && tempEnd)) {
            setTempStart(day);
            setTempEnd(null);
            return;
        }
        if (day.getTime() < tempStart.getTime()) {
            setTempEnd(tempStart);
            setTempStart(day);
        } else {
            setTempEnd(day);
        }
    };

    const handleApplyCustom = () => {
        if (!tempStart || !tempEnd) return;
        onChange({
            startDate: formatDateForApi(tempStart),
            endDate: formatDateForApi(tempEnd),
        });
        setAppliedLabel(`${formatShortDate(tempStart)} – ${formatShortDate(tempEnd)}`);
        setOpen(false);
    };

    const goToPrevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };
    const goToNextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    const matrix = getMonthMatrix(viewYear, viewMonth);
    const rangeEnd = tempEnd ?? hoverDate;

    // Clases de posicionamiento dinámico según la colisión calculada
    const positionClasses = `
    ${placement.horizontal === 'right' ? 'right-0' : 'left-0'}
    ${placement.vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
  `;

    return (
        <div ref={containerRef} className="relative inline-block z-50">
            {/* Trigger */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-2 text-xs font-medium rounded-lg px-3 py-2 border outline-none transition-colors duration-150
                    ${dark
                        ? 'bg-[#1E1E21] border-gray-800 text-gray-300 hover:border-gray-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
            >
                <CalendarIcon size={14} />
                <span className="whitespace-nowrap">{appliedLabel}</span>
                <ChevronDownIcon size={13} />
            </button>

            {/* Popover */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={popoverRef}
                        initial={{ opacity: 0, y: placement.vertical === 'bottom' ? -6 : 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: placement.vertical === 'bottom' ? -6 : 6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 rounded-2xl border shadow-xl p-4 w-[300px] max-w-[calc(100vw-24px)] ${positionClasses}
                            ${dark ? 'bg-[#1E1E21] border-gray-800' : 'bg-white border-gray-200'}`}
                    >
                        {/* Presets */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {PRESETS.map((p) => {
                                const isActive = preset === p.key;
                                return (
                                    <button
                                        key={p.key}
                                        type="button"
                                        onClick={() => handlePresetClick(p.key)}
                                        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors duration-150
                                            ${isActive
                                                ? (dark ? 'bg-white text-black' : 'bg-gray-900 text-white')
                                                : (dark ? 'bg-[#27272A] text-gray-400 hover:text-gray-200' : 'bg-gray-100 text-gray-500 hover:text-gray-800')
                                            }`}
                                    >
                                        {p.key === 'custom' ? 'Custom range' : p.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className={`h-px w-full mb-3 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

                        {/* Calendario */}
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                onClick={goToPrevMonth}
                                className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors duration-150
                                    ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <ChevronLeftDateIcon size={15} />
                            </button>
                            <span className={`text-xs font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                {MONTH_NAMES[viewMonth]} {viewYear}
                            </span>
                            <button
                                type="button"
                                onClick={goToNextMonth}
                                className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors duration-150
                                    ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <ChevronRightDateIcon size={15} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-y-1">
                            {WEEKDAYS.map((wd) => (
                                <span key={wd} className={`text-[10px] font-semibold text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {wd}
                                </span>
                            ))}

                            {matrix.map((day, i) => {
                                const inCurrentMonth = day.getMonth() === viewMonth;
                                const isToday = isSameDay(day, today);
                                const isStart = isSameDay(day, tempStart);
                                const isEnd = isSameDay(day, tempEnd);
                                const isFuture = day.getTime() > today.getTime();

                                const inRange =
                                    tempStart && rangeEnd && !isStart && !isEnd
                                        ? isBetween(day, tempStart < rangeEnd ? tempStart : rangeEnd, tempStart < rangeEnd ? rangeEnd : tempStart)
                                        : false;

                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={isFuture}
                                        onMouseEnter={() => setHoverDate(day)}
                                        onClick={() => handleDayClick(day)}
                                        className={`h-8 text-[11px] rounded-lg transition-colors duration-100 flex items-center justify-center
                                            ${!inCurrentMonth ? (dark ? 'text-gray-700' : 'text-gray-300') : (dark ? 'text-gray-300' : 'text-gray-700')}
                                            ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                            ${(isStart || isEnd) ? (dark ? 'bg-white text-black font-bold' : 'bg-gray-900 text-white font-bold') : ''}
                                            ${inRange ? (dark ? 'bg-gray-700/50' : 'bg-gray-200') : ''}
                                            ${!isStart && !isEnd && !inRange && !isFuture ? (dark ? 'hover:bg-gray-800' : 'hover:bg-gray-100') : ''}
                                            ${isToday && !isStart && !isEnd ? (dark ? 'ring-1 ring-gray-600' : 'ring-1 ring-gray-300') : ''}
                                        `}
                                    >
                                        {day.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer: selección + acciones */}
                        <div className="flex items-center justify-between mt-4">
                            <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {tempStart && tempEnd
                                    ? `${formatShortDate(tempStart)} – ${formatShortDate(tempEnd)}`
                                    : tempStart
                                        ? `${formatShortDate(tempStart)} → select end date`
                                        : 'Select a start date'}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors duration-150
                                        ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApplyCustom}
                                    disabled={!tempStart || !tempEnd}
                                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed
                                        ${dark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};