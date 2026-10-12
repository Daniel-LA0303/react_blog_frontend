import { forwardRef } from "react";

export type UIButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
export type UIButtonSize = 'small' | 'medium' | 'large';

export interface UIButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    children: React.ReactNode;
    /** Tema actual, lo decide el padre */
    dark: boolean;
    variant?: UIButtonVariant;
    size?: UIButtonSize;
    fullWidth?: boolean;
    /** Muestra un spinner y bloquea el click */
    loading?: boolean;
    /** Icono opcional a la izquierda / derecha del texto */
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

/**
 * Las clases van completas (no armadas con template strings)
 * para que Tailwind las detecte al compilar.
 *
 * Todas las variantes llevan borde (BASE tiene `border`):
 * las que no lo muestran usan `border-transparent`, así todas
 * miden exactamente lo mismo.
 */
const VARIANTS: Record<UIButtonVariant, { light: string; dark: string }> = {
    // 1 · Principal: negro en claro, blanco en oscuro
    primary: {
        light:
            'bg-neutral-900 text-white border-transparent shadow-sm hover:bg-neutral-700 focus-visible:ring-neutral-400 focus-visible:ring-offset-white',
        dark:
            'bg-white text-neutral-900 border-transparent shadow-sm hover:bg-neutral-200 focus-visible:ring-neutral-500 focus-visible:ring-offset-neutral-950',
    },
    // 2 · Contraste
    secondary: {
        light:
            'bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-neutral-200 focus-visible:ring-neutral-400 focus-visible:ring-offset-white',
        dark:
            'bg-neutral-800 text-neutral-100 border-neutral-600 hover:bg-neutral-700 focus-visible:ring-neutral-500 focus-visible:ring-offset-neutral-950',
    },
    // 3 · Azul (acento)
    accent: {
        light:
            'bg-blue-600 text-white border-transparent shadow-sm shadow-blue-600/30 hover:bg-blue-500 focus-visible:ring-blue-400 focus-visible:ring-offset-white',
        dark:
            'bg-blue-500 text-white border-transparent shadow-sm shadow-blue-500/30 hover:bg-blue-400 focus-visible:ring-blue-400 focus-visible:ring-offset-neutral-950',
    },
    // 4 · Fantasma (fondo transparente)
    ghost: {
        light:
            'bg-transparent text-neutral-900 border-transparent hover:bg-neutral-900/5 focus-visible:ring-neutral-400 focus-visible:ring-offset-white',
        dark:
            'bg-transparent text-neutral-100 border-transparent hover:bg-white/10 focus-visible:ring-neutral-500 focus-visible:ring-offset-neutral-950',
    },
    danger: {
        light:
            'bg-red-600 text-white border-transparent shadow-sm shadow-red-600/30 hover:bg-red-500 focus-visible:ring-red-400 focus-visible:ring-offset-white',
        dark:
            'bg-red-500 text-white border-transparent shadow-sm shadow-red-500/30 hover:bg-red-400 focus-visible:ring-red-400 focus-visible:ring-offset-neutral-950',
    },
};

/**
 * Altura fija + ancho mínimo por tamaño.
 * `leading-none` evita que el line-height cambie la altura.
 */
const SIZES: Record<UIButtonSize, string> = {
    small: 'h-8 min-w-[88px] px-3.5 text-[13px] gap-1.5',
    medium: 'h-10 min-w-[104px] px-5 text-sm gap-2',
    large: 'h-12 min-w-[120px] px-6 text-base gap-2.5',
};

const BASE =
    'inline-flex items-center justify-center rounded-lg border font-medium leading-none whitespace-nowrap select-none ' +
    'transition-all duration-300 active:scale-[0.98] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100';

const Spinner = () => (
    <svg className="h-4 w-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const UIButton = forwardRef<HTMLButtonElement, UIButtonProps>(
    (
        {
            children,
            dark,
            variant = 'primary',
            size = 'medium',
            fullWidth = false,
            loading = false,
            leftIcon,
            rightIcon,
            disabled,
            type = 'button',
            className = '',
            ...rest
        },
        ref,
    ) => {
        const styles = VARIANTS[variant] ?? VARIANTS.primary;
        const theme = dark ? styles.dark : styles.light;
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-busy={loading || undefined}
                className={[BASE, SIZES[size], theme, fullWidth ? 'w-full' : '', className]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            >
                {loading ? <Spinner /> : leftIcon}
                {children}
                {!loading && rightIcon}
            </button>
        );
    },
);

UIButton.displayName = 'UIButton';

export default UIButton;