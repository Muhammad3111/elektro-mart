module.exports = {
    i18n: {
        defaultLocale: "en",
        locales: ["en", "ru", "uz"],
        localeDetection: false,
    },
    reloadOnPrerender: process.env.NODE_ENV === "development",
};
