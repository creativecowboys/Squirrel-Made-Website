// Recipes published from the Squirrel Made monthly newsletters.
//
// SOURCE OF TRUTH — every ingredient, quantity and step below comes from the recipe
// PDF Jeremy sent with the newsletter, plus the corrections he emailed afterwards.
// Nothing here is invented. See `notes` on each recipe for exactly what changed and why.
//
// Rules for anyone editing this file:
//   - Quantities and ingredients are the client's. Don't "improve" them.
//   - Cooking temperatures and times that the source left vague have been replaced with
//     USDA FSIS minimums (165°F poultry, 145°F + 3 min rest for beef, boil used marinade).
//     Those are marked `safety: true` so they render as a safety note, not as the client's words.
//   - Where the source contradicted itself on a duration, the duration is OMITTED rather
//     than guessed. Don't fill the gap with a number.
//   - These are chicken and steak recipes. They are NOT Mediterranean-diet recipes and must
//     not be labelled as such. The Mediterranean / clean-eating material lives on /clean-eating.

export interface RecipeIngredientGroup {
  /** Sub-heading, e.g. "Chipotle Lime Marinade". Null for a single flat list. */
  heading: string | null;
  items: string[];
}

export interface RecipeStep {
  text: string;
  /** True when this step is a food-safety clarification we added, not the client's wording. */
  safety?: boolean;
}

export interface RecipeStepGroup {
  heading: string | null;
  steps: RecipeStep[];
}

/** A Squirrel Made product used in the recipe. Handles verified against the live Shopify catalog. */
export interface RecipeProduct {
  handle: string;
  /** How the recipe refers to it, which is not always the catalog title. */
  as: string;
}

export interface Recipe {
  slug: string;
  title: string;
  /** One-line summary, from the source PDF. */
  summary: string;
  /** Longer intro written for the website. Kept factual — no health or diet claims. */
  intro: string;
  course: string;
  servings: string;
  /** ISO-8601 durations for schema.org. Omit anything the source contradicted itself on. */
  times: {
    prep?: { label: string; iso: string };
    cook?: { label: string; iso: string };
    marinate?: { label: string; iso: string };
    total?: { label: string; iso: string };
  };
  ingredients: RecipeIngredientGroup[];
  instructions: RecipeStepGroup[];
  /** Safety points called out above the method. */
  safetyNotes: string[];
  products: RecipeProduct[];
  /** Which newsletter it came from — shown on the page as provenance. */
  fromNewsletter: string;
  /** Editorial record. Not rendered on the site; here so the next person knows what moved. */
  notes: string[];
}

