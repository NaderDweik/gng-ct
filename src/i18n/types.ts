/** Props every page under `app/[locale]/` receives; extend `P` for extra dynamic segments. */
export type LocalePageProps<P extends Record<string, string> = Record<never, never>> = {
  params: Promise<{ locale: string } & P>;
};
