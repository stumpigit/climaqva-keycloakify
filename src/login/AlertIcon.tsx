/**
 * Message icons for the alert box in Template.tsx.
 *
 * Keycloak's own markup uses the PatternFly icon font (`pficon-*`), which is not
 * shipped with this theme - the icons would render as empty boxes. Inline SVG keeps
 * them crisp without pulling in a font.
 */
const paths: Record<string, JSX.Element> = {
    error: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6" />
            <path d="M12 16.5v.5" />
        </>
    ),
    warning: (
        <>
            <path d="M12 3 2.5 20h19L12 3Z" />
            <path d="M12 9v5" />
            <path d="M12 17v.5" />
        </>
    ),
    success: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 5-5.5" />
        </>
    ),
    info: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.5" />
            <path d="M12 7.5v.5" />
        </>
    )
};

export function AlertIcon(props: { type: "error" | "warning" | "success" | "info" }) {
    const { type } = props;

    return (
        <svg
            aria-hidden="true"
            focusable="false"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flex: "0 0 auto" }}
        >
            {paths[type]}
        </svg>
    );
}
