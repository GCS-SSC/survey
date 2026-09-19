import type { SurveyDefinition, SurveyQuestion } from './index.js';
/** Hosts own persistence, dialogs and styling; IDs remain stable across edits and reorder. */
export declare const useSurveyDesigner: (initial: SurveyDefinition) => {
    definition: import("vue").Ref<{
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
    }, {
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
    } | {
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
    }>;
    replace: (value: SurveyDefinition) => void;
    add: (question: SurveyQuestion) => boolean;
    update: (question: SurveyQuestion) => boolean;
    remove: (id: string) => void;
    move: (id: string, direction: -1 | 1) => void;
};
