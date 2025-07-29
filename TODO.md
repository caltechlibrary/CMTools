
# Action Items

## Bugs

## Next Steps

- [ ] There is additional metadata outside the codemeta.json file like executable files basenames that would be helpful and are not captured, what's the right way to do this without adding another "project" file to a repository
- [ ] For deno projects I have three general types, each have their own set of project artifacts
  1. Code that results in an executable (command line programs and services)
  2. Code that results in browser side JavaScript (example CL.js)
  3. Code the results in web components
- [ ] Work with Twila to come up with some default vanilla CSS generation (using CSS variables for easy customization)
- [ ] I need some sort of way of reducing the foot print of adding generated documents types
  - put each type in it's on module
  - use generated_text.ts as a means of re-exporting the types
  - create mechanism like `element.define()` in web component to "register" the supported types in transform.ts
  - think about types which could benefit from parameterrs (e.g. generate deno tasks for projects with multiple executables)
  - I want to be able to touch at most two plaves to add a new type (e.g. add the defined generated type and the type as module)
  - Do I need to have templates trigger based on file extension?  I think I should always generate specific documents with
    with the `cmt` command, this would simplify the logic
- [X] Move the generated text from transforms.ts to generated_text.ts

