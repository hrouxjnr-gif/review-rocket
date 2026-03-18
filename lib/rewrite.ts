type RewriteInput = {
  template: string;
  notes: string;
  customerName: string;
  businessName: string;
  reviewLink: string;
};

function normalizeWhitespace(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*;\s*/g, "; ")
    .replace(/\s*\.\s*/g, ". ")
    .trim();
}

function sentenceCase(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ensurePunctuation(text: string) {
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function lowerFirst(text: string) {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function replaceAll(text: string, replacements: Array<[RegExp, string]>) {
  let value = text;
  for (const [pattern, replacement] of replacements) {
    value = value.replace(pattern, replacement);
  }
  return value;
}

function fixCommonTypos(text: string) {
  const replacements: Array<[RegExp, string]> = [
    [/\bcus?tomer\b/gi, "customer"],
    [/\bcustmer\b/gi, "customer"],
    [/\bcstomer\b/gi, "customer"],
    [/\bcustomerr\b/gi, "customer"],
    [/\bclent\b/gi, "client"],
    [/\bfreindly\b/gi, "friendly"],
    [/\bfrendly\b/gi, "friendly"],
    [/\bprofesional\b/gi, "professional"],
    [/\bproffesional\b/gi, "professional"],
    [/\bprofesionally\b/gi, "professionally"],
    [/\bprofesionel\b/gi, "professional"],
    [/\bquik\b/gi, "quick"],
    [/\bquikly\b/gi, "quickly"],
    [/\bpromt\b/gi, "prompt"],
    [/\bpromtly\b/gi, "promptly"],
    [/\bfixd\b/gi, "fixed"],
    [/\bfixt\b/gi, "fixed"],
    [/\breplacd\b/gi, "replaced"],
    [/\brepaird\b/gi, "repaired"],
    [/\binstalld\b/gi, "installed"],
    [/\binstaled\b/gi, "installed"],
    [/\binstal\b/gi, "install"],
    [/\bcheked\b/gi, "checked"],
    [/\bchked\b/gi, "checked"],
    [/\barrivd\b/gi, "arrived"],
    [/\barived\b/gi, "arrived"],
    [/\bcleand\b/gi, "cleaned"],
    [/\bcleannd\b/gi, "cleaned"],
    [/\bexplaind\b/gi, "explained"],
    [/\bexplaind\b/gi, "explained"],
    [/\bcompletd\b/gi, "completed"],
    [/\bcompletd\b/gi, "completed"],
    [/\bservce\b/gi, "service"],
    [/\bserivce\b/gi, "service"],
    [/\bwirng\b/gi, "wiring"],
    [/\bwiringg\b/gi, "wiring"],
    [/\beletric\b/gi, "electric"],
    [/\beletrical\b/gi, "electrical"],
    [/\beletrician\b/gi, "electrician"],
    [/\belectrcian\b/gi, "electrician"],
    [/\bplummber\b/gi, "plumber"],
    [/\bplumer\b/gi, "plumber"],
    [/\bair con\b/gi, "aircon"],
    [/\baircn\b/gi, "aircon"],
    [/\bcondtioning\b/gi, "conditioning"],
    [/\bmaintainence\b/gi, "maintenance"],
    [/\bdran\b/gi, "drain"],
    [/\bblokced\b/gi, "blocked"],
    [/\bblockd\b/gi, "blocked"],
    [/\blea?k\b/gi, "leak"],
    [/\bgutterss\b/gi, "gutters"],
    [/\blandscap\b/gi, "landscape"],
    [/\bpest controll\b/gi, "pest control"],
    [/\btoielt\b/gi, "toilet"],
    [/\bgeyserr\b/gi, "geyser"],
    [/\breccomend\b/gi, "recommend"],
    [/\breccomended\b/gi, "recommended"],
    [/\bsatifised\b/gi, "satisfied"],
    [/\bsatifed\b/gi, "satisfied"],
    [/\bpleasd\b/gi, "pleased"],
    [/\bpleasedd\b/gi, "pleased"],
    [/\bpoltie\b/gi, "polite"],
    [/\bpoltite\b/gi, "polite"],
    [/\bneatn tidy\b/gi, "neat and tidy"],
  ];

  return replaceAll(text, replacements);
}

function expandShortForms(text: string) {
  const replacements: Array<[RegExp, string]> = [
    [/\bcx\b/gi, "customer"],
    [/\bcs\b/gi, "customer"],
    [/\bclt\b/gi, "client"],
    [/\bsvc\b/gi, "service"],
    [/\bappt\b/gi, "appointment"],
    [/\bmsg\b/gi, "message"],
    [/\bhrs\b/gi, "hours"],
    [/\bmins\b/gi, "minutes"],
    [/\bw\/\b/gi, "with "],
    [/\bw\/o\b/gi, "without"],
  ];

  return replaceAll(text, replacements);
}

function cleanGrammar(text: string) {
  return text
    .replace(/\bi\b/g, "I")
    .replace(/\bim\b/gi, "I'm")
    .replace(/\bdidnt\b/gi, "did not")
    .replace(/\bdoesnt\b/gi, "does not")
    .replace(/\bcant\b/gi, "cannot")
    .replace(/\bwont\b/gi, "will not")
    .replace(/\bwasnt\b/gi, "was not")
    .replace(/\barent\b/gi, "are not")
    .replace(/\bwerent\b/gi, "were not")
    .replace(/\btheyre\b/gi, "they are")
    .replace(/\bthier\b/gi, "their")
    .replace(/\bits\b/gi, "it is")
    .replace(/\bive\b/gi, "I have")
    .replace(/\bweve\b/gi, "we have")
    .replace(/\bdont\b/gi, "do not")
    .replace(/\bshouldnt\b/gi, "should not")
    .replace(/\bcouldnt\b/gi, "could not")
    .replace(/\bwouldnt\b/gi, "would not");
}

function improveKeywords(text: string) {
  const replacements: Array<[RegExp, string]> = [
    [/\bhappy\b/gi, "pleased"],
    [/\bvery happy\b/gi, "very pleased"],
    [/\bgreat\b/gi, "excellent"],
    [/\bgood service\b/gi, "great service"],
    [/\bquick\b/gi, "prompt"],
    [/\bquickly\b/gi, "promptly"],
    [/\bfast\b/gi, "efficient"],
    [/\bon time\b/gi, "on time"],
    [/\bcleaned up\b/gi, "left the area clean and tidy"],
    [/\bexplained\b/gi, "explained the work clearly"],
    [/\bcallout\b/gi, "call-out"],
    [/\bafter hours\b/gi, "after-hours"],

    // plumbing
    [/\bfix leak\b/gi, "fixed the leak"],
    [/\bfixed leak\b/gi, "fixed the leak"],
    [/\bleaking pipe\b/gi, "leaking pipe"],
    [/\bburst pipe\b/gi, "burst pipe"],
    [/\bblocked drain\b/gi, "blocked drain"],
    [/\bunblocked drain\b/gi, "unblocked the drain"],
    [/\bgeyser leak\b/gi, "geyser leak"],
    [/\btap leak\b/gi, "tap leak"],
    [/\btoilet leak\b/gi, "toilet leak"],

    // electrical
    [/\bfaulty wiring\b/gi, "faulty wiring"],
    [/\blight fitting\b/gi, "light fitting"],
    [/\bplug point\b/gi, "power outlet"],
    [/\bdb board\b/gi, "distribution board"],
    [/\bpower issue\b/gi, "electrical issue"],

    // hvac
    [/\baircon\b/gi, "air conditioning system"],
    [/\bac unit\b/gi, "air conditioning unit"],
    [/\bhvac\b/gi, "HVAC system"],
    [/\bfilter change\b/gi, "filter replacement"],

    // roofing
    [/\broof leak\b/gi, "roof leak"],

    // landscaping
    [/\bgrass cut\b/gi, "cut the grass"],
    [/\blawn mowed\b/gi, "mowed the lawn"],
    [/\blawn cut\b/gi, "cut the lawn"],
    [/\bhedge trimmed\b/gi, "trimmed the hedge"],

    // pest control
    [/\bpest issue\b/gi, "pest issue"],
    [/\btermite issue\b/gi, "termite issue"],
    [/\bbug problem\b/gi, "pest problem"],
    [/\bfumigation\b/gi, "pest treatment"],

    // general work
    [/\binstalled\b/gi, "installed"],
    [/\breplaced\b/gi, "replaced"],
    [/\bmounted\b/gi, "mounted"],
    [/\bassembled\b/gi, "assembled"],
  ];

  return replaceAll(text, replacements);
}

function polishPart(text: string) {
  let value = text;

  value = normalizeWhitespace(value);
  value = fixCommonTypos(value);
  value = expandShortForms(value);
  value = cleanGrammar(value);
  value = improveKeywords(value);
  value = normalizeWhitespace(value);

  value = sentenceCase(value);
  value = ensurePunctuation(value);

  return value;
}

function splitNotes(notes: string) {
  return normalizeWhitespace(notes)
    .split(/,|;|\.| - /)
    .map((part) => part.trim())
    .filter(Boolean);
}

function dedupeParts(parts: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of parts) {
    const key = part.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(part);
    }
  }

  return result;
}

function buildServiceSummary(notes: string) {
  const parts = dedupeParts(
    splitNotes(notes).map((part) => {
      const cleaned = polishPart(part);
      return cleaned.endsWith(".") ? cleaned.slice(0, -1) : cleaned;
    })
  );

  if (parts.length === 0) {
    return "We completed the requested service";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return `${parts[0]} and ${lowerFirst(parts[1])}`;
  }

  const first = parts.slice(0, -1);
  const last = parts[parts.length - 1];

  return `${first.join(", ")}, and ${lowerFirst(last)}`;
}

function buildFriendlyMessage(input: RewriteInput) {
  const customer = input.customerName || "there";
  const business = input.businessName || "our business";
  const summary = buildServiceSummary(input.notes);

  return `Hi ${customer},

Thanks for choosing ${business}.

${summary}.

If you were happy with the service, we would really appreciate a quick review.

${
  input.reviewLink
    ? `You can leave your review here:
${input.reviewLink}

`
    : ""
}Thank you again for your support!`;
}

function buildProfessionalMessage(input: RewriteInput) {
  const customer = input.customerName || "there";
  const business = input.businessName || "our business";
  const summary = buildServiceSummary(input.notes);

  return `Hello ${customer},

Thank you for choosing ${business}.

${summary}.

If you were satisfied with the service provided, we would sincerely appreciate your feedback in the form of a review.

${
  input.reviewLink
    ? `Please leave your review here:
${input.reviewLink}

`
    : ""
}Thank you for your support.`;
}

function buildShortSmsMessage(input: RewriteInput) {
  const customer = input.customerName || "there";
  const business = input.businessName || "our business";
  const summary = buildServiceSummary(input.notes);

  return `Hi ${customer}, thanks for choosing ${business}. ${summary}. ${
    input.reviewLink
      ? `Please leave us a quick review here: ${input.reviewLink}`
      : "We would really appreciate a quick review."
  }`;
}

function buildFollowUpMessage(input: RewriteInput) {
  const customer = input.customerName || "there";
  const business = input.businessName || "our business";
  const summary = buildServiceSummary(input.notes);

  return `Hi ${customer},

Just following up from ${business}.

We recently completed your service: ${lowerFirst(summary)}.

If you have a moment, we would really appreciate a review.

${
  input.reviewLink
    ? `You can leave your review here:
${input.reviewLink}

`
    : ""
}Thank you again.`;
}

export function rewriteReviewMessage(input: RewriteInput) {
  const normalized: RewriteInput = {
    ...input,
    notes: normalizeWhitespace(input.notes),
  };

  switch (normalized.template) {
    case "professional":
      return buildProfessionalMessage(normalized);
    case "short-sms":
      return buildShortSmsMessage(normalized);
    case "follow-up":
      return buildFollowUpMessage(normalized);
    default:
      return buildFriendlyMessage(normalized);
  }
}