export default {
  semi: true,
  singleQuote: true,
  tabWidth: 4,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  overrides: [
    {
      files: '*.html',
      options: {
        tabWidth: 4,
      },
    },
    {
      files: '*.css',
      options: {
        tabWidth: 4,
      },
    },
  ],
};
