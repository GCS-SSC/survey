# @gcs-ssc/survey

A headless survey provider for Vue 3 applications. The package owns a versioned JSON model, validation, answer state contracts and designer operations. Each host owns all markup, controls, styling, navigation, persistence and authorization.

There are no Nuxt imports, theme dependencies, CSS files, HTML strings, network requests on import, or automatically rendered controls. Like the slot-based approach in [Headless UI v1.7](https://headlessui.com/v1/vue/menu#using-slots), state and behavior are exposed for the consuming application to render.

## Install

Install a pinned Git commit or release tag from `GCS-SSC/survey` using your package manager. For example, after the first release:

```json
{ "dependencies": { "@gcs-ssc/survey": "github:GCS-SSC/survey#v0.1.0" } }
```

The Git repository includes the compiled `dist/` entrypoints so installation needs no build scripts. Vue 3.5+ is a peer dependency for the Vue entrypoint. Core model/validation imports do not load Vue. Node 22.12+ is supported for tooling and server use. The package is distributed through GitHub; it is not published to npm.

## Shared data model

```ts
import { surveySchema, validateAnswers, type SurveyDefinition } from '@gcs-ssc/survey'

const definition: SurveyDefinition = {
  schemaVersion: 1,
  title: { en: 'Project application', fr: 'Demande de projet' },
  questions: [
    {
      id: 'project_name',
      type: 'text',
      required: true,
      maxLength: 200,
      label: { en: 'Project name', fr: 'Nom du projet' }
    }
  ]
}

const parsed = surveySchema.parse(definition)
const errors = validateAnswers(parsed, { project_name: '' })
// { project_name: 'required' }
```

Controls in version 1: `text`, `email`, `number`, `date`, `select`. Every question has a stable ID, bilingual label, Boolean `required`, and optional bilingual `hint`. Text also has `maxLength` (1–5000, default 500). Single choice requires 2–30 options with stable `value` and bilingual `label`.

Question and option identifiers start with a Latin letter, use letters/digits/underscores/hyphens, and are at most 64 characters. IDs are unique within a survey; option values are unique within their question. Reserved object-property names are rejected. Labels/titles are required in both languages (1–200 characters); hints allow up to 500. A saved survey has 1–50 questions and a maximum serialized UTF-8 size of 240 KiB. Unknown properties, unknown controls and schema versions are rejected. All content is plain text; the host must not render labels using `innerHTML` or Vue `v-html`.

`SurveyAnswers` is `Record<questionId, string>`. All answers deliberately retain their entered strings, including numeric values: empty text must never silently become zero. `answersSchema` validates this wire format; `validateAnswers` checks it against a validated definition. Validate both at server boundaries. Number controls accept finite signed decimal notation with a dot; date controls accept real `YYYY-MM-DD` dates, years 0001–9999. No expressions or executable validation rules are supported.

`validateAnswers(definition, answers, 'draft')` permits absent required answers but rejects invalid supplied answers. Default `'submit'` also checks requirements. Error codes are `required`, `email`, `number`, `date`, `choice`, `length`, `unknown`; hosts translate them. Preserving stable question/option IDs is necessary to interpret existing answers. Host persistence should pin immutable definition revisions rather than rewriting forms used by existing applications.

## Renderless Vue component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HeadlessSurvey } from '@gcs-ssc/survey/vue'
import {
  validateAnswers,
  type SurveyDefinition,
  type SurveyAnswers,
  type SurveyError
} from '@gcs-ssc/survey'
const props = defineProps<{ definition: SurveyDefinition }>()
const answers = ref<SurveyAnswers>({})
const errors = ref<Record<string, SurveyError>>({})
</script>

<template>
  <form @submit.prevent="errors = validateAnswers(definition, answers)">
    <HeadlessSurvey v-model="answers" :definition="definition" locale="en" :errors="errors">
      <template #default="{ fields }">
        <MyField
          v-for="field in fields"
          :key="field.id"
          :kind="field.question.type"
          :model-value="field.value"
          :label="field.label"
          :hint="field.hint"
          :required="field.required"
          :disabled="field.disabled"
          :options="field.options"
          :error="field.error"
          @update:model-value="field.setValue($event)"
        />
      </template>
    </HeadlessSurvey>
    <button type="submit">Check responses</button>
  </form>
</template>
```

`MyField` belongs to the host. The component's default slot exposes `fields`, localized `title`, and `validate()`. Each field exposes the original question, stable ID, localized label/hint/options, current value/error, required/disabled states and a `setValue(string)` action. It emits a new answer object; it never mutates a prop. `disabled` suppresses update actions. Locale is `en` or `fr` and defaults to `en`. Errors are controlled by the host. No wrapper element is rendered; attributes are not forwarded automatically.

Hosts supply unique DOM IDs when rendering multiple surveys, accessible label/error associations, required indicators and native semantics, focus handling, and appropriate keyboard controls. The provider does not turn arbitrary host markup into an accessible widget. Reset answers and validation when changing survey identity/revision; changing language should preserve answers. These simple controls do not require custom keyboard behavior beyond their native/theme control.

## Headless designer

```ts
import { useSurveyDesigner } from '@gcs-ssc/survey/vue'
const { definition, add, update, remove, move, replace } = useSurveyDesigner(initialDefinition)
move('project_name', -1) // earlier; +1 moves later
```

The composable copies the initial model, including Vue reactive inputs, so edits do not mutate host props. `add` rejects duplicate IDs and the 50-question limit; `update` keeps the ID and replaces an existing question; both return a success Boolean. `remove(id)`, `move(id, -1 | 1)`, and `replace(definition)` update local state. It deliberately permits incomplete editor state, such as blank titles or no questions. Validate with `surveySchema` before persisting. The host supplies editing controls, confirmations and unsaved-change handling.

## Optional portal import client

Use this only in an extension's server process; do not ship credentials to a browser.

```ts
import { pushSurvey } from '@gcs-ssc/survey/client'
const result = await pushSurvey({
  portalUrl: process.env.PORTAL_URL!,
  token: process.env.PORTAL_API_TOKEN!,
  agencyId: 'agency UUID',
  definition
  // To update, include existing: { id: 'survey UUID', revision: 1 }
})
```

The client validates the definition and posts to the portal's agency-scoped government survey API. Updates use an expected revision; a conflict returns an error with status 409. Redirects are refused to prevent credential forwarding. The client does not retry writes automatically. Save returned IDs and revision numbers, and reconcile against the server after ambiguous failures. Use HTTPS for non-local deployments. Authorization, revision storage and application submission remain responsibilities of the host server, not this package.

## Development

```sh
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run build
```

Commit regenerated `dist/` with source releases because Git consumers use the compiled entrypoints. Tests exercise the JSON contract, all initial control validators, two differently rendered host UIs, immutable/disabled updates, reactive designer operations and import transport. This package does not include a styled designer, a backend, response storage or a dependency on either application.
