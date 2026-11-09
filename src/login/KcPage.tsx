import "./assets/css/app.min.css";
// icons.min.css (tabler + remixicon, 376 KB CSS + ~8 MB font files) is deliberately NOT
// imported: the only glyph the login pages ever used was the password reveal icon, now an
// inline SVG in pages/Login.tsx.
import "./assets/css/climaqva-brand.css";

import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
const Login = lazy(() => import("./pages/Login"));
const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));

const doMakeUserConfirmPassword = true;

// The ClimaQva app boots in dark mode (src/frontend/app.html sets
// data-bs-theme="dark"), so the login pages do the same. Done at module scope
// - before React paints - to avoid a light mode flash.
if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
}

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {
    kcInputClass: "form-control",
    kcFormCardClass: "card overflow-hidden text-center p-xxl-4 p-3 mb-0"
} satisfies { [key in ClassKey]?: string };
