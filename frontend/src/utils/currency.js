export const getCurrencySettings = () => {
  try {
    const savedSettings = localStorage.getItem(
      "expenseTrackerSettings"
    );

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      return settings.currency || "INR";
    }
  } catch (error) {
    console.error(
      "Failed to load currency settings:",
      error
    );
  }

  return "INR";
};

export const formatCurrency = (amount) => {
  const currency = getCurrencySettings();

  const currencyConfig = {
    INR: {
      locale: "en-IN",
      currency: "INR",
    },

    USD: {
      locale: "en-US",
      currency: "USD",
    },

    EUR: {
      locale: "de-DE",
      currency: "EUR",
    },

    GBP: {
      locale: "en-GB",
      currency: "GBP",
    },
  };

  const config =
    currencyConfig[currency] ||
    currencyConfig.INR;

  return new Intl.NumberFormat(
    config.locale,
    {
      style: "currency",
      currency: config.currency,
      maximumFractionDigits: 0,
    }
  ).format(Number(amount) || 0);
};