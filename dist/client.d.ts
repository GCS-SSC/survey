import { type SurveyDefinition } from './index.js';
/** Call from an extension's server process. Never expose agency bearer credentials to a browser. */
export declare const pushSurvey: (options: {
    portalUrl: string;
    token: string;
    agencyId: string;
    definition: SurveyDefinition;
    existing?: {
        id: string;
        revision: number;
    };
    fetch?: typeof globalThis.fetch;
}) => Promise<{
    survey: {
        id: string;
        agencyId: string;
        revision: number;
        definition: {
            schemaVersion: 1;
            title: {
                en: string;
                fr: string;
            };
            questions: ({
                id: string;
                label: {
                    en: string;
                    fr: string;
                };
                required: boolean;
                type: "text";
                maxLength: number;
                hint?: {
                    en: string;
                    fr: string;
                } | undefined;
            } | {
                id: string;
                label: {
                    en: string;
                    fr: string;
                };
                required: boolean;
                type: "email";
                hint?: {
                    en: string;
                    fr: string;
                } | undefined;
            } | {
                id: string;
                label: {
                    en: string;
                    fr: string;
                };
                required: boolean;
                type: "number";
                hint?: {
                    en: string;
                    fr: string;
                } | undefined;
            } | {
                id: string;
                label: {
                    en: string;
                    fr: string;
                };
                required: boolean;
                type: "date";
                hint?: {
                    en: string;
                    fr: string;
                } | undefined;
            } | {
                id: string;
                label: {
                    en: string;
                    fr: string;
                };
                required: boolean;
                type: "select";
                options: {
                    value: string;
                    label: {
                        en: string;
                        fr: string;
                    };
                }[];
                hint?: {
                    en: string;
                    fr: string;
                } | undefined;
            })[];
        };
        updatedAt: string;
    };
}>;
