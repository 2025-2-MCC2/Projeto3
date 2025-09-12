// Centralized formatters and sanitizers

export const formatNumberBR = (value, minFractionDigits = 0) =>
  Number(value).toLocaleString("pt-BR", { minimumFractionDigits: minFractionDigits });

export const formatCurrencyBRL = (value) => `R$ ${formatNumberBR(value, 2)}`;

// Remove emojis and pictographs from strings (defensive rendering/sanitization)
export const stripEmojis = (text) =>
  String(text).replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
