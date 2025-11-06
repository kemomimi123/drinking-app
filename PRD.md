# Planning Guide

A tool to help determine whether an all-you-can-drink plan (nomihoudai) is cost-effective for a company drinking party, specifically for a new employee training celebration where juniors pay a flat rate and seniors split the remaining cost.

**Experience Qualities**:
1. **Clear** - The calculation and recommendation should be immediately obvious without confusion
2. **Practical** - Focused on real-world drinking party scenarios with Japanese business customs
3. **Efficient** - Quick input and instant results for on-the-spot decision making

**Complexity Level**: Micro Tool (single-purpose)
  - This is a focused calculator with a single purpose: determine if nomihoudai is cost-effective based on party composition and pricing.

## Essential Features

### Cost Comparison Calculator
- **Functionality**: Calculates per-person cost for seniors with and without all-you-can-drink plan, automatically computing total costs from input parameters
- **Purpose**: Helps decision-makers quickly determine the most economical option without needing to manually calculate total bills
- **Trigger**: User inputs party details and food/drink parameters
- **Progression**: Enter party size → Enter food cost per person and drink consumption patterns → Enter drink pricing → View automatic total calculation → View per-person senior cost comparison → See clear recommendation
- **Success criteria**: Accurate automatic calculation of total bills (with and without nomihoudai) showing senior per-person cost in both scenarios with a clear recommendation and breakdown of how totals were computed

### Party Composition Input
- **Functionality**: Input fields for number of juniors and seniors, junior payment amount
- **Purpose**: Define the party structure for accurate cost splitting
- **Trigger**: Page load shows empty input fields with sensible defaults
- **Progression**: User enters numbers → Values update in real-time → Validation ensures positive integers
- **Success criteria**: Clean numeric input with clear labels in Japanese context, default junior payment of ¥1,000

### Food and Drink Parameter Input
- **Functionality**: Input fields for food cost per person, number of drinks per person (alcohol and soft drinks), and pricing for individual drinks and nomihoudai
- **Purpose**: Calculate total costs automatically based on realistic party parameters instead of requiring manual total calculation
- **Trigger**: User has party composition entered
- **Progression**: Enter food cost per person (default ¥3,000) → Enter average drinks per person (4 alcohol, 2 soft drinks) → Adjust drink prices if needed (alcohol ¥500, soft drink ¥300, nomihoudai ¥2,000) → Total costs calculated automatically → See real-time comparison
- **Success criteria**: Sensible defaults matching typical izakaya pricing (especially chains like Mirai Saka), automatic calculation of totals with and without nomihoudai, clear breakdown showing how totals are computed

### Results Display
- **Functionality**: Shows senior per-person cost for both scenarios with difference highlighted
- **Purpose**: Makes the financial impact immediately clear
- **Trigger**: All required fields are filled with valid data
- **Progression**: Calculation happens automatically → Results appear → Clear visual indicator of better option → Specific savings amount shown
- **Success criteria**: Prominent display of recommendation with exact savings per senior

## Edge Case Handling

- **Zero or negative values**: Prevent submission and show validation hint
- **No seniors**: Show message that calculation requires at least one senior  
- **Junior payment exceeds total**: Alert that juniors' payment cannot exceed calculated total bill
- **Equal costs**: Indicate no financial difference, choice is based on preference
- **Very large numbers**: Handle calculations without breaking, format large yen amounts properly
- **Zero drinks or food**: Handle edge cases where someone inputs 0 for drinks or food gracefully

## Design Direction

The design should feel practical and trustworthy like a financial calculator, with a clean and focused interface that emphasizes clarity over decoration - this is a utility tool for quick decision-making in real business situations.

## Color Selection

Custom palette with business-appropriate colors that communicate trustworthiness and clarity.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Conveys professionalism and trust for financial calculations
- **Secondary Colors**: Soft Gray (oklch(0.95 0.005 250)) for backgrounds and Light Blue (oklch(0.85 0.08 250)) for accents
- **Accent Color**: Vibrant Green (oklch(0.65 0.18 145)) - Highlights the recommended (money-saving) option
- **Foreground/Background Pairings**:
  - Background (White oklch(0.99 0 0)): Dark Gray text (oklch(0.25 0.01 250)) - Ratio 13.8:1 ✓
  - Card (Soft Gray oklch(0.97 0.005 250)): Dark Gray text (oklch(0.25 0.01 250)) - Ratio 12.5:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text (oklch(0.99 0 0)) - Ratio 9.2:1 ✓
  - Accent (Green oklch(0.65 0.18 145)): Dark text (oklch(0.25 0.01 145)) - Ratio 7.8:1 ✓
  - Muted (Light Gray oklch(0.92 0.005 250)): Medium Gray text (oklch(0.50 0.01 250)) - Ratio 5.1:1 ✓

## Font Selection

Use clean, highly legible sans-serif fonts that work well for both Japanese and numeric content - Inter for its excellent number rendering and readability.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight spacing - Clear app identity
  - H2 (Section Headers): Inter SemiBold/20px/normal spacing - Organize input sections
  - H3 (Result Labels): Inter SemiBold/18px/normal spacing - Emphasize key outputs
  - Body (Input Labels): Inter Regular/16px/relaxed spacing - Clear guidance
  - Large Numbers (Results): Inter Bold/28px/tabular numbers - Easy scanning of costs
  - Small Text (Helper): Inter Regular/14px/relaxed spacing - Additional context

## Animations

Minimal, functional animations that guide attention to calculation results without adding unnecessary delays - the tool should feel instant and responsive.

- **Purposeful Meaning**: Subtle transitions on result appearance to draw attention when calculations update, smooth number changes for professional feel
- **Hierarchy of Movement**: Results area gets gentle fade-in when values change, recommendation badge has subtle scale-in to highlight the better choice

## Component Selection

- **Components**:
  - Card: Main container for the calculator with subtle elevation
  - Input: Numeric inputs with yen symbol and clear labels
  - Label: Descriptive labels for all inputs in Japanese
  - Badge: Highlight the recommended option with accent color
  - Separator: Divide input sections from results section
  
- **Customizations**:
  - Custom result display cards with larger typography for readability
  - Currency-specific input formatting (¥ prefix, thousand separators)
  - Prominent recommendation badge with icon (thumbs up or checkmark)
  
- **States**:
  - Inputs: Default, focused (blue ring), error (red border with message), disabled
  - Calculate button: Default, hover (slight lift), active (press), disabled (muted)
  - Results: Hidden (when incomplete), visible (fade in), highlighted (recommended option with green accent)
  
- **Icon Selection**:
  - Users/UsersThree for party composition
  - CurrencyYen/CurrencyCircleDollar for cost inputs
  - CheckCircle for recommended option
  - Calculator for calculation action
  
- **Spacing**:
  - Container padding: p-6 on mobile, p-8 on desktop
  - Input groups: gap-4 for related inputs
  - Sections: gap-6 to separate input areas from results
  - Card margins: mb-4 between major sections
  
- **Mobile**:
  - Stack all inputs vertically on mobile with full width
  - Larger touch targets (min 44px height) for inputs and buttons
  - Fixed-width container on desktop (max-w-2xl) for focused experience
  - Results display remains clear and scannable on small screens with slightly reduced text sizes
