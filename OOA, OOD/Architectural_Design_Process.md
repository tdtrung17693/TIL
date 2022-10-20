---
title: Architectural Design Process
tags: architecture, engineering
id: nbFh6W4RSvd9titzRxaXW4
---



* Phase 0: _Specify Properties_
    * Construct a context diagram
    * Indicate external actors but only one activity, the system itself
    * Indicate external stimuli (events) that can effect the system
    * Indicate how the system communicates its results back to the external actors (percepts)
    * Specify, in English, the behaviors you want the system to have
* Phase 1: _Componentize_
    * Decompose the system into components
    * Allocate responsibilities to them
    * Handling of eventsx
    * Delivery of percepts
    * Provision of the property guarantees
* Phase 2: _Determine Architectural Style_
    * Determine how the components will interact
    * For layered architecture
    * Assign the components to layers
    * Determine the dependencies between the layers
    * Update the guarantees
    * Select an invariant maintenance strategy
    * Assign responsibilty for invariant maintenance
