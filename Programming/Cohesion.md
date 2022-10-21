---
id: 22kfPTTuAa1aK1nmZuC558
title: Cohesion
---




# Cohesion

Degree to which members of a class serve a unifying task or concept

Abstractions and design should allow related methods and fields to be together

High cohesion is when a class that does a well defined job. Low cohesion is when a class does a lot of jobs that don't have much in common.

### Different types of Cohesion:

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

```typescript
victory() {
    this.level.playMusic('win')
    this.clearFrames()
    this.view.show()
    this.setImage()
    this.level.next()
}
```

* Temporal Cohesion
    - Functionality grouped because it happens at the same point in the execution of the system and isn't related at all.
    - Problematic
* Logical Cohesion
    - Functionaliy combined for task, regardless of intent.
    - Functions do not make sense in their context

```typescript
setLifes(lifes: number) {
    this.lifes = lifes
    this.level
        .word.parent()
        .children('#liveNumber')
        .text(this.lifes)
}
```

* Coincidental Cohesion
    - Functionality arbitrarily grouped together
    - Hard to understand and reuse
    - Lack of any cohesion at all

----

More about cohesion:

- Different between Sequential and Procedural Cohesion: http://pages.cpsc.ucalgary.ca/~eberly/Courses/CPSC333/Lectures/Design/cohesion.html#procedural
- http://pages.cpsc.ucalgary.ca/~eberly/Courses/CPSC333/Lectures/Design/cohesion.html#procedural
