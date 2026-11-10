/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations<"loginSubtitle" | "signupWithLabel">({
        en: { loginSubtitle: "Sign in to ClimaQva", signupWithLabel: "Or sign up with" },
        de: { loginSubtitle: "Anmeldung bei ClimaQva", signupWithLabel: "Oder registrieren mit" },
        fr: { loginSubtitle: "Connexion à ClimaQva", signupWithLabel: "Ou inscrivez-vous avec" }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
