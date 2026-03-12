# Copilot Instructions

Apply these rules to all TypeScript files in this workspace.

## TypeScript Rules

- All methods must have an explicitly defined return type.
- All public methods must explicitly include the `public` accessor.
- All private methods must explicitly include the `private` accessor.
- All properties must have an explicitly defined type — no inferred types on class members.
- Never use `any`. Use `unknown` and narrow the type, or define a proper interface/type.
- Prefer `interface` over `type` for object shapes.
- Use `readonly` on properties that are never reassigned.
- Use strict null checks — never assume a value is non-null without a guard.

## File & Method Length

- Keep files short: generally under 500 lines.
- Keep methods short: generally under 100 lines.
- Keep code blocks short (for example `if {}`, `for {}`, `switch {}` blocks): ideally one page, and no more than 40-50 lines.
- If a file or method is growing too long, extract logic into helper methods or separate files.

## Comments

- Add a comment when the intent or reasoning behind logic is not immediately obvious.
- Do not comment on what the code does — comment on why it does it.
- Use `// TODO:` with a reason for any temporary or incomplete logic.
- Never leave commented-out code in a PR. Delete it or add a `// TODO:` with a reason.

## Code Style

- Prefer `const` over `let`. Never use `var`.
- Use early returns to avoid deeply nested logic.
- Avoid negated conditions in `if` statements where possible — prefer the positive case first.

## Naming

- Use `PascalCase` for classes, interfaces, enums, and type aliases.
- Use `camelCase` for variables, functions, and method names.
- Use `SCREAMING_SNAKE_CASE` for constants.
- Boolean variables and methods should start with `is`, `has`, `can`, or `should`.

## Imports

- Use absolute imports over relative imports where a path alias is configured.
- Group imports: external libraries first, then internal modules, then types.
- No unused imports.