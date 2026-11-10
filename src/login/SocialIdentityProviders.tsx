import type { ReactNode } from "react";
import { GenericIdpIcon, GoogleIcon } from "./GoogleIcon";
import type { SocialProvider } from "./socialIdps";

/**
 * "Or continue with Google" block, shared by the login and the registration page so both look
 * identical.
 *
 * Deliberately plain bootstrap classes instead of kcClsx(...): the theme runs with
 * doUseDefaultCss={false}, so Keycloak's PatternFly class names have no stylesheet behind them
 * and would render as unstyled links. Styles live in assets/css/climaqva-brand.css.
 */
export function SocialIdentityProviders(props: { providers: SocialProvider[]; label: ReactNode }) {
    const { providers, label } = props;

    if (providers.length === 0) {
        return null;
    }

    return (
        <div id="kc-social-providers" className="kc-social-providers">
            <p className="kc-social-divider">{label}</p>
            <ul className="kc-social-list">
                {providers.map(provider => (
                    <li key={provider.alias}>
                        <a id={`social-${provider.alias}`} className="kc-social-btn" href={provider.loginUrl}>
                            {/google/i.test(provider.alias) ? <GoogleIcon /> : <GenericIdpIcon />}
                            <span>{provider.displayName}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
