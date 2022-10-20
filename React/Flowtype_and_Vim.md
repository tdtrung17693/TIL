---
id: vP93nC6Zrszb9pqZ68NR1a
---


# Flowtype and Vim

To use Syntastic with ESLint and Vim, we config Syntastic as below:

```vimscript
let g:syntastic_javascript_checkers = ['eslint', 'flow']
let g:syntastic_javascript_eslint_exe = 'flow'
```

Furthermore, eslint-plugin-flowtype must be installed in the project.
