# 🛑 STOP — Run codemap FIRST

## Before ANY task

```bash
codemap .                     # REQUIRED: See project structure
```

## When to run what

```bash
codemap --deps                # When: "how does X work?", refactoring, tracing imports
codemap --diff                # When: reviewing changes, before commit, "what changed?"
codemap --diff --ref <branch> # When: comparing to specific branch (not main)
```

## Quick Reference

| Command             | Use Case             | Example            |
| ------------------- | -------------------- | ------------------ |
| `codemap .`         | Understand structure | Starting any task  |
| `codemap --deps`    | See connections      | Before refactoring |
| `codemap --diff`    | Review changes       | Before commit      |
| `codemap --skyline` | Visual overview      | Quick scan         |
