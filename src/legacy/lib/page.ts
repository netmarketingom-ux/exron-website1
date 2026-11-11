import yaml from 'js-yaml';

/** Page content lives in the YAML front matter of each file in content/pages/. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadPage = (raw: string): any => yaml.load(raw.split(/^---\s*$/m)[1]);
