/**
 * Identity providers that may be used to sign up.
 *
 * Keycloak never renders identity providers on register.ftl - the shipped
 * base/login/register.ftl (checked against Keycloak 26.2.4) has no social block at all, and
 * keycloakify's KcContext type for register.ftl has no `social` field either. So on the
 * registration page we cannot read the provider list from the server the way Login.tsx does:
 * we prefer `social.providers` when Keycloak happens to send it, and otherwise fall back to
 * the list below.
 *
 * The link target is the login URL with `kc_idp_hint=<alias>`: Keycloak's login page picks the
 * hint up and redirects straight to that provider instead of rendering the form, so the user
 * lands on Google's consent screen with one click. An unknown alias is ignored by Keycloak
 * (it just shows the normal login page), so a wrong value degrades gracefully.
 *
 * NOTE: the alias has to match the Identity Provider alias in the realm exactly
 * (id.climaqva.ch -> "GOOGLE").
 */
const SIGNUP_IDENTITY_PROVIDERS: { alias: string; displayName: string }[] = [{ alias: "GOOGLE", displayName: "Google" }];

export type SocialProvider = {
    alias: string;
    displayName: string;
    loginUrl: string;
};

/** `${loginUrl}?kc_idp_hint=<alias>`, keeping any query string the login URL already has. */
export function getIdpHintLoginUrl(loginUrl: string, alias: string): string {
    return `${loginUrl}${loginUrl.includes("?") ? "&" : "?"}kc_idp_hint=${encodeURIComponent(alias)}`;
}

/**
 * Providers to offer on the registration page.
 * `kcContext` is the register.ftl context; `social` is not part of its declared type, hence the
 * structural parameter type instead of a cast to KcContext.
 */
export function getSignupProviders(args: {
    url: { loginUrl?: string };
    social?: { providers?: { alias: string; displayName: string; loginUrl: string }[] };
}): SocialProvider[] {
    const fromKeycloak = args.social?.providers;

    if (fromKeycloak !== undefined && fromKeycloak.length > 0) {
        return fromKeycloak.map(({ alias, displayName, loginUrl }) => ({ alias, displayName, loginUrl }));
    }

    if (args.url.loginUrl === undefined) {
        return [];
    }

    return SIGNUP_IDENTITY_PROVIDERS.map(({ alias, displayName }) => ({
        alias,
        displayName,
        loginUrl: getIdpHintLoginUrl(args.url.loginUrl as string, alias)
    }));
}
