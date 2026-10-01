import { Composition } from "remotion";
import { CtaLoop, CTA_FRAMES } from "./CtaLoop";
import { BannerLines, BANNER_FRAMES } from "./BannerLines";

export const FPS = 30;

export const Root = () => (
  <>
    <Composition id="CtaLoop" component={CtaLoop} durationInFrames={CTA_FRAMES} fps={FPS} width={1280} height={720} />
    <Composition id="BannerLines" component={BannerLines} durationInFrames={BANNER_FRAMES} fps={FPS} width={1920} height={440} />
  </>
);
