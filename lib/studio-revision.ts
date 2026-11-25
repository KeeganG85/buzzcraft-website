export type RevisionContext = {
  document: string;
  from: number;
  to: number;
  text: string;
  revision: number;
};

export function createRevisionContext(document: unknown, from: number, to: number, text: string, revision = 0): RevisionContext {
  return { document: JSON.stringify(document), from, to, text, revision };
}

export function sameRevisionContext(left: RevisionContext, right: RevisionContext): boolean {
  return left.document === right.document && left.from === right.from && left.to === right.to && left.text === right.text && left.revision === right.revision;
}