export const RECIPES: Recipe[] = [
  {
    slug: 'steak-and-chicken-fajitas',
    title: 'Steak and Chicken Fajitas',
    summary:
      'Steak and chicken marinated in Squirrel Made Chipotle Lime White Balsamic Vinegar, Squirrelly Four Chile spice blend, and Worcestershire sauce. Grilled and served with peppers and onions.',
    intro:
      'One marinade, split two ways, does the work here — the chipotle lime balsamic brings the acid, the Hatch green chili olive oil carries it, and the four chile blend does the rest. Fire up the grill, cook the chicken first, and everything lands in the same skillet with the peppers and onions at the end.',
    course: 'Dinner, Main Course',
    servings: '4 servings',
    times: {
      prep: { label: '15 min', iso: 'PT15M' },
      marinate: { label: '30 min, refrigerated', iso: 'PT30M' },
      cook: { label: '35 min', iso: 'PT35M' },
      total: { label: '1 hr 20 min', iso: 'PT1H20M' },
    },
    ingredients: [
      {
        heading: 'Chipotle Lime Marinade',
        items: [
          '1/2 cup Squirrel Made Chipotle Lime White Balsamic',
          '2 tbsp Squirrel Made Hatch Green Chili olive oil',
          '3 tbsp Squirrelly Four Chile Spice Blend',
          '3 tsp Worcestershire sauce',
        ],
      },
      { heading: 'Chicken', items: ['2 pounds chicken breasts (about two breasts)'] },
      { heading: 'Steak', items: ['1–2 pounds skirt, ribeye, flank or sirloin (your favorite fajita beef)'] },
      {
        heading: 'Peppers and Onions',
        items: ['1–2 poblano or bell peppers', '1 large yellow or white onion'],
      },
      {
        heading: 'For the Skillet',
        items: ['1 tbsp Squirrel Made Hatch Green Chili olive oil', '1–3 tsp Squirrelly Four Chile Spice Blend'],
      },
    ],
    instructions: [
      {
        heading: 'Marinade',
        steps: [
          { text: 'In a medium bowl, stir together the chipotle lime marinade ingredients.' },
          {
            text:
              'Split the marinade into two containers now, before it touches any raw meat — half for the chicken, half for the steak.',
            safety: true,
          },
        ],
      },
      {
        heading: 'Chicken',
        steps: [
          {
            text:
              'Place the chicken in a bag or covered container, cover with its half of the marinade, and refrigerate for 30 minutes.',
          },
        ],
      },
      {
        heading: 'Steak',
        steps: [
          {
            text:
              'Place the steak in a bag or covered container, add the reserved half of the marinade, and refrigerate for 30 minutes.',
          },
        ],
      },
      {
        heading: 'Peppers and Onions',
        steps: [
          { text: 'Cut the poblano or bell peppers into strips about a half inch wide (about a cup and a half).' },
          { text: 'Cut the onion into eighths (about a cup).' },
        ],
      },
      {
        heading: 'Cooking',
        steps: [
          { text: 'Preheat the grill to a minimum of 350°F (oven 400°F).' },
          {
            text:
              'Start the chicken first so it has time to reach a safe internal temperature of 165°F, measured in the thickest part.',
            safety: true,
          },
          {
            text:
              'Grill the steak to an internal temperature of at least 145°F, then let it rest 3 minutes before you cut it.',
            safety: true,
          },
          {
            text:
              'In a large skillet, sauté the peppers and onions with a tbsp of Squirrel Made Hatch Green Chili infused olive oil, add Squirrelly Four Chile (about 1–3 tsp), and sauté.',
          },
          {
            text:
              'Cut the chicken and steak into strips — on a clean board, with a clean knife, not the ones that held the raw meat.',
            safety: true,
          },
          {
            text:
              'Once the onions and peppers begin to soften, add the chicken and steak strips and remove from the heat.',
          },
          {
            text:
              'Serve with corn or flour tortillas, rice and beans, and a festive beverage. (Try mixing a tablespoon of chipotle lime balsamic into your rice for extra flavor.)',
          },
        ],
      },
    ],
    safetyNotes: [
      'Split the marinade before it touches raw meat. Marinade that has held raw chicken or beef goes in the trash, not on the table.',
      'Chicken is done at 165°F internal. Beef steak is done at 145°F internal with a 3-minute rest.',
      'Keep raw chicken away from anything that is ready to eat — tortillas, cut vegetables, the serving platter.',
    ],
    products: [
      { handle: 'chipotle-lime-infused-25-star-white-balsamic-vinegar', as: 'Chipotle Lime White Balsamic' },
      { handle: 'hatch-green-chili-extra-virgin-olive-oil', as: 'Hatch Green Chili Olive Oil' },
      { handle: 'squirrelly-4-chile-fiesta', as: 'Squirrelly 4 Chile Fiesta' },
    ],
    fromNewsletter: 'From the August 2026 Squirrel Made newsletter',
    notes: [
      'Source: 2-page recipe PDF attached to the Aug 25, 2026 newsletter thread. The earlier Aug 4 PSD was incomplete and was not used.',
      'SAFETY EDIT: source step 2 had you cover the chicken with the marinade and *then* reserve half for the steak. Reordered so the split happens before the marinade meets raw meat.',
      'SAFETY EDIT: source said "Grill steak to preferred temp (a little short for reheating…)". Replaced with the USDA minimum, 145°F + 3-minute rest.',
      'SAFETY EDIT: added the clean-board line at the cutting step, and the cross-contamination note.',
      'REVIEW EDIT: omitted the unbounded counter-temperature step; keep the marinated meat refrigerated until cooking. The extra oil and spice quantities already in the skillet method are also listed in the ingredients.',
      'Spelling only: source reads "Pablano" and "Squirrely"; published as "poblano" and "Squirrelly" to match the catalog product name. No quantities changed.',
      'Omitted from the source newsletter: the September 2026 coupon code and the expired market dates.',
      'Times are the source\'s own and are internally consistent (15 + 35 + 30 = 1:20), so all four are published.',
    ],
  },
  {
    slug: 'chocolate-balsamic-barbecue-chicken-thighs',
    title: 'Chocolate Balsamic Barbecue Chicken Thighs',
    summary:
      'Chicken thighs marinated in Squirrel Made Chocolate Infused Traditional Balsamic Vinegar, rubbed with Chef Squirrel\'s Blend and smoked paprika, and finished with a balsamic barbecue glaze.',
    intro:
      'The dark chocolate balsamic does double duty — it is the marinade first, then it reduces down with tomato paste into the barbecue sauce you glaze the thighs with. Chef Squirrel\'s Blend and smoked paprika go on as a dry rub in between.',
    course: 'Dinner, Main Course',
    servings: '8 servings',
    times: {
      prep: { label: '10 min', iso: 'PT10M' },
      marinate: { label: '3 hours minimum, refrigerated', iso: 'PT3H' },
    },
    ingredients: [
      {
        heading: null,
        items: [
          '3–4 lbs. chicken thighs (about 12) — bone in or out, skin on or off, your preference',
          "6 Tbsp. Squirrel Made Chef Squirrel's Blend",
          '8 oz. Squirrel Made Chocolate Infused Traditional Balsamic Vinegar',
          '3 Tbsp. smoked paprika',
          '1 Tbsp. Worcestershire sauce',
          '2 Tbsp. tomato paste (from a tube, such as Cento brand)',
        ],
      },
    ],
    instructions: [
      {
        heading: null,
        steps: [
          {
            text:
              'Start with a medium bowl. Add the chicken thighs, cover with the Squirrel Made Chocolate Infused Balsamic, and add the Worcestershire sauce. Place the bowl in the refrigerator and marinate for a minimum of 3 hours.',
          },
          {
            text:
              "Before you take the chicken out, whisk Chef Squirrel's Blend together with the smoked paprika. Set it aside for later.",
          },
          { text: 'Preheat the oven to 375°F. A grill held at a similar temperature works too.' },
          {
            text:
              'Take the thighs out of the refrigerator. Drain and pat them dry, laying them on a sheet pan. Save the balsamic to make the sauce.',
          },
          { text: 'Apply the spice mixture to the chicken as a rub.' },
          {
            text:
              'In a small sauce pan, pour in the balsamic and heat it on low — balsamic will caramelize and burn otherwise. Add the tomato paste, whisking until thoroughly combined.',
          },
          {
            text:
              'That balsamic held raw chicken, so bring the sauce to a full rolling boil before it goes anywhere near cooked food or the table. Then remove it from the heat.',
            safety: true,
          },
          {
            text:
              'Cook the chicken thighs until the internal temperature reaches 165°F, measured in the thickest part away from the bone.',
            safety: true,
          },
          {
            text:
              'Brush the thighs with the sauce for a glaze, or toss the thighs with the sauce in a clean bowl and serve.',
          },
        ],
      },
    ],
    safetyNotes: [
      'The marinade becomes the sauce in this recipe. Because it held raw chicken, it has to reach a full rolling boil before it touches cooked food.',
      'Chicken thighs are done at 165°F internal, measured in the thickest part away from the bone.',
      'Marinate in the refrigerator, not on the counter.',
    ],
    products: [
      { handle: 'chocolate-infused-25-star-traditional-balsamic-vinegar', as: 'Chocolate Infused Traditional Balsamic' },
      { handle: 'chef-squirrels-blend', as: "Chef Squirrel's Blend" },
    ],
    fromNewsletter: 'From the July 2026 Squirrel Made newsletter',
    notes: [
      'Source: "SM Chocolate Barbecue Chicken Thighs.pdf", June 29, 2026. Page 2 of that PDF is blank except for a Pioneer Woman source URL — not published here; flag it to Jeremy if he wants the attribution on the page.',
      'CLIENT CORRECTION (Jun 30, 2026): smoked paprika 2 Tbsp → 3 Tbsp, tomato paste 1 Tbsp → 2 Tbsp. Published as corrected.',
      'CLIENT CORRECTION (Jul 1, 2026): the 1 Tbsp Worcestershire was listed in the ingredients but never appeared in the method. It now goes into the initial chicken/balsamic marinade, as he specified.',
      'OMITTED — cook time and total time. The PDF says cook 3.5 hrs and total 3 hrs 35 min alongside a 3-hour minimum marinade; those cannot all be true. Rather than guess, the page shows prep and marinade only. Ask Jeremy for the real oven time.',
      'OMITTED — the "Smoker 200" line. A 200°F smoker is not supported by the rest of the method and is not a temperature we will publish. Oven 375°F is the published method; "Grill similar" is kept because it is the source\'s own wording.',
      'SAFETY EDIT: source said "Ensure temp of mixture has reached a gentle boil for food safety." Strengthened to a full rolling boil and the reason stated, because this marinade held raw poultry.',
    ],
  },
];

export const RECIPE_SLUGS = RECIPES.map((r) => r.slug);

export function getRecipe(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}

/** Flat ingredient list for schema.org recipeIngredient. */
export function flatIngredients(recipe: Recipe): string[] {
  return recipe.ingredients.flatMap((g) => g.items);
}
