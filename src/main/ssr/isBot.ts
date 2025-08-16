export function isBot(userAgent: string | undefined): boolean {
  return userAgent !== undefined && /(bot|crawler|spider|crawling)/i.test(userAgent);
}
