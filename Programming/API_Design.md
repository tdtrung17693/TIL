# API Design

## Factors

* Utility
* Technical Debt

## High Level API Design

+ Do one thing 'n do it well
+ Never expose internals
+ Should be as small as possible

__z.B__: 

|                        | `getPaidUsersAndSortByName()`                  |
|------------------------|------------------------------------------------|
| Do one thing           | `getUsers(isPaid: boolean, sortIndex: number)` |
| Never expose internals | `getUsers(isPaid: boolean, key: Users.KEY)`    |
| As small as possible   | `getUsers(isPaid: boolean)`                    |
| Usability              | `getUsers(isPaid: boolean): User[]`            |

## Low Level API Design

+ Avoid long parameter lists => Encapsulate parameter into an object
+ Return descriptive objects
+ Avoid exceptional returns

__z.B__:

`getUsers(): User[] | null` => just return an empty `User` list instead of null

+ Handle exceptional circumstances: may mistakenly leak the details of internal implementations
+ Favour immutability
+ Favour private classes, fields and methods


