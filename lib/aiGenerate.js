/* ============================================================================
   AI background generation via Pollinations.ai — a free, keyless image API.
   It's a plain GET request that returns the image bytes directly, so it
   works entirely client-side with no backend, which fits this static-export
   site. No API key, no server route needed.
   Docs: https://github.com/pollinations/pollinations (APIDOCS.md)
   ========================================================================== */

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

// Card preview / gallery size — kept at a 4:3 ratio to match the card grid.
export const AI_PREVIEW_SIZE = { width: 1024, height: 768 };

// Turns the wizard's 4 quick-pick answers into one precise, well-formed
// prompt aimed at abstract, text-free, seamless background art — this is
// the "دقيق" (precise) prompt sent to the model, editable by the user
// before it's sent.
export function composePrompt(answers) {
  const { purpose = "", vibe = "", mood = "", motion = "" } = answers;

  const vibeDesc = {
    "Calm & minimal": "minimalist, soft, calm, generous negative space",
    "Bold & energetic": "bold, high-energy, dynamic forms, striking contrast",
    "Professional & clean": "clean, modern, corporate-friendly, understated",
    "Playful & fun": "playful, whimsical, fun, lighthearted",
  }[vibe] || "abstract, tasteful";

  const moodDesc = {
    "Cool tones": "cool color palette of blues, teals, and violets",
    "Warm tones": "warm color palette of oranges, corals, and golds",
    "Vibrant multicolor": "vibrant, saturated, multicolor palette",
    "Dark & moody": "dark, moody, deep tones with subtle accent highlights",
  }[mood] || "harmonious color palette";

  const motionDesc = motion === "Subtly animated"
    ? "a sense of gentle motion, flow, and movement"
    : "a calm, static composition";

  const purposeDesc = purpose
    ? `intended for use as a ${purpose.toLowerCase()} background`
    : "intended as a versatile background image";

  return (
    `Abstract digital background artwork, ${vibeDesc}, ${moodDesc}, with ${motionDesc}, ` +
    `${purposeDesc}. Smooth procedural digital art, seamless composition, high detail, ` +
    `no text, no watermark, no logos, no people, no faces, no words.`
  );
}

export function pollinationsUrl(prompt, { width = 1024, height = 768, seed = 1, model = "flux" } = {}) {
  const encoded = encodeURIComponent(prompt.trim());
  return `${POLLINATIONS_BASE}/${encoded}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=true`;
}

// Preloads the image and resolves only on real success, so the UI can wait
// for a genuine result (or a real error) instead of flashing a broken image.
export function preloadImage(url, { timeoutMs = 45000 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // No crossOrigin here on purpose: we only need this image to *display*
    // (via a CSS background-image), which never needs CORS headers.
    // Forcing crossOrigin="anonymous" would make the browser reject a
    // perfectly valid image if Pollinations doesn't echo CORS headers on
    // that particular response, even though the image loads fine normally.
    const timer = setTimeout(() => {
      img.onload = null; img.onerror = null;
      reject(new Error("Generation is taking too long — try again."));
    }, timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(); };
    img.onerror = () => { clearTimeout(timer); reject(new Error("Couldn't generate that image — try a different prompt.")); };
    img.src = url;
  });
}

export async function makeAICard(prompt, seedOverride) {
  const seed = seedOverride ?? Math.floor(Math.random() * 1e9);
  const url = pollinationsUrl(prompt, { ...AI_PREVIEW_SIZE, seed });
  await preloadImage(url);
  return {
    id: `ai-image-${Math.random().toString(36).slice(2, 9)}`,
    type: "ai-image",
    prompt,
    seed,
    url,
  };
}
