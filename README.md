# @gcs-ssc/survey

A headless survey provider for Vue 3 applications. The package owns a versioned JSON model, validation, answer state contracts and designer operations. Each host owns all markup, controls, styling, navigation controls, persistence and authorization.

There are no Nuxt imports, theme dependencies, CSS files, HTML strings, network requests on import, or automatically rendered controls. Like the slot-based approach in [Headless UI v1.7](https://headlessui.com/v1/vue/menu#using-slots), state and behavior are exposed for the consuming application to render.

## Install

Install a pinned Git commit or release tag from `GCS-SSC/survey` using your package manager. For example:

```json
{ "dependencies": { "@gcs-ssc/survey": "github:GCS-SSC/survey#v0.3.0" } }
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

`SurveyAnswers` is `Record<questionId, string>`. All answers deliberately retain their entered strings, including numeric values: empty text must never silently become zero. `answersSchema` validates this wire format. At a persistence boundary, pass its parsed result to `validateSurveyAnswers(definition, answers)`, reject nonempty `errors`, and persist only the returned `answers`. This removes hidden/skipped values. The errors-only `validateAnswers` is useful for display but is not a sanitizer. Number controls accept finite signed decimal notation with a dot; date controls accept real `YYYY-MM-DD` dates, years 0001–9999. No expressions or executable validation rules are supported.

`validateAnswers(definition, answers, 'draft')` permits absent required answers but rejects invalid supplied answers. Default `'submit'` also checks requirements. Error codes are `required`, `email`, `number`, `date`, `choice`, `length`, `unknown`; hosts translate them. Preserving stable question/option IDs is necessary to interpret existing answers. Host persistence should pin immutable definition revisions rather than rewriting forms used by existing applications.

## Pages, sections, subsections and branching (schema version 2)

`surveySchema` accepts both versions without rewriting saved data. `surveyV1Schema` and the original `questionSchema` retain their original parse contract. New authoring uses `surveyV2Schema` / `questionV2Schema`. Call `upgradeSurvey(v1)` explicitly to produce a deterministic, separate v2 copy with one page. The designer performs this editing upgrade; saved v1 revisions are never mutated. Incomplete translations in legacy hints must be completed before saving an upgraded form.

Version 2 retains the top-level question definitions and adds `pages`. A page has `id`, bilingual `title`, optional bilingual `description`, `questionIds`, `sections`, `branches`, and optional `next`. A section has `id`, `title`, optional `description`/`visibleWhen`, `questionIds`, and `subsections`. Subsections have the same fields except no further nesting. All supplied descriptions require nonblank English and French (maximum 2000 characters each); hints require both languages (500 each). Optional content should be omitted rather than using empty strings.

Canonical rendering order is page questions, then each section's questions and its subsections' questions, in array order. Every question must be placed exactly once. Page, section, subsection and question IDs are unique across the definition. Up to 20 pages, 20 sections per page, 20 subsections per section and 20 branch rules per page are allowed; the overall 50-question / 240 KiB limits still apply. Content-only pages remain in the route.

Conditions are data, never executable expressions:

```ts
const condition = {
  match: 'all', // or 'any'
  conditions: [{ questionId: 'eligible', operator: 'equals', value: 'yes' }]
}
```

`equals` and `notEquals` compare exact strings; single-choice comparisons use stable option values, not translations. `contains` is case-sensitive and restricted to text questions. `greaterThan` / `lessThan` require number questions and finite signed decimal values. `answered` / `notAnswered` have no `value` and treat whitespace-only as unanswered. Other comparisons do not match unanswered values. Each condition contains 1–20 predicates. Predicates referring to hidden/skipped questions never match, including negative predicates.

Questions, sections and subsections may set `visibleWhen`. References must point strictly earlier in the canonical question order; a group's condition cannot reference its descendants. A page's branch rules may use questions on that page or earlier pages. Nested groups also require all ancestor visibility conditions to match.

A page rule is `{ when: condition, destination: { kind: 'page', pageId: 'later_page' } }` or `{ when: condition, destination: { kind: 'end' } }`. The first matching rule wins. If none match, `next` selects the same destination shape; omitting it advances to the next page (or finishes after the last page). Destinations must be forward and exist, so loops are impossible. Back is runtime navigation over the actual route, not an authored backward branch.

`resolveSurvey(definition, answers)` returns resolved pages, their active question IDs, and sanitized answers. `pruneAnswers` returns just those answers. Both use the same evaluator as validation and Vue navigation. Changing an upstream answer atomically prunes answers that become hidden or off-route. Answers on still-reachable pages are retained. Hidden required questions do not block progression or completion.

## Renderless Vue component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HeadlessSurvey } from '@gcs-ssc/survey/vue'
import type { SurveyDefinition, SurveyAnswers } from '@gcs-ssc/survey'
defineProps<{ definition: SurveyDefinition }>()
const answers = ref<SurveyAnswers>({})
</script>
<template>
  <HeadlessSurvey v-model="answers" :definition="definition" locale="en">
    <template #default="{ fields, page, canBack, isLastPage, complete, errors, next, back }">
      <form @submit.prevent="next()">
        <h2>{{ page?.title.en }}</h2>
        <MyErrorSummary :errors="errors" />
        <MyField
          v-for="field in fields"
          :key="field.id"
          :field="field"
          @change="field.setValue($event)"
        />
        <button v-if="canBack" type="button" @click="back()">Back</button>
        <button v-if="!complete" type="submit">{{ isLastPage ? 'Finish' : 'Next' }}</button>
      </form>
    </template>
  </HeadlessSurvey>
</template>
```

`MyField` and `MyErrorSummary` belong to the host. The provider inserts no markup or styles. `fields` contains only the current page's visible questions, in placement order. Hosts can group them using `page.questionIds`, `page.sections` and nested `subsections`. Each field exposes the original question, ID, localized label/hint/options, value/error, required/disabled state and `setValue(string)`.

The slot also exposes localized `title`/`description`, `pageIndex`, `canBack`, `isLastPage`, `complete`, internal `errors`, `next()`, `back()` and `validate()`. `next()` validates the current page before advancing, and the effective route before finishing; it returns false on errors. `back()` follows the current route. `complete` is a validation/navigation state, not a submission or persistence action. Controlled `errors` can supplement field errors. `disabled` suppresses answer and navigation actions. For custom renderless integrations, `useSurveyFlow({definition, answers, onChange})` exposes the same state and actions without a component.

Hosts supply unique DOM IDs, accessible label/error associations, required indicators and native semantics, focus handling after navigation/errors, and appropriate keyboard controls. Attributes are not automatically forwarded. Reset controlled answers when changing survey identity/revision; language changes should preserve answers. External programmatic answer replacement should be passed through `pruneAnswers`; interactive setter actions already prune atomically.

## Headless designer

```ts
import { useSurveyDesigner } from '@gcs-ssc/survey/vue'
const { definition, add, update, remove, move, place, isReferenced, replace } =
  useSurveyDesigner(initialDefinition)
move('project_name', -1) // earlier; +1 moves later
```

The composable copies the initial model, including Vue reactive inputs, so edits do not mutate host props. `add` rejects duplicate IDs and the 50-question limit; `update` keeps the ID and replaces an existing question; both return a success Boolean. `remove(id)` refuses a question referenced by any condition and returns false; `isReferenced(id)` supports preventive UI. `place(id, containerId)` moves a question into a page, section or subsection; `move(id, -1 | 1)` reorders it within that container. `replace(definition)` resets the editing model. New questions start at the end of the first page’s direct questions. Reordering or changing types/options can invalidate conditions, so hosts must review schema errors before saving. It deliberately permits incomplete editor state, such as blank titles or no questions. Validate with `surveySchema` before persisting. The host supplies editing controls, confirmations and unsaved-change handling.

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

Commit regenerated `dist/` with source releases because Git consumers use the compiled entrypoints. Tests exercise version compatibility, bilingual descriptions, structural references, route changes, stale-answer pruning, nested visibility, Back/Next, and the JSON contract, all initial control validators, two differently rendered host UIs, immutable/disabled updates, reactive designer operations and import transport. This package does not include a styled designer, a backend, response storage or a dependency on either application.

Attachment policy is optional on both supported definition versions: `attachments: { enabled: true }`. Omission disables attachments. The headless slot exposes `attachmentsAllowed`; hosts own file controls, authenticated storage, limits and submission linkage. Files are separate from question answers. Upgrading a definition preserves this policy.
