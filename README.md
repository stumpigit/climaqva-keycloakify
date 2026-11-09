# climaqva-keycloakify

Keycloak login theme for **[ClimaQva](https://github.com/stumpigit/ClimaQva)** — flood discharge
estimation for small catchments in Switzerland. The theme is served at
[id.climaqva.ch](https://id.climaqva.ch) under the Keycloak theme name **`climaqva-theme`**.

It is a [Keycloakify](https://keycloakify.dev) v11 theme: React + the "Aspire" bootstrap template,
re-skinned with the ClimaQva brand.

## Brand / design

The look follows the ClimaQva web app (see `src/frontend/src/scss/` in the ClimaQva repo,
commit `0c74ada` "feat: redesign"):

| Token           | Light                                                 | Dark                               |
| --------------- | ----------------------------------------------------- | ---------------------------------- |
| Primary         | `#344074` (brand navy)                                | `#7387d3`                          |
| Secondary       | `#598d96` (brand teal)                                | `#74adb5`                          |
| Body background | `#f4f6fa`                                             | `#0e1220` + brand radial gradients |
| Body text       | `#3d4359`                                             | `#c3cad9`                          |
| Card            | 1px border `#e3e7ef`, `border-radius-lg`, soft shadow | border only, no shadow             |

-   `src/login/assets/css/climaqva-brand.css` is the only place brand colours are set. It is
    imported **after** `assets/css/app.min.css` in `src/login/KcPage.tsx` and overrides the
    `--ct-*` variables (and the handful of hardcoded declarations) that the prebuilt template CSS
    still carries from the old AUGUR blue `#1478f0`.
-   Keycloak also ships its own **PatternFly** stylesheet, and several pages (`login-username`,
    `login-password`, `login-reset-password`, `login-update-password`, `login-otp`,
    `login-config-totp`, `select-authenticator`, `terms`, `logout-confirm`) render keycloakify's
    default markup, whose submit buttons carry `pf-c-button pf-m-primary` instead of bootstrap's
    `.btn-primary`. Those buttons, the language dropdown, the authenticator tiles and the plain
    links were still PatternFly blue `#06c`. The bottom of `climaqva-brand.css` therefore re-skins
    the PatternFly *global* tokens (`--pf-global--primary-color--*`, `--pf-global--link--Color`,
    `--pf-global--active-color--100`, surfaces) per `data-bs-theme` rather than patching each rule.
    Keycloakify injects the theme bundle at runtime, so it always cascades after PatternFly.
-   The login pages render in **dark mode**, like the app: `index.html` sets
    `data-bs-theme="dark"` on `<html>` (Keycloakify copies this into the generated `.ftl` files) and
    `src/login/KcPage.tsx` re-asserts it before React paints.
-   Logos: `src/login/assets/images/climaqva-logo.svg` (`.logo-dark`, used in light mode) and
    `climaqva-logo-inverse.svg` (`.logo-light`, used in dark mode) — same mapping as the app's
    sidenav. Favicon and `apple-touch-icon.png` live in `public/`.
-   The subtitle under the logo is an i18n message (`loginSubtitle`, see `src/login/i18n.ts`),
    provided in `de` / `en` / `fr`; other locales fall back to English.

## Requirements

Node 18/20+ and [Maven](https://maven.apache.org/) (>= 3.1.1, Java >= 7) — `mvn` must be on `$PATH`.

-   On macOS: `brew install maven`
-   On Debian/Ubuntu: `sudo apt-get install maven`
-   On Windows: `choco install openjdk` and `choco install maven`

## Build

```bash
npm install
npm run build-keycloak-theme
```

The jars land in `dist_keycloak/` (one per Keycloak version range). ClimaQva runs Keycloak 26.2.4,
so use `keycloak-theme-for-kc-all-other-versions.jar`.

## Deploy

`ClimaQva/docker-compose.keycloak.yml` mounts this repo — as `climaqva-keycloakify` — straight
into the Keycloak providers directory:

```yaml
volumes:
    - ./climaqva-keycloakify:/opt/keycloak/providers/
```

So the checkout has to sit next to the ClimaQva checkout under the directory name
`climaqva-keycloakify`, and the jar has to be copied into it:

```bash
cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar ../ClimaQva/climaqva-keycloakify/
```

After deploying the jar, set the theme for the realm (admin console → Realm settings → Themes →
**Login Theme** = `climaqva-theme`). The local development realm export
`.keycloakify/realm-kc-26.json` already carries `"loginTheme": "climaqva-theme"`. Then clear the
Keycloak cache / restart, because themes are cached.

## Asset budget

The Aspire template drags in a lot that a login page never needs. Measured with headless
Chromium over all login pages (transfer = what actually hits the wire, gzip where it helps):

| | before | now |
| --- | ---: | ---: |
| first page load | ~1.23 MB | **~0.36 MB** |
| theme CSS bundle | 785 KB / 114 KB gz | 436 KB / **57 KB** gz |
| icon font | 800 KB (`tabler-icons.woff2`) | none |
| jar | 7.45 MB | **2.81 MB** |
| external requests | 1 (Google Fonts) | **0** |

What changed:

-   `assets/css/icons.min.css` (376 KB CSS, ~8 MB of font files) is **not imported** anymore. The
    only glyph any login page used was `ti-eye` on the password reveal button, which is an inline
    SVG in `src/login/pages/Login.tsx` now.
-   `Atkinson Hyperlegible Next` is self-hosted from `src/login/assets/fonts/` (4 woff2 subsets,
    108 KB, SIL Open Font License 1.1 — see the `@font-face` block at the top of
    `climaqva-brand.css`). The `@import` from `fonts.googleapis.com` was removed from
    `app.min.css`: it cost a blocking cross-origin round-trip on every login and disclosed the
    visitor's IP to Google.
-   `Template.tsx` renders a single `<img>` for the current mode instead of two — a hidden
    `<img>` still downloads its `src`.

Still in the jar but never fetched: `body-bg-light.jpg` / `body-bg-dark.jpg` (570 KB, referenced
by `app.min.css` but overridden by `climaqva-brand.css`), the Keycloak-bundled PatternFly CSS
(1.4 MB raw / 133 KB gz) and the OpenSans fonts of the legacy PatternFly. Keycloak gzips theme
resources itself (resource-encoding SPI; `image/png`/`image/jpeg` are excluded by default) and
theme caching is on in production mode.

## Testing the theme locally

```bash
npm install
npm run dev        # vite dev server, mock kcContext via src/login/KcPageStory.tsx
npm run storybook  # all pages, isolated
```

To point a local Keycloak at the dev server, see
[docs.keycloakify.dev/testing-your-theme](https://docs.keycloakify.dev/testing-your-theme).

## Customizing

See [docs.keycloakify.dev/customization-strategies](https://docs.keycloakify.dev/customization-strategies).
The page-specific overrides live in `src/login/pages/`, the shared layout in `src/login/Template.tsx`.

## GitHub Actions

`.github/workflows/ci.yaml` builds the theme on every push/PR to `main` and, when the
`package.json` version was bumped, publishes the jars as a GitHub release artifact.
To enable the workflow go to `Settings` > `Actions` > `Workflow permissions` and select
**Read and write permissions**.

## Note on leftover template assets

`src/login/assets/js/` and `src/login/assets/vendor/` are inherited from the Aspire template and
are mostly unused by the login pages (they account for most of the ~7.5 MB jar size). Some of them
still mention the predecessor project. Nothing there is loaded by the theme; they can be pruned in
a separate cleanup pass.
