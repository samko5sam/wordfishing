export const sanitizeTitle = (myStr: string) => {
  return myStr!.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}