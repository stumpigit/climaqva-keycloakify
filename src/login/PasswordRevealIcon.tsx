/**
 * Eye / eye-off glyph for the password reveal button.
 *
 * Inline SVG on purpose: the tabler icon font is ~800 KB (gzip does not help) and this
 * is the only glyph the login pages ever need. Keycloak's own markup solves it with an
 * `<i class="kc-pw-visible-*">` whose glyph comes from the PatternFly icon font, which
 * is not shipped here - that would render an empty button.
 */
export function PasswordRevealIcon(props: { isPasswordRevealed: boolean }) {
    const { isPasswordRevealed } = props;

    return (
        <svg
            aria-hidden="true"
            focusable="false"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5C7 5 3.6 7.4 2 12c1.6 4.6 5 7 10 7s8.4-2.4 10-7c-1.6-4.6-5-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
            {isPasswordRevealed ? <path d="M4 4l16 16" /> : null}
        </svg>
    );
}
