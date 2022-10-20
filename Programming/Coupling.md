---
id: kQ3kYk6kYM74sSSuDAwE4M
---


# Coupling

### Different types of Coupling

* Data Coupling: loosest coupling type
    - Coupling through simple primitive parameters
    - But, too many primitive parameters is not that good and should be avoided

```typescript
setSize(width: number, height: number) {...}
```

* Stamp Coupling:
    - Coupling through well-defined data structures

```typescript
enum SizeState {small = 1, big = 2}

setState(state: SizeState) {...}
```

* Control Coupling:
    - A caller controls the flow within another unit
    - Clean Code: avoid using boolean parameters

```typescript
handler(event: KeyboardEvent, status: boolean)
```

* Global Coupling: critical
    - Global Variables
    - Make code harder to reason about

### Conclusions:

* Coupling is a natural part of building software
* Knowing about coupling helps increase long term quality of code

