import { Children, isValidElement, useEffect, useRef, useState } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'


interface UISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    dark: boolean
    children: ReactNode
    icon?: ReactNode
}

const UISelect2 = ({
    dark,
    children,
    icon,
    style,
    onChange,
    value,
    disabled,
    ...rest
}: UISelectProps) => {
    const [open, setOpen] = useState(false)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const options = Children.toArray(children)
        .filter(isValidElement)
        .map((child: any) => ({
            value: child.props.value,
            label: child.props.children,
            disabled: child.props.disabled,
        }))

    const selected = options.find((option) => option.value === value)
    const selectedLabel = selected?.label ?? 'Select an option'

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node

            const clickedWrapper = wrapperRef.current?.contains(target)
            const clickedDropdown = dropdownRef.current?.contains(target)

            if (!clickedWrapper && !clickedDropdown) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const handleSelect = (option: (typeof options)[number]) => {
        if (option.disabled) return

        const event = {
            target: {
                value: option.value,
            },
        } as React.ChangeEvent<HTMLSelectElement>

        onChange?.(event)

        setOpen(false)
    }

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'relative',
                width: '100%',
            }}
        >
            {/* Hidden native select for compatibility/accessibility */}
            <select
                {...rest}
                value={value}
                disabled={disabled}
                onChange={onChange}
                tabIndex={-1}
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: 1,
                    height: 1,
                }}
            >
                {children}
            </select>

            {/* Custom select */}
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'left',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: icon ? '10px 36px 10px 38px' : '10px 36px 10px 14px',
                    borderRadius: open ? '10px 10px 0 0' : 10,

                    border: `1px solid ${dark
                            ? 'rgba(255,255,255,0.14)'
                            : 'rgba(0,0,0,0.14)'
                        }`,

                    background: dark
                        ? '#202124'
                        : '#f8f8f8',

                    color: dark ? '#f5f5f5' : '#222',

                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',

                    boxShadow: open
                        ? dark
                            ? '0 0 0 2px rgba(255,255,255,0.06)'
                            : '0 0 0 2px rgba(0,0,0,0.05)'
                        : '0 1px 2px rgba(0,0,0,0.04)',

                    transition:
                        'border-color 0.15s ease, box-shadow 0.15s ease',

                    ...style,
                }}
            >
                {icon && (
                    <span
                        style={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            color: '#2563EB',
                            pointerEvents: 'none',
                        }}
                    >
                        {icon}
                    </span>
                )}

                <span
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: value
                            ? dark
                                ? '#fff'
                                : '#111'
                            : dark
                                ? 'rgba(255,255,255,0.55)'
                                : '#999',
                    }}
                >
                    {selectedLabel}
                </span>

                <span
                    style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
                        display: 'flex',
                        color: '#2563EB',
                        pointerEvents: 'none',
                        transition: 'transform 0.18s ease',
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                            d="M2.5 4.5L6 8L9.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>

            {open &&
                buttonRef.current &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'fixed',
                            top: buttonRef.current.getBoundingClientRect().bottom,
                            left: buttonRef.current.getBoundingClientRect().left,
                            width: buttonRef.current.getBoundingClientRect().width,

                            zIndex: 9999,

                            overflow: 'hidden',

                            border: `1px solid ${dark
                                    ? 'rgba(255,255,255,0.14)'
                                    : 'rgba(0,0,0,0.14)'
                                }`,

                            borderTop: 'none',

                            borderRadius: '0 0 10px 10px',

                            background: dark
                                ? '#202124'
                                : '#fff',

                            boxShadow: dark
                                ? '0 8px 20px rgba(0,0,0,0.35)'
                                : '0 8px 20px rgba(0,0,0,0.10)',
                        }}
                    >
                        {options.map((option) => {
                            const isSelected = option.value === value

                            return (
                                <div
                                    key={option.value}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        handleSelect(option)
                                    }}
                                    style={{
                                        padding: '10px 14px',
                                        fontSize: 13,
                                        fontWeight: isSelected ? 600 : 500,

                                        color: option.disabled
                                            ? dark
                                                ? 'rgba(255,255,255,0.3)'
                                                : 'rgba(0,0,0,0.35)'
                                            : dark
                                                ? '#f5f5f5'
                                                : '#222',

                                        background: isSelected
                                            ? dark
                                                ? 'rgba(255,255,255,0.08)'
                                                : 'rgba(0,0,0,0.05)'
                                            : 'transparent',

                                        cursor: option.disabled
                                            ? 'not-allowed'
                                            : 'pointer',

                                        opacity: option.disabled ? 0.6 : 1,

                                        transition: 'background 0.12s ease',
                                    }}

                                    onMouseEnter={(e) => {
                                        if (!option.disabled) {
                                            e.currentTarget.style.background = dark
                                                ? 'rgba(255,255,255,0.10)'
                                                : 'rgba(0,0,0,0.06)'
                                        }
                                    }}

                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isSelected
                                            ? dark
                                                ? 'rgba(255,255,255,0.08)'
                                                : 'rgba(0,0,0,0.05)'
                                            : 'transparent'
                                    }}
                                >
                                    {option.label}
                                </div>
                            )
                        })}
                    </div>,
                    document.body
                )}
        </div>
    )
}

export default UISelect2