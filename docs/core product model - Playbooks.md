# StayFunded Core Product Model (LOCKED)

This document updates and **overrides** prior assumptions in the blueprint. These decisions are foundational and must directly inform schema, routing, naming, permissions, and future social integration.

---

## 1. Core Product Model (Authoritative)

**StayFunded is a playbook-driven lifecycle system.**

The primary value unit is a **Playbook**.

Playbooks are:

* **Firm-specific**
* **Phase-specific**
* Not signals, strategies, or education

A Playbook defines:

* Phase objective (what success actually means here)
* Primary risk (what blows accounts here)
* Common failure modes
* Professional posture / behavior
* What to ignore
* How the phase ends and what changes next

Playbooks do **not** tell traders what to trade.

> Playbooks must be treated as first-class objects in the system.

---

## 2. Paths = Lifecycle Containers

**Paths are lifecycle containers, not content progressions.**

Paths:

* Sequence Playbooks across a prop firm lifecycle
* Are firm-specific
* Gate access by phase
* Represent account state, not learning progress
* Will later control permissions (including social access)

Paths are templates. Accounts are instances.

---

## 3. Account State (Source of Truth)

Each Account must explicitly track:

* Prop firm
* Current phase
* Active Path (template)
* Which Playbooks are unlocked

Account state — not URLs, not roles — is the system of record.

---

## 4. Social Layer (Intent Locked)

Social is an extension of Paths and Playbooks.

Planned characteristics:

* Discord-based
* Firm-specific
* Phase-gated
* Read-mostly
* Structured (no general chat)

No guru model. No opinion feeds.

Language must reference:

* "Phase-specific rooms"
* "Firm rooms"

Never "community".

Paths and Playbooks must be designed assuming future Discord role + room mapping.

---

## 5. Pricing Model (v1 Locked)

* Primary: **$49/month**
* Secondary: **$199/year** (confidence option, not default CTA)

Value is delivered during **active phases**, not annually.

UX must assume:

* Ongoing monthly engagement
* Live account state

Avoid designs that feel like static reference material.

---

## 6. Language & Positioning (Non‑Negotiable)

Use **Playbook** language consistently.

Avoid:

* Strategies
* Education
* Resources

Preferred framing:

* Firm-specific playbooks
* Phase playbooks
* Lifecycle playbooks

This language is intentional for pricing power and conversion.

---

## 7. Explicit Non‑Goals

Do NOT design StayFunded as:

* A content library
* A course platform
* A coaching system
* A signals product

No trade calls. No personalities. No feeds.

---

## 8. Data Model Implications (Summary)

First‑class objects:

* Firm
* Phase
* Playbook
* Path (template)
* Account (instance)

Access is determined by:

* Account.current_phase
* Account.path_template
* Explicit Playbook unlocks

Social permissions will later map directly from this state.

---

## 9. Documentation Impact

All existing docs referencing:

* Guides
* Resources
* Strategies

Must be reviewed and likely renamed to **Playbooks**.

Do **not** proceed assuming old blueprint language is final.

---

**Status:** LOCKED — Required before account, path, and lifecycle implementation.
