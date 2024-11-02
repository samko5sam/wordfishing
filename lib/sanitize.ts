export const sanitizeTitle = (myStr: string) => {
  return myStr!.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

export const removeHtmlTags = (input: string): string => {
  if (!input) return input;
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}