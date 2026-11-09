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
