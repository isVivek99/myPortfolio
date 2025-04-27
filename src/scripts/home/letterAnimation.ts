import { animate } from "motion";
import type { LetterData } from "../../types/letterData";
import { classMap } from "../../const";
// Animation configuration constants
const ANIMATION = {
  DELAY: 300,
  DURATION: 2,
  EASING: "ease-in" as const,
  START_CHAR: "a",
  SELECTOR_PREFIX: "letters__",
};

// Name configuration
const NAME = {
  FIRST: "Vivek",
  LAST: "Lokhande",
  CAPITAL_POSITIONS: [0, 5], // First letters of first and last name
};

// Generate the letter data from the name
function generateLetterData(): LetterData[] {
  const fullName = `${NAME.FIRST}${NAME.LAST}`;

  return Array.from(fullName).map((char, index) => {
    const className = getClassNameByIndex(index);
    const selector = `${ANIMATION.SELECTOR_PREFIX}${className}`;

    return {
      className,
      targetChar: char,
      element: document.querySelector(`.${selector}`) as HTMLSpanElement | null,
    };
  });
}

// Map numeric index to class name
function getClassNameByIndex(index: number): string {
  return index < classMap.length ? classMap[index] : `unknown-${index}`;
}

// Run the animation with better organization
function runNameAnimation() {
  const letterData = generateLetterData();
  const startCharCode = ANIMATION.START_CHAR.charCodeAt(0);

  // Calculate target char codes once
  const letterTargets = letterData.map((data) => ({
    ...data,
    targetCharCode: data.targetChar.toLowerCase().charCodeAt(0),
  }));

  // Run the animation
  animate(
    (progress) => {
      letterTargets.forEach((data, index) => {
        if (!data.element) return;

        // Calculate current character
        const currentCharCode = Math.round(
          startCharCode + (data.targetCharCode - startCharCode) * progress,
        );

        const currentChar = String.fromCharCode(currentCharCode);

        // Capitalize if it's a first letter of first/last name
        const isCapital = NAME.CAPITAL_POSITIONS.includes(index);
        data.element.textContent = isCapital
          ? currentChar.toUpperCase()
          : currentChar;
      });
    },
    {
      duration: ANIMATION.DURATION,
      easing: ANIMATION.EASING,
    },
  );
}

// Start the animation after a delay
setTimeout(runNameAnimation, ANIMATION.DELAY);
