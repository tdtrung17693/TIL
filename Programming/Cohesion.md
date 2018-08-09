# Cohesion

    High cohesion is when a class that does a well defined job. Low cohesion is when a class does a lot of jobs that don't have much in common.

### Different
Better -> Worst

* Functional Cohesion:
    - All code contributes to a single feature or task
* Sequential Cohesion
    - Output from one step is input of the next step
    - `This kind of cohesion is normal because these are the kinds of methods that allow the systems to perform complex tasks.`

```typescript
active(from: Mario) {
    // ..
    this.bounce();
    let coin = this.items.pop();
    coin.activate(from);
    this.actors.push(coin);
    // ..
}
```

* Communicational Cohesion
    - Tasks grouped in method only because of the data

```typescript
getRecord(key: string) {
    // ..
    if (key === 'bar') {
        this.translateBar(this.data)
    }
    if (key === 'baz') {
        this.translateBaz(this.data)
    }
    // ..
}
```
===> The first three kinds of cohesion indicate good program designs

* Procedural Cohesion
    - Parts of a module are grouped because they always follow a certain sequence of execution
    -
* Temporal Cohesion
* Logical Cohesion
    - Functionaliy combined for task, regardlessof intent.
    - Functions do not make sense in their context
* Coincidental Cohesion
    - Functionality arbitrarily grouped
    - Lack of any cohesion at all
