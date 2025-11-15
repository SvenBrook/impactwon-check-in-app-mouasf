
# Assessment Questions

This file contains placeholder questions for the ImpactWon Client Expert Competency Framework.

## Current Status

The app currently uses placeholder questions. You mentioned you will add the exact wording later.

## How to Update Questions

To update the questions with the actual wording:

1. Open `data/competencies.ts`
2. Replace the placeholder text in each question with your actual question text
3. Ensure the scale (3 or 5) is correct for each question
4. The Leadership & Ethics section has 2 questions with scale: 3 and 3 questions with scale: 5

## Question Structure

Each competency has 5 questions. The structure is:

```typescript
{
  id: 'unique_id',
  text: 'Your question text here',
  scale: 3 | 5  // 3-point or 5-point scale
}
```

## Rescaling

Questions with a 1-3 scale are automatically rescaled to 1-5 for calculating averages using the formula:
`scaled = 1 + (original - 1) * (4 / 2)`

This ensures all competencies are comparable on the radar chart.
