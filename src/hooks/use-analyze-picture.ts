import Predictions from "@aws-amplify/predictions";
import { useCallback, useState } from "react";

export const useAnalyzePicture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedNumbers, setAnalyzedNumbers] = useState<string[]>([]);

  const analyzePicture = useCallback(async (imageSrc: string) => {
    setIsLoading(true);
    try {
      const response = await Predictions.identify({
        text: {
          source: {
            bytes: Buffer.from(
              imageSrc.replace("data:image/jpeg;base64,", ""),
              "base64"
            ),
          },
          format: "PLAIN", // PLAIN or FORM or TABLE
        },
      });
      console.log("response:", response);
      const numbers = response.text.words
        .filter((word) => word.text && /^-?\d+$/.test(word.text))
        .map((word) => word.text!);
      // .map((word) => Number(word.text));
      console.log("numbers:", numbers);
      setAnalyzedNumbers(numbers);
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      console.error("error:", error.message);
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  const resetAnalyzedData = useCallback(() => {
    setAnalyzedNumbers([]);
    setError(null);
  }, []);

  return {
    analyzePicture,
    analyzedNumbers,
    isLoading,
    error,
    resetAnalyzedData,
  };
};