/**
 * Engagement process steps.
 *
 * Shared between the homepage Process summary and the dedicated /process
 * route.
 */

export interface ProcessStep {
  number: string;
  title: string;
  summary: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery and Scope',
    summary:
      'We clarify what the organisation offers, who the website is for and what action it should make easier. This produces an agreed scope before any design work begins.',
  },
  {
    number: '02',
    title: 'Structure and Direction',
    summary:
      'I map the information architecture and page structure, then agree the visual direction. Getting the structure right early is what keeps the rest of the project predictable.',
  },
  {
    number: '03',
    title: 'Design and Development',
    summary:
      'Design and frontend development run together. Pages are built on a shared staging website so you can review real screens rather than static mockups.',
  },
  {
    number: '04',
    title: 'Review and Refinement',
    summary:
      'You review the work in progress and we refine the details: copy, spacing, responsive behaviour and interaction. Decisions stay documented and easy to follow.',
  },
  {
    number: '05',
    title: 'Testing and Launch',
    summary:
      'Before launch I check performance, accessibility, responsive behaviour, links and metadata, then deploy the approved website to production.',
  },
  {
    number: '06',
    title: 'Handover and Support',
    summary:
      'You receive organised code, deployment details and a clear handover. I remain available for a defined support period to resolve anything that surfaces after launch.',
  },
];
