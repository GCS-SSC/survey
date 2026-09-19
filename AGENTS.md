# Survey provider

This repository contains only the reusable headless survey provider. Keep portal and GCS–SSC application code, credentials, UI themes, persistence and authorization out of this package.

- Core model/validation imports must not load Vue. Vue behavior belongs to the optional `/vue` entrypoint; portal transport belongs to `/client`.
- Preserve the versioned JSON contract. Introduce new schema versions deliberately and reject unsupported definitions.
- Keep rendering unstyled and host-controlled. Do not add Nuxt auto-imports, CSS, or styled controls.
- Run `bun run test`, `bun run typecheck`, and `bun run build` before a release.
- Include regenerated `dist/` with source changes; Git consumers install these entrypoints without lifecycle scripts.
- Never include secrets, application data, or private host code in this public repository.
