import Predictions from "@aws-amplify/predictions";
import { useCallback, useState } from "react";
import { logger } from "../index";

export const useAnalyzePicture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [analyzedNumbers, setAnalyzedNumbers] = useState<string[]>([]);

  const analyzePicture = useCallback(async (imageSrc: string) => {
    setIsLoading(true);
    try {
      // 画像解析実行
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

      // 画像解析結果を数値でフィルタリング後、数値降順ソート配列生成
      const numbers = response.text.words
        .filter((word) => word.text && /^-?\d+$/.test(word.text))
        .map((word) => word.text!)
        .sort((a, b) => Number(b) - Number(a));

      setAnalyzedNumbers(numbers);
      setIsLoading(false);
      logger.info(
        "It succeeded to an analyze image.",
        `result values: ${numbers.length > 0 ? numbers.toString() : "none"}`
      );
    } catch (err) {
      const error = err as Error;
      logger.error(
        "An error occurred while creating and updating a patient.",
        error.message
      );
      setError(error);
      setIsLoading(false);
    }
  }, []);

  const resetAnalyzedData = useCallback(() => {
    setAnalyzedNumbers([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    analyzePicture,
    analyzedNumbers,
    isLoading,
    error,
    resetAnalyzedData,
  };
};
