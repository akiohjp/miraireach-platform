import { createReviewNonce, generateReview } from "./reviewAssembler";

export async function generateMockReview(
  storeName: string,
  keywords: string[],
): Promise<string> {
  await new Promise((r) => setTimeout(r, 2000));
  return generateReview(storeName, keywords, { nonce: createReviewNonce() });
}
