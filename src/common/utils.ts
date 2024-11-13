export function getVariableName<TResult>(getVar: () => TResult): string | undefined {
  const m = /\(\)=>(.*)/.exec(
    getVar
      .toString()
      .split(/(\r\n|\n|\r|\s)/gm)
      .join(''),
  );

  if (!m) {
    throw new Error("The function does not contain a statement matching 'return variableName;'");
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName?.split('.');

  return memberParts?.pop();
}
