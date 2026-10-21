# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript, GSAP, three.js, Remotion (separate package for exported video). Deployed to Vercel. Confirmed by the owner.

## Users

Three audiences create agents: Pine Labs employees, external developers, and merchants. They arrive from the landing page or at an event (Singapore Fintech Festival) and have a minute to see the point. Source: `agenticorg-onboarding-journey/prd.md`.

## Product Purpose

AgenticOrg is a platform where people create, run and govern AI agents. This repository is a clickable prototype of the new front door: sign in and sign up, welcome questions, the existing platform with a guided tour and checklist added on top, and a new landing page. Success is a first result the visitor made themselves.

## Positioning

Agents you can see and control: every agent starts in Shadow Mode, and a person approves what reaches the real world.

## Operating Context

The platform's own screens are not redesigned. The onboarding layer is added on top of them. The brand and design system for the new surface are in `agenticorg-onboarding-journey/design/design-system.md` (Open Studio).

## Capabilities and Constraints

- Sign in with Google, Microsoft or email. Create an organisation or join one.
- Join must not list organisation names to the public.
- Everything has light and dark, English first, and works at 390 px wide.
- Prototype only: no real authentication or data.

## Brand Commitments

Name AgenticOrg. Logo: option 8 "Checkpoint, three nodes" (`public/logo/`). Open Studio system: Bricolage Grotesque and Hanken Grotesk, coral, sky and lime colour field, ink primary buttons, rounded shapes. Not the Pine One look.

## Evidence on Hand

No sourced customer names, quotes or metrics. Do not invent them. Sample agent content is illustrative and must be labelled Sample.

## Product Principles

- Ask a question only if the answer changes what the user sees next.
- Give a first win before any setup.
- Say in plain words what is safe: nothing real is touched until a person approves.
- Never trap the user: every step can be skipped, resumed or replayed.
- Do not change existing platform screens; add on top.

## Accessibility & Inclusion

Text contrast 4.5:1, focus rings 3:1, 44 px tap targets, visible labels, keyboard reachable, reduced motion respected.

<!-- Assumptions: written from the PRD and the owner's chat answers on 21 Oct 2026, not from an interview round. -->
