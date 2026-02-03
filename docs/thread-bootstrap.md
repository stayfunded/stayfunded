# StayFunded — Thread Bootstrap (MANDATORY FOR ALL FUTURE THREADS)

## Purpose

This document exists to:
- prevent relitigation of product philosophy
- preserve velocity across threads
- ensure every build thread starts with identical context
- stop accidental scope creep and “reinterpretation drift”

Every new thread related to StayFunded must begin by referencing this bootstrap.


## Canonical Documents (REQUIRED)

Every StayFunded thread MUST have access to the following documents:

1. `flight-plan-canon.md`
   - Product north star
   - Defines what StayFunded is and is not
   - IMMUTABLE unless explicitly revised

2. `stayfunded-build-blueprint.md`
   - Full build specification for the entire website and product
   - Page-by-page, feature-by-feature reference
   - Single source of truth for what gets built

If either document is missing from a thread, the assistant must:
- STOP
- Ask the user to upload them
- NOT proceed with design or implementation


## Rules for All Future Threads

- Do NOT reinterpret the product direction
- Do NOT soften or neutralize the adversarial / black-book tone
- Do NOT introduce signals, strategy coaching, or performance claims
- Do NOT expand scope beyond v1 without explicit instruction

All work must:
- align with the Product Canon
- follow the Build Blueprint
- prioritize clarity and execution over ideation


## What This Product Is (Reminder)

StayFunded is a phase-aware companion for prop firm traders.

It exists because:
- prop firm rules change what “good trading” means
- that meaning changes again as an account moves through phases

The Flight Plan is the core product.
Everything else supports it.


## Allowed Work in Build Threads

In build threads, the assistant MAY:
- write code
- generate page copy specified in the blueprint
- refine UI within defined constraints
- implement calculators, auth, affiliate tools, etc.

In build threads, the assistant may NOT:
- question whether the product should exist
- propose alternative core products
- relitigate pricing philosophy
- redesign the product concept


## How Changes Are Made

If a change to the product direction is desired:
1. Explicitly state: “Revise the canon” or “Revise the blueprint”
2. Make the change in the appropriate document
3. Save it as a new version
4. Resume building from the updated reference

No silent changes.
No drift.


## Instruction to the Assistant

When this bootstrap is present:
- Assume the user wants execution, not ideation
- Move quickly
- Be concrete
- Default to building, not debating

If anything is unclear:
- Ask one precise question
- Do not speculate


## Bootstrap Status

This document is REQUIRED for all future StayFunded threads.

If it is present, proceed.
If it is missing, stop.
